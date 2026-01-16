import { release } from "os";

export const launcherRepos = [
  { key: "hmcl", owner: "HMCL-dev", repo: "HMCL", displayName: "Hello Minecraft Launcher", releases: true, },
  { key: "hmcl-pe", owner: "HMCL-dev", repo: "HMCL-PE", displayName: "Hello Minecraft Launcher: Pocket Edition", releases: true, },
  { key: "fcl", owner: "FCL-Team", repo: "FoldCraftLauncher", displayName: "Fold Craft Launcher", releases: true, },
  { key: "pcl-mac", owner: "PCL-Community", repo: "PCL.Mac", displayName: "PCL-Mac", releases: false, },
  { key: "pcl2-ce", owner: "PCL-Community", repo: "PCL2-CE", displayName: "PCL2-CE", releases: true, },
  { key: "pcl-2", owner: "Meloong-Git", repo: "PCL", displayName: "PCL2", releases: "empty", },
  { key: "pcl1", owner: "LTCatt", repo: "PCL1", displayName: "PCL1", releases: false, },
  { key: "pojav", owner: "PojavLauncherTeam", repo: "PojavLauncher", displayName: "PojavLauncher", releases: true, },
  { key: "pojav-ios", owner: "PojavLauncherTeam", repo: "PojavLauncher_iOS", displayName: "PojavLauncher_iOS", releases: true, },
  { key: "modrinth", owner: "modrinth", repo: "code", displayName: "Modrinth", releases: "empty", },
  { key: "atlauncher", owner: "ATLauncher", repo: "ATLauncher", displayName: "ATLauncher", releases: true, },
  { key: "polymc", owner: "PolyMC", repo: "PolyMC", displayName: "PolyMC", releases: true, },
  { key: "xmcl", owner: "Voxelum", repo: "x-minecraft-launcher", displayName: "X-Minecraft-Launcher", releases: true, },
  { key: "helios", owner: "dscalzi", repo: "HeliosLauncher", displayName: "HeliosLauncher", releases: true, },
  { key: "prismLauncher", owner: "PrismLauncher", repo: "PrismLauncher", displayName: "PrismLauncher", releases: true, },
  { key: "mcinabox", owner: "AOF-Dev", repo: "MCinaBox", displayName: "MCinaBox", releases: true, },
  { key: "gdlauncher", owner: "gorilla-devs", repo: "GDLauncher", displayName: "GDLauncher", releases: true, },
  { key: "portablemc", owner: "mindstorm38", repo: "portablemc", displayName: "portablemc", releases: true, },
  { key: "olauncher", owner: "olauncher", repo: "olauncher", displayName: "olauncher", releases: true, },
  { key: "zalith2", owner: "ZalithLauncher", repo: "ZalithLauncher2", displayName: "ZalithLauncher2", releases: true, },
  { key: "zalith", owner: "ZalithLauncher", repo: "ZalithLauncher", displayName: "ZalithLauncher", releases: true, },
  { key: "betacraft", owner: "betacraftuk", repo: "betacraft-launcher", displayName: "Betacraft Launcher", releases: true, },
  { key: "mcl-core", owner: "Pierce01", repo: "MinecraftLauncher-core", displayName: "MinecraftLauncher Core", releases: false, },
  { key: "fluentlauncher", owner: "Xcube-Studio", repo: "Natsurainko.FluentLauncher", displayName: "FluentLauncher", releases: true, },
  { key: "vortex", owner: "Kron4ek", repo: "minecraft-vortex-launcher", displayName: "Vortex Launcher", releases: true, },
  { key: "pojav-glow", owner: "Vera-Firefly", repo: "Pojav-Glow-Worm", displayName: "Pojav Glow Worm", releases: true, },
  { key: "headlessmc", owner: "headlesshq", repo: "headlessmc", displayName: "HeadlessMC", releases: true, },
  { key: "sjmcl", owner: "UNIkeEN", repo: "SJMCL", displayName: "SJMCL", releases: true, },
  { key: "bmcl", owner: "bangbang93", repo: "BMCL", displayName: "BMCL", releases: false, },
  { key: "cmllib", owner: "CmlLib", repo: "CmlLib.Core", displayName: "CmlLib.Core", releases: true, },
  { key: "projbobcat", owner: "Corona-Studio", repo: "ProjBobcat", displayName: "ProjBobcat", releases: true, },
  { key: "liquid", owner: "CCBlueX", repo: "LiquidLauncher", displayName: "LiquidLauncher", releases: true, },
  { key: "selvania", owner: "luuxis", repo: "Selvania-Launcher", displayName: "Selvania Launcher", releases: true, },
  { key: "mcl-core-node", owner: "Voxelum", repo: "minecraft-launcher-core-node", displayName: "Minecraft Launcher Core Node", releases: true, },
  { key: "console-mcl", owner: "MrShieh-X", repo: "console-minecraft-launcher", displayName: "Console Minecraft Launcher", releases: true, },
  { key: "scl", owner: "Steve-xmh", repo: "scl", displayName: "SCL", releases: true, },
  { key: "freesm", owner: "FreesmTeam", repo: "FreesmLauncher", displayName: "FreesmLauncher", releases: true, },
  { key: "epherome", owner: "ResetPower", repo: "Epherome", displayName: "Epherome", releases: true, },
  { key: "jmccc", owner: "xfl03", repo: "JMCCC", displayName: "JMCCC", releases: true, },
  { key: "gravit", owner: "GravitLauncher", repo: "Launcher", displayName: "Gravit Launcher", releases: true, },
  { key: "freelauncher", owner: "dedepete", repo: "FreeLauncher", displayName: "FreeLauncher", releases: true, },
  // { key: "mclauncher-api", owner: "tomsik68", repo: "mclauncher-api", displayName: "Minecraft Launcher API", releases: true, }, !!!这是API，不是启动器
  { key: "levilaunchroid", owner: "LiteLDev", repo: "LeviLaunchroid", displayName: "LeviLaunchroid", releases: true, },
  { key: "kmccc", owner: "MineStudio", repo: "KMCCC", displayName: "KMCCC", releases: "empty",},
  { key: "luminaclient", owner: "TheProjectLumina", repo: "LuminaClient", displayName: "LuminaClient", },
  { key: "swiftcraft", owner: "suhang12332", repo: "Swift-Craft-Launcher", displayName: "Swift Craft Launcher", },
  { key: "nitrolaunch", owner: "Nitrolaunch", repo: "nitrolaunch", displayName: "Nitrolaunch", },
  { key: "rpmlauncher", owner: "RPMTW", repo: "RPMLauncher", displayName: "RPMLauncher", },
  { key: "gomclauncher", owner: "xmdhs", repo: "gomclauncher", displayName: "gomclauncher", },
  { key: "picomc", owner: "sammko", repo: "picomc", displayName: "picomc", },
  { key: "purelauncher", owner: "Apisium", repo: "PureLauncher", displayName: "PureLauncher", },
  { key: "openmc", owner: "sammwyy", repo: "OpenMC", displayName: "OpenMC", },
  { key: "modulelauncher", owner: "ahpxex", repo: "ModuleLauncher.Re", displayName: "ModuleLauncher.Re", },
  { key: "minilauncher", owner: "MiniDigger", repo: "MiniLauncher", displayName: "MiniLauncher", },
  { key: "gbclv3", owner: "Nullkooland", repo: "GBCLV3", displayName: "GBCLV3", },
  { key: "alicorn", owner: "Andy-K-Sparklight", repo: "Alicorn", displayName: "Alicorn", },
  { key: "flexberry", owner: "FlexberryLauncher", repo: "launcher", displayName: "Flexberry Launcher", },
  { key: "synth", owner: "SynthLauncher", repo: "SynthLauncher", displayName: "SynthLauncher", },
  { key: "minecraft-launcher-lib", owner: "JakobDev", repo: "minecraft-launcher-lib", displayName: "Minecraft Launcher Lib", },
  { key: "wonderlab", owner: "Lunova-Studio", repo: "WonderLab.Override", displayName: "WonderLab", },
  { key: "minecraftlaunch", owner: "Lunova-Studio", repo: "MinecraftLaunch", displayName: "MinecraftLaunch", },
  { key: "onelauncher", owner: "Polyfrost", repo: "OneLauncher", displayName: "OneLauncher", },
  { key: "battlylauncher", owner: "1ly4s0", repo: "battlylauncher", displayName: "BattlyLauncher", },
  { key: "decraft", owner: "counter185", repo: "DECRAFT_Launcher", displayName: "DECRAFT Launcher", },
  { key: "argon", owner: "v-pun215", repo: "Argon", displayName: "Argon", },
  { key: "multifold", owner: "MultifoldLauncher", repo: "multifold", displayName: "Multifold", },
  { key: "levilauncher", owner: "LiteLDev", repo: "LeviLauncher", displayName: "LeviLauncher", },
  { key: "mcjar", owner: "ezfe", repo: "minecraft-jar-command", displayName: "Minecraft Jar Command", },
  { key: "starlight", owner: "Conlux-Studio", repo: "StarLight.Core", displayName: "StarLight Core", },
  { key: "gbclv2", owner: "Nullkooland", repo: "GBCLV2", displayName: "GBCLV2", },
  { key: "eclient", owner: "v-pun215", repo: "eClient", displayName: "eClient", releases: true, },
  { key: "mcdeploy", owner: "sammwyy", repo: "MCDeploy", displayName: "MCDeploy", releases: false, },
  { key: "picodulce", owner: "nixietab", repo: "picodulce", displayName: "picodulce", releases: true, },
  { key: "colormc", owner: "Coloryr", repo: "ColorMC", displayName: "ColorMC", releases: true, },
  // { key: "tagapi", owner: "ammarx", repo: "TagAPI_3", displayName: "TagAPI 3", }, !!!这是API，不是启动器
  { key: "rcraft", owner: "vdkvdev", repo: "RCraft", displayName: "RCraft", releases: false, },
  { key: "onemcluwp", owner: "GoodTimeStudio", repo: "OneMinecraftLauncher.UWP", displayName: "OneMinecraftLauncher UWP", releases: false, },
  { key: "rimca", owner: "liabri", repo: "rimca", displayName: "rimca", releases: false, },
  { key: "wizclient", owner: "WizClient", repo: "WizClient-1.8.9-Version", displayName: "WizClient", releases: false, },
  { key: "kaminec", owner: "kaniol-lck", repo: "Kaminec", displayName: "Kaminec", releases: false, },
  { key: "mcboxlauncher", owner: "lukechu10", repo: "Minecraft-Box-Launcher", displayName: "Minecraft Box Launcher", releases: true, },
  { key: "polymcoffline", owner: "EvilToasterDBU", repo: "PolyMC-Offline", displayName: "PolyMC Offline", releases: false, },
  { key: "xelo", owner: "Xelo-Client", repo: "Xelo-Client", displayName: "Xelo Client", releases: true, },
  /*
  { key: "", owner:"", repo: "", displayName: "", },
  ...
  releases字段说明：
  - true：表示该项目有公开 Release
  - false：表示该项目没有公开 Release
  - empty：表示该项目有公开 Release，但是没有发布文件
  - 不存在：未验证该项目是否有公开 Release
  > > > 如需PR扩展，请复制此字段 < < <
   */
];

