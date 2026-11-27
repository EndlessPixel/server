/**
 * Axolotl `interact` 动画在 skinview3d 上的等价播放器。
 *
 * 直接继承 skinview3d 的 `PlayerAnimation`，接入它自己的动画循环：
 * `progress` 每帧由引擎按 `speed` 推进，0.5 秒走完一轮（speed = 2）。
 * 数据来自 `lib/interact-animation-data.ts`（从 classic-player.gltf 提取）。
 *
 * 为什么不用内置的 HitAnimation：那是「被打一下」的挥拳动作，
 * 而 Axolotl 的 interact 是「身体前倾 + 手臂回弹」的互动动作，两者形态完全不同。
 */

import { PlayerAnimation, type PlayerObject, type SkinObject } from "skinview3d";
import { Quaternion, Vector3 } from "three";
import { INTERACT_FRAMES, INTERACT_TRACK, type InteractTrack } from "@/lib/interact-animation-data";

/** Axolotl 把 clip.duration 强制设为 0.5 秒 */
const DURATION_SECONDS = 0.5;

type Vec3 = [number, number, number];
type Quat = [number, number, number, number];

const _qa = new Quaternion();
const _qb = new Quaternion();
const _va = new Vector3();
const _vb = new Vector3();

/** 把归一化进度映射到帧索引与帧内插值系数 */
function locate(progress: number) {
  // Axolotl 的 clip 是 LoopOnce + clampWhenFinished：走到头就停在最后一帧
  const p = Math.min(Math.max(progress, 0), 1);
  const scaled = p * (INTERACT_FRAMES - 1);
  const index = Math.min(Math.floor(scaled), INTERACT_FRAMES - 2);
  return { index, t: scaled - index };
}

export class InteractAnimation extends PlayerAnimation {
  constructor() {
    super();
    // PlayerAnimation.update 里 progress += deltaTime * speed
    this.speed = 1 / DURATION_SECONDS;
  }

  protected animate(player: PlayerObject): void {
    // 未播放时 progress = 0，不要动骨骼——交给 idle 动画
    if (this.progress <= 0) return;

    const { index, t } = locate(this.progress);
    const skin = player.skin;
    applyQuats(skin, player.cape, INTERACT_TRACK.q, index, t);
    applyPositions(skin, INTERACT_TRACK.p, index, t);
  }
}

function applyQuats(
  skin: SkinObject,
  cape: { quaternion: Quaternion } | undefined,
  track: InteractTrack["q"],
  i: number,
  t: number,
) {
  const set = (part: { quaternion: Quaternion } | undefined, frames: Quat[] | undefined) => {
    if (!part || !frames) return;
    const a = frames[i];
    const b = frames[i + 1] ?? a;
    // three 的 slerp 要求单位四元数；数据已归一化，这里直接构造
    _qa.set(a[0], a[1], a[2], a[3]).normalize();
    _qb.set(b[0], b[1], b[2], b[3]).normalize();
    part.quaternion.copy(_qa).slerp(_qb, t);
  };

  set(skin.body, track.body);
  set(skin.head, track.head);
  set(skin.rightArm, track.rightArm);
  set(skin.leftArm, track.leftArm);
  set(cape, track.cape);
  set(skin.rightLeg, track.rightLeg);
  set(skin.leftLeg, track.leftLeg);
}

/**
 * skinview3d 中相关骨骼的初始位置（见 SkinObject 构造函数）：
 * body、rightLeg、leftLeg 会被动画改 position，其余骨骼不会。
 * 写成常量而不是运行时缓存，避免「首次点击时恰好被别的动画改过」导致基准漂移。
 */
const BASE_POSITIONS: Record<string, Vec3> = {
  body: [0, -6, 0],
  rightLeg: [-1.9, -12, -0.1],
  leftLeg: [1.9, -12, -0.1],
};

function applyPositions(skin: SkinObject, track: InteractTrack["p"], i: number, t: number) {
  const addOffset = (
    part: { position: Vector3 } | undefined,
    frames: Vec3[] | undefined,
    baseKey: string,
  ) => {
    if (!part || !frames) return;
    const a = frames[i];
    const b = frames[i + 1] ?? a;
    _va.set(a[0], a[1], a[2]);
    _vb.set(b[0], b[1], b[2]);
    _va.lerp(_vb, t);
    const base = BASE_POSITIONS[baseKey];
    part.position.set(base[0] + _va.x, base[1] + _va.y, base[2] + _va.z);
  };

  addOffset(skin.body, track.body, "body");
  addOffset(skin.rightLeg, track.rightLeg, "rightLeg");
  addOffset(skin.leftLeg, track.leftLeg, "leftLeg");
}
