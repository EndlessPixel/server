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
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Terminal className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">服务器玩家命令</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>分类：新手入门</span>
                            <span>•</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>•</span>
                            <span>作者：system_mini</span>
                            <span>•</span>
                            <span>阅读时间：5分钟</span>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none">
                    {/* 传送命令 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">传送命令</h2>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                        <ul className="space-y-2">
                            <li><code className="bg-muted px-2 py-1 rounded">/spawn</code> - 传送到主城</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/home</code> - 传送到家</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/sethome [名称]</code> - 设置家的位置</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/delhome [名称]</code> - 删除家</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpa [玩家名]</code> - 请求传送到某玩家</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpahere [玩家名]</code> - 请求某玩家传送到自己身边</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpaignore [玩家名]</code> - 忽略某玩家的传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpauto</code> - 自动接受他人传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpahereall</code> - 请求所有玩家传送到自己身边</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpaccept</code> - 接受传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpatoggle</code> - 开启/关闭他人向自己发送传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpatoggle [玩家名]</code> - 开启/关闭特定玩家的传送请求权限</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpdeny</code> - 拒绝传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/back</code> - 传送到自己上一个位置</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/back [玩家名]</code> - 将某玩家传送回其上个位置</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/tpcancel [玩家名]</code> - 取消向特定玩家的传送请求</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/simpletpa</code> - 打开传送主菜单</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/simpletpa debug</code> - 显示插件和服务器信息</li>
                            <li><code className="bg-muted px-2 py-1 rounded">/simpletpa reload</code> - 重新加载插件</li>
                        </ul>
                    </div>

                    {/* 皮肤管理 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">皮肤管理</h2>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-4">
                        <ul className="space-y-2">
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin set &lt;正版玩家名&gt;</code> - 设置皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin set &lt;皮肤名&gt; &lt;目标玩家&gt;</code> - 为目标玩家设置皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin url &lt;链接&gt;</code> - 通过链接设置自己的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skins</code> - 打开皮肤菜单</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin clear</code> - 清除自己的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin clear &lt;目标玩家&gt;</code> - 清除目标玩家的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin update</code> - 更新自己的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin update &lt;目标玩家&gt;</code> - 更新目标玩家的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin search &lt;关键词&gt;</code> - 搜索皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin &lt;皮肤名&gt;</code> - 更换自己的皮肤</li>
                            <li><code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/skin help</code> - 显示皮肤命令帮助</li>
                        </ul>
                    </div>

                    {/* 技能系统 */}
                    <h2 className="text-xl font-semibold text-foreground mb-4">技能系统</h2>
                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-4">
                        <ul className="space-y-2">
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/skills</code> - 打开技能菜单，查看所有技能进度</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/stats</code> - 打开统计菜单，查看所有统计数据</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/[技能名]</code> - 直接打开特定技能的等级进度（如/farming）</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk lang [语言]</code> - 更改个人消息和菜单的语言</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/abtoggle 或 /sk toggle</code> - 切换个人动作栏显示</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk top [页码] 或 /skilltop [页码]</code> - 查看所有技能等级总和排行榜</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk top &lt;技能名&gt; [页码]</code> - 查看特定技能排行榜</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk top average [页码]</code> - 查看平均技能等级排行榜</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk rank 或 /skillrank</code> - 查看自己的技能排名</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/mana</code> - 显示当前法力值</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk claimitems</code> - 打开物品认领菜单</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk sources &lt;技能名&gt; [排序]</code> - 查看技能经验获取方式</li>
                            <li><code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">/sk help</code> - 显示技能命令帮助</li>
                        </ul>
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
        title: "服务器特殊功能指南",
        category: "特色功能",
        icon: Trophy,
        lastUpdated: "2025/10/18",
        author: "system_mini",
        readTime: "15分钟",
        content: (
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">基础交互功能</h2>
                    <div className="space-y-4 mb-8">
                        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                            <p className="text-green-800 dark:text-green-200">
                                <strong>坐下功能</strong>：空手右键点击下半砖或楼梯即可坐下，再次右键或移动可站起。
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>连锁挖掘</strong>：蹲下并使用对应工具，可连锁挖掘最多128个相同方块；按下Shift开采矿石，还能打破同一矿石的全部矿脉，大幅提升挖掘效率。
                            </p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                <strong>农田防踩踏</strong>：农田被踩踏后不会破坏，保护农作物免受意外损害。
                            </p>
                        </div>
                    </div>

                    {/* 下界生物群落与结构升级 */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">下界升级：生物群落与新结构</h2>
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg mb-8">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">1. 生物群落优化</h3>
                        <ul className="text-red-800 dark:text-red-200 space-y-2 mb-4">
                            <li>• 下界荒原：新增下界尖刺（石笋、钟乳石）及黑石、岩浆“湖”，从“沙漠风”转变为充满敌意的洞穴式生物群落。</li>
                            <li>• 猩红森林/扭曲森林：添加黑石岩石、倒下的真菌茎、新型蔓延巨大真菌，适度增加植被密度，提升生态感。</li>
                        </ul>
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2. 新结构：猩红塔与扭曲塔</h3>
                        <ul className="text-red-800 dark:text-red-200 space-y-2">
                            <li>• 高度近100个方块，兼具视觉冲击与实用功能。</li>
                            <li>• 提供专属战利品与生物，可作为下界不同垂直层之间的“电梯”，方便快速移动。</li>
                        </ul>
                    </div>

                    {/* 昂船切割机功能扩展 */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">昂船切割机：500+新食谱与功能</h2>
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg mb-8">
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">核心功能分类</h3>
                                <ul className="text-indigo-800 dark:text-indigo-200 space-y-1">
                                    <li>• 🪓 木材切割：支持原木直接切割加工。</li>
                                    <li>• 🔮 增强型基石切割：精准处理各类基石方块。</li>
                                    <li>• ♻ 回收功能：切割楼梯、门、活板门等块状衍生物，实现资源复用。</li>
                                    <li>• 🔨 取消制作：逆向拆解已制作的物品，回收原材料。</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">额外便利功能</h3>
                                <ul className="text-indigo-800 dark:text-indigo-200 space-y-1">
                                    <li>• 方块变体切换：同一方块可在不同形态间转换（如抛光块→底座形式）。</li>
                                    <li>• 特殊材料处理：深板岩、石头可直接切割为鹅卵石或其衍生物。</li>
                                    <li>• 铁块加工：提供铁块衍生物的便捷制作与取消制作选项，与原版制作网格兼容。</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 船只系统升级 */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">船只系统：新结构与变体</h2>
                    <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg mb-8">
                        <ul className="text-teal-800 dark:text-teal-200 space-y-2">
                            <li>• 漂浮村庄：多块浮木组成，漂浮于海浪之上，提供独特的水上探索点。</li>
                            <li>• 修复版沉船：还原原版沉船“鼎盛时期”外观（新增帆、灯笼等细节），自然生成于世界中，保留香草设计风格。</li>
                            <li>• 7种基础舰船变体：仅使用原版木材组合，搭配白色帆，风格统一。</li>
                            <li>• 扩展舰船类型：包含所有木材+帆颜色组合，以及下界专用木材制作的“下界飞船”。</li>
                            <li>• 船员系统：部分舰船配备船员（村民、掠夺者、下界船配猪灵），战利品布局与原版不同。</li>
                        </ul>
                    </div>

                    {/* 其他特殊功能 */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">其他特殊功能</h2>
                    <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                            <p className="text-purple-800 dark:text-purple-200">
                                <strong>无限附魔</strong>：附魔不再受等级限制，可打造极致属性装备。
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                            <p className="text-gray-800 dark:text-gray-200">
                                <strong>Nullscape末地升级</strong>：末地高度提升至384格，利用1.18现代生成功能，打造多样化地形（破碎岛屿、漂浮山谷、结晶山峰等）；不同区域在大尺度上拥有独特属性与风格，地形变化几乎无限，避免探索单调感。
                            </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                            <p className="text-orange-800 dark:text-orange-200">
                                <strong>蘑菇块与蜘蛛网优化</strong>：1.20.5+版本中，蘑菇茎和蘑菇块可像原木一样“剥离”，露出毛孔纹理；蜘蛛网剪断后可获得9根弦，白色羊毛切割可获得4根绳子（与制作羊毛块的材料数量匹配）。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
}

export default articles
