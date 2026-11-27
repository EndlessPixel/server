/**
 * 皮肤预览的「点一下有反应」交互层 —— 复刻 Axolotl Launcher 的点击手感。
 *
 * Axolotl 的做法见 `packages/ui/src/composables/skin-rendering/use-skin-preview-animation.ts`：
 * 1. 点一下播放 0.5s 的 `interact` 骨骼动画；
 * 2. 每次点击累加能量（上限 5、每秒衰减 2），驱动模型的左右抖动 + 挤压；
 * 3. 能量攒满（≈0.7 秒内连点 5 下）触发一次 0.2s 红闪，随后 0.5s 冷却。
 *
 * skinview3d 没有 glTF 动画系统，但内置 `HitAnimation` 可作为 interact 的等价动作，
 * 且 `playerObject` 整体 transform 由我们独立控制，不与骨骼动画冲突 —— 于是三层都能复刻。
 *
 * 本模块只负责「算状态和施加状态」，不绑定 DOM、不启动循环：
 * 由调用方在 skinview3d 的渲染循环里调用 `update(delta)`，这样 dispose 后不会残留定时器。
 */

import { Color } from "three";
import type { PlayerAnimation, PlayerObject, SkinViewer } from "skinview3d";

/** 与 Axolotl `use-skin-preview-animation.ts` 中的常量保持一致 */
const MAX_ENERGY = 5;
const ENERGY_PER_CLICK = 1;
/** 每秒衰减 2 → 连点需 ≥2 次/秒才能攒起来 */
const DECAY_PER_SECOND = 2;
const BASE_SHAKE_SPEED = 18;
const SPEED_BOOST_PER_ENERGY = 7;
const OFFSET_X = 0.035;
const ROTATION_Z = 0.055;
const SCALE_X = 0.018;
const SCALE_Y = 0.025;
const FLASH_DURATION = 0.2;
const FLASH_REPEAT_DELAY = 0.5;
const FLASH_MAX_INTENSITY = 0.7;
const HIT_ANIMATION_DURATION = 0.5;

const FLASH_COLOR = 0xbd2f2f;
const FLASH_SHADER_KEY = "skin-click-damage-flash";

type FlashShader = {
  uniforms: Record<string, { value: unknown }>;
  fragmentShader: string;
};

type FlashMaterial = {
  userData: Record<string, unknown>;
  onBeforeCompile: (shader: FlashShader, ...rest: unknown[]) => void;
  customProgramCacheKey: () => string;
  needsUpdate: boolean;
};

/**
 * skinview3d 没有公开渲染循环钩子，但 `render()` 是它每帧必经的入口。
 * 包装这个方法即可在每帧渲染前更新交互状态，并且 dispose 时能干净还原。
 */
export type PatchableViewer = SkinViewer & {
  render: () => void;
};

/**
 * 把红闪注入 skinview3d 的皮肤材质。
 *
 * skinview3d 的 `SkinObject` 内部只有 4 个 `MeshStandardMaterial` 实例
 * （layer1/layer2 × normal/biased），且都被多个 mesh 共用，因此用 Set 去重，
 * 避免对同一材质重复安装 onBeforeCompile（那会导致 shader 编译多次、uniform 丢失）。
 * 披风材质不参与闪红 —— Axolotl 也排除了它。
 */
function collectSkinMaterials(player: PlayerObject): FlashMaterial[] {
  const found = new Set<FlashMaterial>();

  player.skin.traverse((object) => {
    const mesh = object as { isMesh?: boolean; material?: unknown };
    if (!mesh.isMesh || !mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material || typeof material !== "object") continue;
      found.add(material as FlashMaterial);
    }
  });

  return [...found];
}

function installFlashShader(material: FlashMaterial, intensity: number): void {
  if (material.userData[`${FLASH_SHADER_KEY}-installed`]) return;

  const previousOnBeforeCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey;

  material.onBeforeCompile = (shader: FlashShader) => {
    (previousOnBeforeCompile as typeof material.onBeforeCompile).call(
      material,
      shader,
      undefined as never,
    );

    shader.uniforms.uDamageFlashIntensity = { value: intensity };
    // GLSL 声明的是 vec3：必须传 THREE.Color（或数组），直接传 0xbd2f2f 会在
    // WebGL 的 uniform3fv 处抛「provided value cannot be converted to a sequence」
    shader.uniforms.uDamageFlashColor = { value: new Color(FLASH_COLOR) };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nuniform float uDamageFlashIntensity;\nuniform vec3 uDamageFlashColor;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      "gl_FragColor.rgb = mix(gl_FragColor.rgb, uDamageFlashColor, uDamageFlashIntensity * gl_FragColor.a);\n#include <dithering_fragment>",
    );

    material.userData[FLASH_SHADER_KEY] = shader;
  };

  material.customProgramCacheKey = () => `${previousCacheKey.call(material)}|${FLASH_SHADER_KEY}`;
  material.userData[`${FLASH_SHADER_KEY}-installed`] = true;
  material.needsUpdate = true;
}

