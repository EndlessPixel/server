"use client"

import React from "react"
import { Heart, Share2, Terminal, Shield, Wrench, HelpCircle, Trophy, Download } from "lucide-react"
import { WikiSkeleton } from "@/components/wiki-skeleton"
import type { ArticleData } from "./types"

export const articles: Record<string, ArticleData> = {
    "launcher-guide": {
        title: "整合包安装指南",
        category: "新手入门",
        icon: Download,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "12分钟",
        content: (
            <div className="prose max-w-none">
                <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-600 p-4 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">快速开始</h2>
                    <p className="text-blue-800 dark:text-blue-200">
                        本指南将帮助您快速安装并启动 EndlessPixel 服务器。无论您是首次接触 Minecraft 服务器的新手，还是有经验的老玩家，都能通过清晰的步骤完成操作，顺利开启游戏。
                    </p>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-4">详细安装步骤</h2>
                <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                1
                            </span>
                            选择并准备启动器
                        </h3>
                        <p className="text-muted-foreground ml-9">
                            先选择适配的启动器，根据自身需求挑选（均支持整合包导入），特点如下：
                        </p>
                        <ul className="ml-9 mt-2 list-disc list-inside text-muted-foreground space-y-1">
                            <li><strong>PCL2</strong>：界面美观，支持模组管理、资源包预览等高级功能，适合想自定义游戏的玩家。</li>
                            <li><strong>HMCL</strong>：体积轻量（约10MB），启动速度快，操作简单，新手友好。</li>
                            <li><strong>官方启动器</strong>：由 Mojang 官方开发，稳定性强，支持正版账号直接登录，适合偏好官方工具的玩家。</li>
                        </ul>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                2
                            </span>
                            安装并配置 Java 环境
                        </h3>
                        <p className="text-muted-foreground ml-9">
                            游戏需依赖 Java 21 及以上版本运行，安装步骤如下：
                        </p>
                        <ol className="ml-9 mt-2 list-decimal list-inside text-muted-foreground space-y-1">
                            <li>访问 <a href="https://www.oracle.com/java/technologies/javase-downloads.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Oracle 官方网站</a>，下载对应系统（Windows/macOS/Linux）的 Java 21+ 安装包。</li>
                            <li>运行安装包，按提示完成安装（建议默认路径，便于启动器识别）。</li>
                            <li>安装后可在“命令提示符（CMD）”输入 <code className="bg-muted px-1 py-0.5 rounded">java -version</code>，确认显示“java version "21.x.x"”即成功。</li>
                        </ol>
                        <div className="ml-9 mt-2">
                            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>注意：</strong>若使用 Java 17 及以下版本，会出现“版本不兼容”报错，导致游戏无法启动。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                3
                            </span>
                            下载官方整合包
                        </h3>
                        <p className="text-muted-foreground ml-9">
                            前往服务器 <a href="/downloads" className="text-primary hover:underline font-medium">专属资源下载页面</a>，找到“EndlessPixel 整合包”板块：
                        </p>
                        <ul className="ml-9 mt-2 list-disc list-inside text-muted-foreground space-y-1">
                            <li>优先选择标有“Latest”标签的版本，包含最新修复和功能更新。</li>
                            <li>若需稳定版，可选择标有“Stable”标签的历史版本（适配性已验证）。</li>
                            <li>下载时建议使用浏览器自带下载工具，避免第三方下载器拦截文件。</li>
                        </ul>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                4
                            </span>
                            导入整合包到启动器
                        </h3>
                        <p className="text-muted-foreground ml-9">
                            不同启动器导入方式略有差异，具体操作如下：
                        </p>
                        <ul className="ml-9 mt-2 list-disc list-inside text-muted-foreground space-y-1">
                            <li><strong>PCL2/HMCL</strong>：打开启动器，直接将下载的整合包文件（.zip/.mrpack 格式）拖入窗口，弹窗点击“确认导入”即可。</li>
                            <li><strong>官方启动器</strong>：点击“安装新游戏”→“导入”→选择整合包文件，等待资源自动加载。</li>
                        </ul>
                        <p className="text-muted-foreground ml-9 mt-2">
                            导入后启动器会自动下载依赖资源（如模组、材质包），请耐心等待进度条完成（需保持网络稳定）。
                        </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                5
                            </span>
                            配置并启动游戏
                        </h3>
                        <ol className="ml-9 mt-2 list-decimal list-inside text-muted-foreground space-y-1">
                            <li>在启动器的“游戏列表”找到“EndlessPixel”，点击右侧“设置”图标。</li>
                            <li>在“内存分配”选项中，设置“最小内存 2GB，最大内存 4GB”（若电脑配置较高，可将最大内存调至 6GB）。</li>
                            <li>确认“Java 路径”已自动识别（或手动选择 Java 21 的安装路径，如 C:\Program Files\Java\jdk-21\bin\java.exe）。</li>
                            <li>点击“启动游戏”，首次启动会加载模组（耗时约1-3分钟），出现游戏主界面即成功。</li>
                        </ol>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">常见问题解答</h2>
                <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">启动失败（报错/无响应）</h3>
                        <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm">
                            <li>• 优先检查 Java 版本：按步骤 2 验证是否为 Java 21+，若不是需重新安装。</li>
                            <li>• 修复 Java 路径：启动器设置中，手动选择 Java 21 的“java.exe”文件路径。</li>
                            <li>• 重新下载整合包：若整合包文件损坏，删除原文件后重新下载（建议校验文件大小是否与官网一致）。</li>
                            <li>• 关闭安全软件：部分杀毒软件会误判模组文件，临时关闭后重试启动。</li>
                        </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">内存不足（弹窗提示“Out of Memory”）</h3>
                        <ul className="text-orange-800 dark:text-orange-200 space-y-1 text-sm">
                            <li>• 调整内存分配：启动器设置中，将“最大内存”设为 4GB（32位系统最大支持 4GB，64位系统可设为 6-8GB）。</li>
                            <li>• 关闭后台程序：按 Ctrl+Shift+Esc 打开任务管理器，结束浏览器、视频软件等占用内存的进程。</li>
                            <li>• 减少模组加载（进阶）：若仍内存不足，可在启动器“模组管理”中，暂时禁用非必要的视觉类模组（如光影、高清材质包）。</li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">导入后找不到游戏</h3>
                        <ul className="text-purple-800 dark:text-purple-200 space-y-1 text-sm">
                            <li>• 检查文件格式：确保下载的是 .zip 或 .mrpack 格式的整合包，其他格式（如 .rar）需先解压。</li>
                            <li>• 刷新游戏列表：部分启动器需点击“刷新”按钮，才能显示新导入的游戏。</li>
                            <li>• 重新导入：若导入过程中断，删除未完成的游戏文件，重新拖入整合包。</li>
                            <li>• 查看官方的<a href="downloads/issues">issues</a>：有没有可能存在已知的启动崩溃问题。</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 dark:border-green-600 p-4 mt-6">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>提示：</strong>若遇到上述未覆盖的问题，可加入官方 QQ 群（870594910），群内有管理员和老玩家提供实时帮助；也可查看 Wiki 中的“进阶 troubleshooting”板块，获取更多故障排查方案。
                    </p>
                </div>
            </div>
        ),
    },
    "server-commands": {
        title: "服务器玩家命令",
        category: "新手入门",
        icon: Terminal,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "5分钟",
        content: (
            <div className="space-y-8">
                {/* 头部信息 */}
                <div className="flex items-center space-x-3 mb-6">
                    <Terminal className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">服务器玩家命令</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>分类：新手入门</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/24</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：4分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    {/* 登录命令 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">登录命令</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="grid gap-3">
                            {[
                                { command: "/register <密码> <重复密码>", desc: "注册账号" },
                                { command: "/reg <密码> <重复密码>", desc: "注册账号（简写）" },
                                { command: "/login <密码>", desc: "登录服务器" },
                                { command: "/l <密码>", desc: "登录账号（简写）" },
                                { command: "/changepassword <旧密码> <新密码> <重复新密码>", desc: "修改密码" },
                                { command: "/changepw <旧密码> <新密码> <重复新密码>", desc: "修改密码（简写）" },
                                { command: "/bindemail set <邮箱地址>", desc: "绑定邮箱" },
                                { command: "/bdmail set <邮箱地址>", desc: "绑定邮箱（简写）" },
                                { command: "/bindemail verify <验证码>", desc: "验证邮箱验证码" },
                                { command: "/bdmail verify <验证码>", desc: "验证邮箱验证码（简写）" },
                                { command: "/resetpassword forget", desc: "忘记密码重置" },
                                { command: "/repw forget", desc: "忘记密码重置（简写）" },
                                { command: "/bindemail re <验证码> <新密码>", desc: "使用验证码重置密码" },
                                { command: "/bdmail re <验证码> <新密码>", desc: "使用验证码重置密码（简写）" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/30 rounded transition-colors">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{item.command}</code>
                                        <span className="ml-3 text-sm text-muted-foreground">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 传送命令 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">传送命令</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="grid gap-3">
                            {[
                                { command: "/tpa <玩家名>", desc: "请求传送到某玩家" },
                                { command: "/tpahere <玩家名>", desc: "请求某玩家传送到自己身边" },
                                { command: "/tpaignore <玩家名>", desc: "忽略某玩家的传送请求" },
                                { command: "/tpauto", desc: "自动接受他人传送请求" },
                                { command: "/tpahereall", desc: "请求所有玩家传送到自己身边" },
                                { command: "/tpaccept", desc: "接受传送请求" },
                                { command: "/tpatoggle", desc: "开启/关闭他人向自己发送传送请求" },
                                { command: "/tpatoggle <玩家名>", desc: "开启/关闭特定玩家的传送请求权限" },
                                { command: "/tpdeny", desc: "拒绝传送请求" },
                                { command: "/back", desc: "传送到自己上一个位置" },
                                { command: "/back <玩家名>", desc: "将某玩家传送回其上个位置" },
                                { command: "/tpcancel <玩家名>", desc: "取消向特定玩家的传送请求" },
                                { command: "/simpletpa", desc: "打开传送主菜单" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/30 rounded transition-colors">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 bg-purple-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{item.command}</code>
                                        <span className="ml-3 text-sm text-muted-foreground">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 皮肤管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">皮肤管理</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="grid gap-3">
                            {[
                                { command: "/skin set <正版玩家名>", desc: "设置皮肤" },
                                { command: "/skin set <皮肤名> <目标玩家>", desc: "为目标玩家设置皮肤" },
                                { command: "/skin url <链接>", desc: "通过链接设置自己的皮肤" },
                                { command: "/skins", desc: "打开皮肤菜单" },
                                { command: "/skin clear", desc: "清除自己的皮肤" },
                                { command: "/skin clear <目标玩家>", desc: "清除目标玩家的皮肤" },
                                { command: "/skin update", desc: "更新自己的皮肤" },
                                { command: "/skin update <目标玩家>", desc: "更新目标玩家的皮肤" },
                                { command: "/skin search <关键词>", desc: "搜索皮肤" },
                                { command: "/skin <皮肤名>", desc: "更换自己的皮肤" },
                                { command: "/skin help", desc: "显示皮肤命令帮助" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/30 rounded transition-colors">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 bg-cyan-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{item.command}</code>
                                        <span className="ml-3 text-sm text-muted-foreground">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 技能系统 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">技能系统</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="grid gap-3">
                            {[
                                { command: "/skills", desc: "打开技能菜单，查看所有技能进度" },
                                { command: "/stats", desc: "打开统计菜单，查看所有统计数据" },
                                { command: "/[技能名]", desc: "直接打开特定技能的等级进度（如/farming）" },
                                { command: "/sk lang [语言]", desc: "更改个人消息和菜单的语言" },
                                { command: "/abtoggle 或 /sk toggle", desc: "切换个人动作栏显示" },
                                { command: "/sk top [页码] 或 /skilltop [页码]", desc: "查看所有技能等级总和排行榜" },
                                { command: "/sk top <技能名> [页码]", desc: "查看特定技能排行榜" },
                                { command: "/sk top average [页码]", desc: "查看平均技能等级排行榜" },
                                { command: "/sk rank 或 /skillrank", desc: "查看自己的技能排名" },
                                { command: "/mana", desc: "显示当前法力值" },
                                { command: "/sk claimitems", desc: "打开物品认领菜单" },
                                { command: "/sk sources <技能名> [排序]", desc: "查看技能经验获取方式" },
                                { command: "/sk help", desc: "显示技能命令帮助" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/30 rounded transition-colors">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 bg-emerald-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{item.command}</code>
                                        <span className="ml-3 text-sm text-muted-foreground">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 其他命令 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">其他命令</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="grid gap-3">
                            {[
                                { command: "/killme", desc: "自杀" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-muted/30 rounded transition-colors">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 bg-amber-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">{item.command}</code>
                                        <span className="ml-3 text-sm text-muted-foreground">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 提示信息 */}
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mt-6">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            <strong>提示：</strong>所有命令区分大小写，请正确输入。遇到问题可联系管理员帮助。
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    "create-claims": {
        title: "领地管理",
        category: "新手入门",
        icon: Shield,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "6分钟",
        content: (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">领地管理</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>分类：功能指南</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：6分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    {/* 主菜单 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">主菜单</h2>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-blue-900 dark:text-blue-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-blue-900 dark:text-blue-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
                                    <tr>
                                        <td className="py-2 text-sm text-blue-800 dark:text-blue-200">打开主菜单：打开插件的主菜单界面</td>
                                        <td className="py-2 text-sm"><code className="bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded">/dominion menu [page]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 创建与删除 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">创建与删除</h2>
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-purple-200 dark:divide-purple-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-purple-900 dark:text-purple-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-purple-900 dark:text-purple-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-200 dark:divide-purple-800">
                                    <tr>
                                        <td className="py-2 text-sm text-purple-800 dark:text-purple-200">创建领地：创建一个新的领地</td>
                                        <td className="py-2 text-sm"><code className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">/dominion create &lt;name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-purple-800 dark:text-purple-200">自动创建领地：自动创建一个新的领地</td>
                                        <td className="py-2 text-sm"><code className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">/dominion auto_create &lt;name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-purple-800 dark:text-purple-200">创建子领地：在指定领地下创建子领地</td>
                                        <td className="py-2 text-sm"><code className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">/dominion create_sub &lt;name&gt; &lt;dominion_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-purple-800 dark:text-purple-200">自动创建子领地：自动在指定领地下创建子领地</td>
                                        <td className="py-2 text-sm"><code className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">/dominion auto_create_sub &lt;name&gt; &lt;dominion_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-purple-800 dark:text-purple-200">删除领地：删除指定的领地</td>
                                        <td className="py-2 text-sm"><code className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">/dominion delete &lt;dominion_name&gt; [force]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 领地管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">领地管理</h2>
                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200 dark:divide-green-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-green-900 dark:text-green-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-green-900 dark:text-green-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-200 dark:divide-green-800">
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">调整领地大小：扩展或收缩领地的大小</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion resize &lt;dominion_name&gt; &lt;expand|contract&gt; &lt;size&gt; [north|east|south|west|up|down]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">设置环境标志：设置领地的环境标志</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion set_env &lt;dominion_name&gt; &lt;env_flag_name&gt; &lt;true|false&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">设置访客标志：设置领地的访客标志</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion set_guest &lt;dominion_name&gt; &lt;guest_flag_name&gt; &lt;true|false&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">设置地图颜色：设置领地在地图上的显示颜色</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion set_map_color &lt;dominion_name&gt; &lt;color&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">设置传送点：设置领地的传送点</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion set_tp &lt;dominion_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">设置消息：设置进入或离开领地时的提示消息</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion set_msg &lt;dominion_name&gt; &lt;enter|leave&gt; &lt;message&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">重命名领地：修改领地的名称</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion rename &lt;dominion_name&gt; &lt;newName&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-green-800 dark:text-green-200">转让领地：将领地转让给其他玩家</td>
                                        <td className="py-2 text-sm"><code className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">/dominion give &lt;dominion_name&gt; &lt;player_name&gt; [force]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 成员管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">成员管理</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-yellow-900 dark:text-yellow-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-yellow-900 dark:text-yellow-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-yellow-200 dark:divide-yellow-800">
                                    <tr>
                                        <td className="py-2 text-sm text-yellow-800 dark:text-yellow-200">添加成员：向领地添加新成员</td>
                                        <td className="py-2 text-sm"><code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">/dominion member_add &lt;dominion_name&gt; &lt;player_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-yellow-800 dark:text-yellow-200">移除成员：从领地中移除指定成员</td>
                                        <td className="py-2 text-sm"><code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">/dominion member_remove &lt;dominion_name&gt; &lt;member_name&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-yellow-800 dark:text-yellow-200">设置成员权限：设置成员的权限标志</td>
                                        <td className="py-2 text-sm"><code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">/dominion member_set_pri &lt;dominion_name&gt; &lt;member_name&gt; &lt;pri_flag_name&gt; &lt;true|false&gt; [page]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 权限组管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">权限组管理</h2>
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-red-200 dark:divide-red-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-red-900 dark:text-red-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-red-900 dark:text-red-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-200 dark:divide-red-800">
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">创建权限组：为领地创建一个新的权限组</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_create &lt;dominion_name&gt; &lt;group_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">设置权限组标志：设置权限组的权限标志</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_set_flag &lt;dominion_name&gt; &lt;group_name&gt; &lt;pri_flag_name&gt; &lt;true|false&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">添加组成员：向权限组中添加成员</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_add_member &lt;dominion_name&gt; &lt;group_name&gt; &lt;member_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">移除组成员：从权限组中移除成员</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_remove_member &lt;dominion_name&gt; &lt;group_name&gt; &lt;member_name&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">重命名权限组：修改权限组的名称</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_rename &lt;dominion_name&gt; &lt;group_name&gt; &lt;new_group_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-red-800 dark:text-red-200">删除权限组：删除指定的权限组</td>
                                        <td className="py-2 text-sm"><code className="bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">/dominion group_delete &lt;dominion_name&gt; &lt;group_name&gt; [page]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 模板管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">模板管理</h2>
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-indigo-200 dark:divide-indigo-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-indigo-900 dark:text-indigo-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-indigo-900 dark:text-indigo-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-200 dark:divide-indigo-800">
                                    <tr>
                                        <td className="py-2 text-sm text-indigo-800 dark:text-indigo-200">应用模板：将权限模板应用到指定成员</td>
                                        <td className="py-2 text-sm"><code className="bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded">/dominion member_apply_template &lt;dominion_name&gt; &lt;member_name&gt; &lt;template_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-indigo-800 dark:text-indigo-200">创建模板：创建一个新的权限模板</td>
                                        <td className="py-2 text-sm"><code className="bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded">/dominion template_create &lt;template_name&gt;</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-indigo-800 dark:text-indigo-200">删除模板：删除指定的权限模板</td>
                                        <td className="py-2 text-sm"><code className="bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded">/dominion template_delete &lt;template_name&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-indigo-800 dark:text-indigo-200">设置模板标志：设置模板的权限标志</td>
                                        <td className="py-2 text-sm"><code className="bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded">/dominion template_set_flag &lt;template_name&gt; &lt;pri_flag_name&gt; &lt;true|false&gt; [page]</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 杂项 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">杂项</h2>
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">指令名称&描述</th>
                                        <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">用法</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    <tr>
                                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">使用称号：使用指定的称号</td>
                                        <td className="py-2 text-sm"><code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">/dominion title_use &lt;title_id&gt; [page]</code></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">传送到领地：传送到指定的领地</td>
                                        <td className="py-2 text-sm"><code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">/dominion tp &lt;dominion_name&gt;</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    "server-rules": {
        title: "服务器规则",
        category: "规则制度",
        icon: Shield,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "10分钟",
        content: (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">服务器规则</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>分类：规则制度</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：10分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6">
                        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">重要提醒</h2>
                        <p className="text-red-800 dark:text-red-200">请仔细阅读并遵守以下规则，违规行为将受到相应处罚。仅有服主和管理员具有所有规则的最终解释权。</p>
                    </div>

                    <h2 className="text-xl font-semibold text-foreground mb-4">核心规则</h2>
                    <div className="space-y-3">
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>1. 外挂使用限制</strong> - 允许使用矿透，但需适度不可过度嚣张；严禁使用其他任何形式的作弊工具
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>2. 消息发送规范</strong> - 禁止消息刷屏，单次发送10条以上视为违规
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>3. 服务器保护</strong> - 严禁实施崩服行为，服务器配置有限（E5处理器），需共同维护稳定
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>4. 领地创建规则</strong> - 禁止恶意创建领地，尤其禁止占用不属于自己的区域或公共区域
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>5. 公共资源管理</strong> - 禁止恶意给公共箱子上锁，不得独占共享资源
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>6. 特殊装置限制</strong> - 严禁建造卡服机、区块抑制器等影响服务器运行的装置
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>7. 聊天用语要求</strong> - 聊天栏需使用文明用语，禁止发送不当言论
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>8. 交易安全规范</strong> - 禁止使用现实现金交易，私下交易被骗服务器概不负责
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>9. 礼品码使用规则</strong> - 礼品兑换代码禁止二次高价出售，需通过官方售卖渠道获取
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                            <strong>10. 经验交易提醒</strong> - 请勿相信售卖经验的玩家，仅认可附魔之瓶形式的经验交易（普通玩家无XP命令使用权限）
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">违规处罚机制</h2>
                    <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                        <ul className="space-y-2 text-red-900 dark:text-red-100">
                            <li>• 第一次违规：封禁账号 1 天（ban1d）</li>
                            <li>• 第二次违规：封禁账号 30 天（ban30d）</li>
                            <li>• 第三次违规：封禁账号 6 个月（ban6m）</li>
                            <li>• 第四次违规：永久封禁账号（ban∞）</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
    "client-versions": {
        title: "服务器客户端版本说明",
        category: "技术指南",
        icon: Wrench,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "6分钟",
        content: (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Wrench className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">服务器客户端版本说明</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>分类：技术指南</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：6分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">支持版本</h2>
                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-4">
                        <p className="text-green-800 dark:text-green-200">
                            <strong>服务器支持版本：</strong>1.8+ 至 1.21.10及以上版本
                        </p>
                        <p className="text-green-800 dark:text-green-200">
                            <strong>推荐版本：</strong>1.21.10
                        </p>
                        <p className="text-green-800 dark:text-green-200">
                            <strong>协议号：</strong>773
                        </p>
                        <p className="text-green-800 dark:text-green-200">
                            <strong>版本兼容插件：</strong>ViaVersion v5.5.2-SNAPSHOT
                        </p>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">版本兼容性</h2>
                    <div className="space-y-3">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded">
                            <strong className="text-blue-900 dark:text-blue-100">最佳体验：</strong>
                            <span className="text-blue-800 dark:text-blue-200">使用1.21.10版本可获得最佳游戏体验，支持所有最新特性</span>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded">
                            <strong className="text-yellow-900 dark:text-yellow-100">兼容版本：</strong>
                            <span className="text-yellow-800 dark:text-yellow-200">1.8至1.21.10及以上版本均可正常进入并游戏</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    "connection-issues": {
        title: "服务器连接问题及解决方法",
        category: "故障排除",
        icon: HelpCircle,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "7分钟",
        content: (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <HelpCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">服务器连接问题及解决方法</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>分类：故障排除</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：7分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-800 dark:text-gray-200 mb-6">
                        在尝试连接服务器时，玩家可能会碰到形形色色的问题。下面为您详细介绍常见问题及其对应的解决策略：
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">常见问题</h2>
                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">1. 连接超时</h3>
                            <p className="text-red-800 dark:text-red-200 mb-2"><strong>问题根源：</strong>网络链路中断或服务器节点响应延迟</p>
                            <ul className="text-red-800 dark:text-red-200 space-y-1">
                                <li>• 检查本地网络连接是否正常</li>
                                <li>• 尝试切换其他服务器节点连接</li>
                                <li>• 重启游戏客户端释放临时连接缓存</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">2. 版本不兼容</h3>
                            <p className="text-orange-800 dark:text-orange-200 mb-2"><strong>问题根源：</strong>客户端版本与服务器协议不匹配</p>
                            <ul className="text-orange-800 dark:text-orange-200 space-y-1">
                                <li>• 确认客户端版本在1.8-1.21.10范围内（协议号773）</li>
                                <li>• 推荐使用1.21.10版本获得最佳兼容性</li>
                                <li>• 确保未使用修改过协议的第三方客户端</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">3. 部分节点临时异常</h3>
                            <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>问题根源：</strong>服务器节点因网络波动或临时故障导致连接失败</p>
                            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• 切换至其他可用节点重新连接</li>
                                <li>• 等待5-10分钟后再次尝试（节点通常会自动恢复）</li>
                                <li>• 查看服务器群公告确认节点状态</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">4. 服务器维护中</h3>
                            <p className="text-green-800 dark:text-green-200 mb-2"><strong>问题根源：</strong>服务器正在进行版本更新或系统维护</p>
                            <ul className="text-green-800 dark:text-green-200 space-y-1">
                                <li>• 关注服务器公告了解维护结束时间</li>
                                <li>• 紧急情况可在游戏群@服主请求协助</li>
                                <li>• 维护期间建议暂时关闭自动重连功能</li>
                            </ul>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">5. 服务器负载过高</h3>
                            <p className="text-purple-800 dark:text-purple-200 mb-2"><strong>问题根源：</strong>当前在线玩家过多导致服务器压力过大</p>
                            <ul className="text-purple-800 dark:text-purple-200 space-y-1">
                                <li>• 错峰登录（避开晚间黄金时段）</li>
                                <li>• 尝试多次连接直至成功进入</li>
                                <li>• 减少连接时加载的资源包大小</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">6. 本地网络异常</h3>
                            <p className="text-yellow-800 dark:text-yellow-200 mb-2"><strong>问题根源：</strong>本地网络不稳定或防火墙限制连接</p>
                            <ul className="text-yellow-800 dark:text-yellow-200 space-y-1">
                                <li>• 重启路由器刷新网络连接</li>
                                <li>• 检查防火墙是否允许Minecraft访问网络</li>
                                <li>• 切换网络环境（如从WiFi改为有线连接）</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-8">其他疑难问题</h2>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200 mb-3">如果遇到的问题不在上述范围内，可尝试以下通用解决方法：</p>
                        <ul className="text-gray-800 dark:text-gray-200 space-y-2">
                            <li>• <strong>重启客户端</strong>：关闭并重新启动Minecraft，解决临时进程错误</li>
                            <li>• <strong>查看公告</strong>：服务器公告可能包含当前问题的临时解决方案</li>
                            <li>• <strong>联系管理员</strong>：在游戏群中描述具体问题，管理员会协助排查</li>
                            <li>• <strong>检查日志</strong>：客户端报错日志（.minecraft/logs）可提供故障线索</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
    "frp-guide": {
        title: "服务器FRP节点贡献指南",
        category: "技术指南",
        icon: Wrench,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "12分钟",
        content: (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">服务器FRP节点贡献指南</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>分类：技术指南</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：12分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">什么是FRP</h2>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-6">
                        <p className="text-blue-800 dark:text-blue-200">
                            FRP（Fast Reverse Proxy）是一个高性能的反向代理应用，可帮助玩家将内网服务暴露到公网，为服务器提供多节点接入支持，提升不同地区玩家的连接稳定性。
                        </p>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">配置要求</h2>
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg mb-6">
                        <ul className="space-y-2 text-gray-800 dark:text-gray-200">
                            <li>• 稳定的网络连接（建议丢包率＜1%，延迟＜100ms）</li>
                            <li>• 拥有公网IP或已解析的域名（支持IPv4/IPv6）</li>
                            <li>• 带宽支持（上行带宽≥8Mbps，满足多玩家同时连接）</li>
                            <li>• 安装FRP客户端（推荐v0.50.0及以上版本，兼容服务器端）</li>
                        </ul>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">FRP客户端配置（多格式）</h2>
                    <div className="space-y-6">
                        {/* INI格式（默认） */}
                        <div className="space-y-6">
                            {/* INI */}
                            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">1. INI格式（frpc.ini）</h3>
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                                    {`[common]
server_addr = xxx.xxx.xxx.xxx
server_port = 7000
token = xxxxxxxxxxxxxxxxxxxx

[your_node_name]
type = tcp
local_ip = 127.0.0.1
local_port = 25566`}
                                </pre>
                            </div>

                            {/* TOML */}
                            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">2. TOML格式（frpc.toml）</h3>
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                                    {`[common]
server_addr = "xxx.xxx.xxx.xxx"
server_port = 7000
token = "xxxxxxxxxxxxxxxxxxxx"

[[proxies]]
name = "your_node_name"
type = "tcp"
local_ip = "127.0.0.1"
local_port = 25566`}
                                </pre>
                            </div>

                            {/* YAML */}
                            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">3. YAML格式（frpc.yaml）</h3>
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                                    {`common:
  server_addr: xxx.xxx.xxx.xxx
  server_port: 7000
  token: xxxxxxxxxxxxxxxxxxxx

proxies:
  - name: your_node_name
    type: tcp
    local_ip: 127.0.0.1
    local_port: 25566`}
                                </pre>
                            </div>

                            {/* JSON */}
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">4. JSON格式（frpc.json）</h3>
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                                    {`{
  "common": {
    "server_addr": "xxx.xxx.xxx.xxx",
    "server_port": 7000,
    "token": "xxxxxxxxxxxxxxxxxxxx"
  },
  "proxies": [
    {
      "name": "your_node_name",
      "type": "tcp",
      "local_ip": "127.0.0.1",
      "local_port": 25566
    }
  ]
}`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 推荐端口与提交流程 */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">推荐使用端口</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm">25565（最好）</span>
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm">25566</span>
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm">25568</span>
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm">22222</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
                            注：端口需确保未被占用且已在防火墙开放，避免与其他服务冲突
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">节点提交流程</h2>
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg">
                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">提交前准备</h3>
                            <ol className="space-y-2 text-yellow-800 dark:text-yellow-200">
                                <li>1. 选择任一格式配置文件完成配置，本地测试连通性（启动命令：<code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">frpc -c 配置文件名.格式</code>，如 <code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">frpc -c frpc.toml</code>）</li>
                                <li>2. 记录节点信息：节点名称、公网IP/域名、使用端口、网络运营商（如"电信/联通"）</li>
                            </ol>

                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mt-4 mb-3">提交方式</h3>
                            <ol className="space-y-2 text-yellow-800 dark:text-yellow-200">
                                <li>1. 将配置文件与节点信息，私聊发送给服主（ID：system_mini）</li>
                                <li>2. 若通过邮件提交，主题格式为：<code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">[节点贡献] 你的ID_推荐端口</code>（如"[节点贡献] PlayerA_25566"）</li>
                                <li>3. 等待服主审核（1-2个工作日），审核通过后节点将加入服务器节点列表</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    "special-features": {
        "title": "服务器特殊功能指南",
        "category": "特色功能",
        "icon": "Trophy",
        "lastUpdated": "2025/10/18",
        "author": "system_mini",
        "readTime": "15分钟",
        "content": (
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">服务器特殊功能指南</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>分类：特色功能</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：15分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    {/* 基础交互功能 */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-green-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">基础交互功能</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-3">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg mr-3">
                                        <span className="text-green-600 dark:text-green-300">🪑</span>
                                    </div>
                                    <h3 className="font-semibold text-green-900 dark:text-green-100">坐下功能</h3>
                                </div>
                                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                                    手持空手状态时，右键点击下半砖或楼梯方块即可优雅坐下，体验真实的休息姿势。再次按下Shift键即可自然站起，为社交互动增添更多沉浸感。
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg mr-3">
                                        <span className="text-blue-600 dark:text-blue-300">⛏️</span>
                                    </div>
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">连锁挖掘</h3>
                                </div>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    蹲下状态下使用对应工具，可一次性挖掘最多64个相同类型的矿石，大幅提升采集效率。特别优化了开采体验——按下Shift键开采时，可自动破坏同一矿脉内的全部矿石，让矿物收集更加便捷高效。
                                </p>
                                <img 
                                    src="https://cdn-raw.modrinth.com/data/OhduvhIc/images/f4c0ad7fa3b8b579753c1f757e80151798717c68.gif" 
                                    alt="连锁挖掘演示" 
                                    className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                                />
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-3">
                                    <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-lg mr-3">
                                        <span className="text-yellow-600 dark:text-yellow-300">🌾</span>
                                    </div>
                                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">农田防踩踏</h3>
                                </div>
                                <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                                    农田被踩踏后不会退化为泥土，有效保护精心种植的农作物免受意外损害。这一贴心设计让农业管理更加轻松，不再担心因误操作而破坏农田生态系统。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 下界生物群落与结构升级 */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-red-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">下界维度全面升级</h2>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-red-200 dark:border-red-800">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="bg-red-100 dark:bg-red-800 p-2 rounded-lg mr-3">
                                            <span className="text-red-600 dark:text-red-300">🌋</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-100">生物群落深度优化</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">下界荒原重构</h4>
                                            <p className="text-red-700 dark:text-red-300 text-sm">
                                                从原本单调的"下界沙漠"彻底转变为充满敌意的洞穴式生态。新增壮观的下界尖刺结构，包含石笋与钟乳石群，配合黑石岩层与岩浆"湖泊"，营造出更具挑战性的探索环境。
                                            </p>
                                        </div>

                                        <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">森林生态增强</h4>
                                            <p className="text-red-700 dark:text-red-300 text-sm">
                                                猩红森林与扭曲森林中新增黑石岩石群、倒下的真菌茎残骸，以及新型蔓延的巨大真菌物种。适度增加的植被密度让生态系统更加丰富，提升了生物群落的真实感与探索价值。
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">
                                            <span className="text-purple-600 dark:text-purple-300">🏰</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">史诗级新结构</h3>
                                    </div>

                                    <div className="bg-white/50 dark:bg-gray-700/50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">猩红塔与扭曲塔</h4>
                                        <ul className="text-purple-700 dark:text-purple-300 space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <span className="text-purple-500 mr-2">•</span>
                                                <span>近100方块高度的宏伟建筑，成为下界天际线的标志性存在</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-purple-500 mr-2">•</span>
                                                <span>提供专属战利品箱与特殊生物生成点，奖励丰厚</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-purple-500 mr-2">•</span>
                                                <span>巧妙设计的垂直交通系统，可作为下界不同高度层之间的快速"电梯"</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-purple-500 mr-2">•</span>
                                                <span>完美融入下界环境，兼具视觉冲击力与实用功能性</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 主世界结构扩展 */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-emerald-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">主世界结构扩展</h2>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center">
                                        <span className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-lg mr-3">🏰</span>
                                        多样化建筑结构
                                    </h3>
                                    <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed mb-4">
                                        主世界新增大量精心设计的建筑结构，包括中世纪城堡、乡村小屋、神秘塔楼等，为探索带来更多惊喜和挑战。每个结构都经过精心设计，完美融入自然环境。
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <img src="https://cdn.modrinth.com/data/HSfsxuTo/images/e803f27353f096a399acf8a2c416470e4f08e423.jpeg" alt="主世界结构1" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                        <img src="https://cdn.modrinth.com/data/HSfsxuTo/images/45ef89657520cc71a44303931e3447b97f177397.png" alt="主世界结构2" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center">
                                        <span className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-lg mr-3">🌄</span>
                                        环境融合设计
                                    </h3>
                                    <p className="text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed mb-4">
                                        所有新增结构都经过精心布局，确保与原有生物群落完美融合。从雪山之巅到丛林深处，每个结构都有其独特的生成逻辑和环境适配。
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <img src="https://cdn.modrinth.com/data/HSfsxuTo/images/7f442e33491c428fcc8f4f906d25943f605471c2.jpeg" alt="主世界结构3" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                        <img src="https://cdn.modrinth.com/data/HSfsxuTo/images/3e667720d586dc49c15099f23817a1d0405dc36e.jpeg" alt="主世界结构4" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 切割机功能扩展 */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-indigo-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">大师切割机：革命性制造系统</h2>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center bg-indigo-100 dark:bg-indigo-800 px-4 py-2 rounded-full mb-4">
                                    <span className="text-indigo-600 dark:text-indigo-300 mr-2">⚡</span>
                                    <span className="text-indigo-800 dark:text-indigo-200 font-semibold">500+ 新增配方与功能</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-6 rounded-xl">
                                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                                            <span className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg mr-3">🪓</span>
                                            核心制造功能
                                        </h3>
                                        <ul className="space-y-3 text-indigo-800 dark:text-indigo-200 mb-4">
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>木材精加工：</strong>支持原木直接切割为各类木制品，跳过中间加工步骤</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>基石精准处理：</strong>增强型切割算法，完美处理各类基石方块</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>智能回收系统：</strong>可切割楼梯、门、活板门等块状衍生物，实现资源循环利用</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>逆向制作：</strong>拆解已制作物品，按配方比例回收原材料</span>
                                            </li>
                                        </ul>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <img src="https://cdn.modrinth.com/data/DuUMFIfX/images/2042569b7a8ae6f195ce13b656f101c9ac5bd8eb.png" alt="切割机界面1" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                            <img src="https://cdn.modrinth.com/data/DuUMFIfX/images/46228f5a5f7eb9eb64b420914e6689cdf6b1ce42.png" alt="切割机界面2" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-6 rounded-xl">
                                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                                            <span className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg mr-3">🔧</span>
                                            高级特性扩展
                                        </h3>
                                        <ul className="space-y-3 text-indigo-800 dark:text-indigo-200">
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>形态转换：</strong>同一方块可在不同形态间自由切换（如抛光块↔底座形式）</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>特殊材料优化：</strong>深板岩、石头直接切割为鹅卵石及其衍生物</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>铁艺加工：</strong>提供铁块衍生物的便捷制作与逆向拆解，完美兼容原版制作网格</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span><strong>无缝集成：</strong>所有功能均与原版系统深度整合，保持游戏体验一致性</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 船只系统升级 */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-teal-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">海洋探索：船只系统全面进化</h2>
                        </div>

                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-teal-200 dark:border-teal-800">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-6 flex items-center">
                                        <span className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg mr-3">🏝️</span>
                                        全新海洋结构
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">漂浮村庄</h4>
                                            <p className="text-teal-700 dark:text-teal-300 text-sm mb-3">
                                                由多块浮木精心构建而成，优雅漂浮于海浪之上，为海洋探索提供独特的栖息地与交易点。这种创新的水上建筑风格重新定义了海洋生态的居住体验。
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <img src="https://wsrv.nl/?url=https%3A%2F%2Fjoshie.app%2Ffiles%2Ftidal_towns_screenshot_1.png&n=-1" alt="漂浮村庄1" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                                <img src="https://wsrv.nl/?url=https%3A%2F%2Fjoshie.app%2Ffiles%2Ftidal_towns_screenshot_2.png&n=-1" alt="漂浮村庄2" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                            </div>
                                        </div>

                                        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg">
                                            <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">修复版沉船</h4>
                                            <p className="text-teal-700 dark:text-teal-300 text-sm mb-3">
                                                精心还原原版沉船在"鼎盛时期"的完整外观，新增风帆、灯笼等细节装饰，既保留了香草设计的经典风格，又增添了更多历史厚重感与探索价值。
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <img src="https://cdn.modrinth.com/data/ae8EZLiC/images/5253cba3aeb39e9e709c83999d898cf58acd86bb.png" alt="修复沉船1" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                                <img src="https://cdn.modrinth.com/data/ae8EZLiC/images/8c1dba4e41fdb8abdf7e6b6e18b966872661b03c.png" alt="修复沉船2" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-6 flex items-center">
                                        <span className="bg-teal-100 dark:bg-teal-800 p-2 rounded-lg mr-3">⛵</span>
                                        多样化舰船体系
                                    </h3>

                                    <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">基础舰船系列</h4>
                                                <p className="text-teal-700 dark:text-teal-300 text-sm mb-3">
                                                    7种精心设计的基础舰船变体，仅使用原版木材组合，搭配统一的白色风帆，保持视觉风格的一致性。
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <img src="https://cdn.modrinth.com/data/ae8EZLiC/images/81af9abf0c87e4a80bd95a37fe7f590bcf6c7f9e.png" alt="舰船变体1" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                                    <img src="https://cdn.modrinth.com/data/ae8EZLiC/images/5855713fabe83ae687dd2d7f566dd2c559888c52.png" alt="舰船变体2" className="rounded-lg border border-gray-200 dark:border-gray-700" />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">扩展舰船类型</h4>
                                                <p className="text-teal-700 dark:text-teal-300 text-sm">
                                                    包含所有木材类型与帆颜色组合，以及使用下界专用木材制作的独特"下界飞船"，满足不同维度的航行需求。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 其他特殊功能 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-8 bg-purple-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">进阶功能与系统优化</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">
                                        <span className="text-purple-600 dark:text-purple-300">✨</span>
                                    </div>
                                    <h3 className="font-bold text-purple-900 dark:text-purple-100">无限附魔系统</h3>
                                </div>
                                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                                    突破传统附魔等级限制，允许打造极致属性的顶级装备。这一系统为装备定制提供了无限可能性，让玩家能够真正打造出符合个人游戏风格的完美装备组合。
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-300 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                                        <span className="text-gray-600 dark:text-gray-300">🌌</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Nullscape末地维度升级</h3>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                    末地高度大幅提升至384格，充分利用1.18现代地形生成功能，创造多样化的外星景观。包含破碎岛屿、漂浮山谷、结晶山峰等独特地形，不同区域拥有独特的属性与风格，确保探索过程充满新鲜感与挑战性。
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 页脚 */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        🎮 以上所有功能均已在服务器中实装，欢迎体验探索！如有疑问可联系管理员咨询。
                    </p>
                </div>
            </div>
        )
    }
}

export default articles