// launcherRepos 列表说明：
// - 若你的项目被误注释/标注，请提交 PR 并确保 repo 有公开 Release
// - 检查因 GitHub 限流（60次/小时）难以全量运行，欢迎协助维护

/*
==========待添加的列表==========

2025/11更新，Star数量不一定对应，仅为当时的统计数据，不代表当前项目的Star数量。
如有变化，建议帮忙更新，我可没这么多时间帮你检查。

Star 19
racerxdl / minecrowdcontrol
Mateus7766 / BRLauncher
zkitefly / unlisted-versions-of-minecraft

Star 18
telecter / cmd-launcher
InnateMC / InnateMC
lectron / kosmos

Star 17
Ezzud / minecraftlauncher-template

Star 16
Andy-K-Sparklight / Ari
TESLauncher / TESLauncher
MineInAbyss / launchy

Star 15
minecraft-rs / bootstrap

Star 14
BitBuf / mpm
InfinityStudio / RMCLL
MiguVT / migurinth

Star 13
MorpheusLauncher / MorpheusLauncher
BatuhanAksoyy / lyceris
Mehmetali345Dev / 345-Launcher
Big-Cake-jpg / Cake-Launcher

Star 12
CacahueteSansSel / mcLaunch
chaun14 / chaunServer-full
Stoozy / SML
Alex2772 / hackers-mc-launcher
Fabulously-Optimized / vanilla-installer-python

Star 11
KraysonStudios / NoxLauncher
Meloncher / Meloncher
minecraft-rs / downloader
kr5ch / mclaunch-util-lib
guihkx / com.teamshiginima.ShiginimaLauncher

Star 10
NightWorldTeam / Lexplosion
sheep-realms / ManCraft-Launcher
Umatriz / nomi
OxideMC / oxide-launcher
KeimaSenpai / XLauncher-ui
Triteras / MinecraftNewsRSS
dedepete / dotMCLauncher
MrLetsplay2003 / ShittyAuthLauncher

...Star 10- down 懒得找~~~

==========如有缺少，欢迎补充==========
*/

/* 
  >  如果不知道去哪找，可以使用 https://github.com/topics/minecraft-launcher 寻找更多启动器  <
*/