export class SkinClickInteraction {
  private energy = 0;
  private phase = 0;
  private flashRemaining = 0;
  private flashCooldown = 0;
  private flashIntensity = 0;
  private hitTimer: ReturnType<typeof setTimeout> | null = null;
  private materials: FlashMaterial[] = [];
  private disposed = false;

  private originalRender: (() => void) | null = null;
  private lastFrameAt = 0;

  constructor(
    private readonly viewer: PatchableViewer,
    private readonly animations: { idle: () => PlayerAnimation; hit: () => PlayerAnimation },
  ) {}

  /** 皮肤加载完成后调用：收集材质，并挂上每帧更新。可重复调用。 */
  attach(): void {
    this.materials = collectSkinMaterials(this.viewer.playerObject);

    if (this.originalRender) return;
    this.originalRender = this.viewer.render;
    this.lastFrameAt = performance.now();

    const wrapper = () => {
      const now = performance.now();
      // 切到后台再回来时 delta 会很大，钳制上限避免能量瞬间归零 / 相位乱跳
      const delta = Math.min((now - this.lastFrameAt) / 1000, 0.1);
      this.lastFrameAt = now;

      if (!this.disposed) this.update(delta);
      this.originalRender?.call(this.viewer);
    };

    this.viewer.render = wrapper;
  }

  /**
   * 点击（非拖拽）时调用。
   * 连点越快，抖动越剧烈；攒满 5 格触发红闪。
   */
  click(): void {
    if (this.disposed) return;

    this.energy = Math.min(MAX_ENERGY, this.energy + ENERGY_PER_CLICK);
    if (this.energy >= MAX_ENERGY && this.flashCooldown <= 0) {
      this.flashRemaining = FLASH_DURATION;
      this.flashCooldown = FLASH_DURATION + FLASH_REPEAT_DELAY;
      this.flashIntensity = FLASH_MAX_INTENSITY;
    }

    // 播放一次击打动作，0.5s 后回到 idle。
    // skinview3d 切换 animation 会重置骨骼姿态，正好对应 Axolotl 的 clip 结束淡出。
    this.viewer.animation = this.animations.hit();
    if (this.hitTimer) clearTimeout(this.hitTimer);
    this.hitTimer = setTimeout(() => {
      if (!this.disposed) this.viewer.animation = this.animations.idle();
    }, HIT_ANIMATION_DURATION * 1000);
  }

  /** 由 skinview3d 的 onBeforeRender 钩子每帧调用；delta 单位为秒 */
  update(delta: number): void {
    if (this.disposed) return;

    this.energy = Math.max(0, this.energy - DECAY_PER_SECOND * delta);
    this.flashCooldown = Math.max(0, this.flashCooldown - delta);
    this.flashRemaining = Math.max(0, this.flashRemaining - delta);
    this.flashIntensity =
      this.flashRemaining > 0 ? FLASH_MAX_INTENSITY * (this.flashRemaining / FLASH_DURATION) : 0;

    const player = this.viewer.playerObject;

    if (this.energy <= 0) {
      player.position.x = 0;
      player.rotation.z = 0;
      player.scale.set(1, 1, 1);
    } else {
      const intensity = this.energy / MAX_ENERGY;
      this.phase += delta * (BASE_SHAKE_SPEED + this.energy * SPEED_BOOST_PER_ENERGY);

      const shake = Math.sin(this.phase) * intensity;
      const squash = Math.abs(Math.sin(this.phase * 1.7)) * intensity;

      player.position.x = shake * OFFSET_X;
      player.rotation.z = shake * ROTATION_Z;
      player.scale.set(1 + squash * SCALE_X, 1 - squash * SCALE_Y, 1);
    }

    this.applyFlash();
  }

  private applyFlash(): void {
    for (const material of this.materials) {
      installFlashShader(material, this.flashIntensity);
      const shader = material.userData[FLASH_SHADER_KEY] as
        { uniforms: Record<string, { value: unknown }> } | undefined;
      if (shader?.uniforms.uDamageFlashIntensity) {
        shader.uniforms.uDamageFlashIntensity.value = this.flashIntensity;
      }
    }
  }

  dispose(): void {
    this.disposed = true;
    if (this.hitTimer) clearTimeout(this.hitTimer);
    this.hitTimer = null;

    const player = this.viewer.playerObject;
    player.position.x = 0;
    player.rotation.z = 0;
    player.scale.set(1, 1, 1);

    if (this.originalRender) {
      this.viewer.render = this.originalRender;
      this.originalRender = null;
    }
    this.materials = [];
  }
}
