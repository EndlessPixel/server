"use client"

import React from "react"
import { Terminal, Shield, Wrench, HelpCircle, Trophy, Download } from "lucide-react"
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
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="shrink-0">
                        <Download className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">整合包安装指南</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                🚀 新手入门
                            </span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：12分钟</span>
                        </div>
                    </div>
                </div>

                {/* 快速开始 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">快速开始</h2>
                    </div>
                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl shrink-0">
                                <span className="text-2xl text-blue-600 dark:text-blue-300">⚡</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">快速安装指南</h3>
                                <p className="text-blue-800 dark:text-blue-200 text-lg leading-relaxed">
                                    本指南将帮助您快速安装并启动 EndlessPixel 服务器。无论您是首次接触 Minecraft 服务器的新手，还是有经验的老玩家，都能通过清晰的步骤完成操作，顺利开启游戏。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 详细安装步骤 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-green-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">详细安装步骤</h2>
                    </div>

                    <div className="space-y-6">
                        {/* 步骤1 */}
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-start space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-purple-600 dark:text-purple-300 font-bold text-lg">1</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg mb-3">选择并准备启动器</h3>
                                    <p className="text-purple-800 dark:text-purple-200 mb-4">
                                        先选择适配的启动器，根据自身需求挑选（均支持整合包导入），特点如下：
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">
                                                    <span className="text-purple-600 dark:text-purple-300">🎨</span>
                                                </div>
                                                <h4 className="font-semibold text-purple-900 dark:text-purple-100">PCL2</h4>
                                            </div>
                                            <p className="text-purple-700 dark:text-purple-300 text-sm">
                                                界面美观，支持模组管理、资源包预览等高级功能，适合想自定义游戏的玩家。
                                            </p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">
                                                    <span className="text-purple-600 dark:text-purple-300">⚡</span>
                                                </div>
                                                <h4 className="font-semibold text-purple-900 dark:text-purple-100">HMCL</h4>
                                            </div>
                                            <p className="text-purple-700 dark:text-purple-300 text-sm">
                                                体积轻量（约10MB），启动速度快，操作简单，新手友好。
                                            </p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">
                                                    <span className="text-purple-600 dark:text-purple-300">🏢</span>
                                                </div>
                                                <h4 className="font-semibold text-purple-900 dark:text-purple-100">官方启动器</h4>
                                            </div>
                                            <p className="text-purple-700 dark:text-purple-300 text-sm">
                                                由 Mojang 官方开发，稳定性强，支持正版账号直接登录，适合偏好官方工具的玩家。
                                            </p>
                                        </div>
                                        <a href="/downloads/launcher" className="font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                            下载启动器
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 步骤2 */}
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">2</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-3">安装并配置 Java 环境</h3>
                                    <p className="text-blue-800 dark:text-blue-200 mb-4">
                                        游戏需依赖 Java 21 及以上版本运行，安装步骤如下：
                                    </p>
                                    <div className="space-y-4">
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <ol className="space-y-3 text-blue-700 dark:text-blue-300">
                                                <li className="flex items-start">
                                                    <span className="text-blue-500 mr-2 mt-1">1.</span>
                                                    <span>访问 <a href="https://www.oracle.com/java/technologies/javase-downloads.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Oracle 官方网站</a>，下载对应系统（Windows/macOS/Linux）的 Java 21+ 安装包。</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-blue-500 mr-2 mt-1">2.</span>
                                                    <span>运行安装包，按提示完成安装（建议默认路径，便于启动器识别）。</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-blue-500 mr-2 mt-1">3.</span>
                                                    <span>安装后可在"命令提示符（CMD）"输入 <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-sm">java -version</code>，确认显示"java version "21.x.x""即成功。</span>
                                                </li>
                                            </ol>
                                        </div>
                                        <div className="bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-lg shrink-0">
                                                    <span className="text-yellow-600 dark:text-yellow-300">⚠️</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">重要提醒</h4>
                                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                                        若使用 Java 17 及以下版本，会出现"版本不兼容"报错，导致游戏无法启动。
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 步骤3 */}
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                            <div className="flex items-start space-x-4">
                                <div className="bg-green-100 dark:bg-green-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-green-600 dark:text-green-300 font-bold text-lg">3</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-green-900 dark:text-green-100 text-lg mb-3">下载官方整合包</h3>
                                    <p className="text-green-800 dark:text-green-200 mb-4">
                                        前往服务器 <a href="/downloads" className="text-green-600 dark:text-green-400 hover:underline font-medium">专属资源下载页面</a>，找到"EndlessPixel 整合包"板块：
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg text-center">
                                            <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-green-600 dark:text-green-300 text-lg">🔥</span>
                                            </div>
                                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Latest 版本</h4>
                                            <p className="text-green-700 dark:text-green-300 text-sm">
                                                优先选择标有"Latest"标签的版本，包含最新修复和功能更新。
                                            </p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg text-center">
                                            <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-green-600 dark:text-green-300 text-lg">🛡️</span>
                                            </div>
                                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Stable 版本</h4>
                                            <p className="text-green-700 dark:text-green-300 text-sm">
                                                若需稳定版，可选择标有"Stable"标签的历史版本（适配性已验证）。
                                            </p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg text-center">
                                            <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-green-600 dark:text-green-300 text-lg">📥</span>
                                            </div>
                                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">下载建议</h4>
                                            <p className="text-green-700 dark:text-green-300 text-sm">
                                                下载时建议使用浏览器自带下载工具，避免第三方下载器拦截文件。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 步骤4 */}
                        <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-start space-x-4">
                                <div className="bg-orange-100 dark:bg-orange-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-orange-600 dark:text-orange-300 font-bold text-lg">4</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg mb-3">导入整合包到启动器</h3>
                                    <p className="text-orange-800 dark:text-orange-200 mb-4">
                                        不同启动器导入方式略有差异，具体操作如下：
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-3">
                                                <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg mr-3">
                                                    <span className="text-orange-600 dark:text-orange-300">🔄</span>
                                                </div>
                                                <h4 className="font-semibold text-orange-900 dark:text-orange-100">PCL2/HMCL</h4>
                                            </div>
                                            <p className="text-orange-700 dark:text-orange-300 text-sm">
                                                打开启动器，直接将下载的整合包文件（.zip/.mrpack 格式）拖入窗口，弹窗点击"确认导入"即可。
                                            </p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-3">
                                                <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg mr-3">
                                                    <span className="text-orange-600 dark:text-orange-300">🏢</span>
                                                </div>
                                                <h4 className="font-semibold text-orange-900 dark:text-orange-100">官方启动器</h4>
                                            </div>
                                            <p className="text-orange-700 dark:text-orange-300 text-sm">
                                                点击"安装新游戏"→"导入"→选择整合包文件，等待资源自动加载。
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg mt-4">
                                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                                            <span className="font-semibold">提示：</span> 导入后启动器会自动下载依赖资源（如模组、材质包），请耐心等待进度条完成（需保持网络稳定）。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 步骤5 */}
                        <div className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
                            <div className="flex items-start space-x-4">
                                <div className="bg-red-100 dark:bg-red-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-red-600 dark:text-red-300 font-bold text-lg">5</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 dark:text-red-100 text-lg mb-3">配置并启动游戏</h3>
                                    <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                        <ol className="space-y-3 text-red-700 dark:text-red-300">
                                            <li className="flex items-start">
                                                <span className="text-red-500 mr-2 mt-1">1.</span>
                                                <span>在启动器的"游戏列表"找到"EndlessPixel"，点击右侧"设置"图标。</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-500 mr-2 mt-1">2.</span>
                                                <span>在"内存分配"选项中，设置"最小内存 2GB，最大内存 4GB"（若电脑配置较高，可将最大内存调至 6GB）。</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-500 mr-2 mt-1">3.</span>
                                                <span>确认"Java 路径"已自动识别（或手动选择 Java 21 的安装路径，如 C:\Program Files\Java\jdk-21\bin\java.exe）。</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-500 mr-2 mt-1">4.</span>
                                                <span>点击"启动游戏"，首次启动会加载模组（耗时约1-3分钟），出现游戏主界面即成功。</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 常见问题解答 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">常见问题解答</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 启动失败 */}
                        <div className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 dark:bg-red-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-red-600 dark:text-red-300">❌</span>
                                </div>
                                <h3 className="font-bold text-red-900 dark:text-red-100">启动失败</h3>
                            </div>
                            <p className="text-red-800 dark:text-red-200 text-sm mb-4">
                                报错/无响应
                            </p>
                            <ul className="text-red-700 dark:text-red-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>优先检查 Java 版本：按步骤 2 验证是否为 Java 21+，若不是需重新安装。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>修复 Java 路径：启动器设置中，手动选择 Java 21 的"java.exe"文件路径。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>重新下载整合包：若整合包文件损坏，删除原文件后重新下载。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>关闭安全软件：部分杀毒软件会误判模组文件，临时关闭后重试启动。</span>
                                </li>
                            </ul>
                        </div>

                        {/* 内存不足 */}
                        <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-orange-100 dark:bg-orange-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-orange-600 dark:text-orange-300">💾</span>
                                </div>
                                <h3 className="font-bold text-orange-900 dark:text-orange-100">内存不足</h3>
                            </div>
                            <p className="text-orange-800 dark:text-orange-200 text-sm mb-4">
                                弹窗提示"Out of Memory"
                            </p>
                            <ul className="text-orange-700 dark:text-orange-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>调整内存分配：启动器设置中，将"最大内存"设为 4GB。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>关闭后台程序：按 Ctrl+Shift+Esc 打开任务管理器，结束浏览器等占用内存的进程。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>减少模组加载：在启动器"模组管理"中，暂时禁用非必要的视觉类模组。</span>
                                </li>
                            </ul>
                        </div>

                        {/* 导入后找不到游戏 */}
                        <div className="bg-linear-to-r from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-purple-600 dark:text-purple-300">🔍</span>
                                </div>
                                <h3 className="font-bold text-purple-900 dark:text-purple-100">找不到游戏</h3>
                            </div>
                            <p className="text-purple-800 dark:text-purple-200 text-sm mb-4">
                                导入后找不到游戏
                            </p>
                            <ul className="text-purple-700 dark:text-purple-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>检查文件格式：确保下载的是 .zip 或 .mrpack 格式的整合包。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>刷新游戏列表：部分启动器需点击"刷新"按钮，才能显示新导入的游戏。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>重新导入：若导入过程中断，删除未完成的游戏文件，重新拖入整合包。</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>查看官方的<a href="downloads/issues" className="text-purple-600 dark:text-purple-400 hover:underline"> issues</a>：有没有可能存在已知的启动崩溃问题。</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 帮助提示 */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-green-300 dark:border-green-700">
                    <div className="flex items-start space-x-4">
                        <div className="bg-green-100 dark:bg-green-800 p-3 rounded-xl shrink-0">
                            <span className="text-2xl text-green-600 dark:text-green-300">💡</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3">获取帮助</h3>
                            <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed">
                                若遇到上述未覆盖的问题，可加入官方 QQ 群（870594910），群内有管理员和老玩家提供实时帮助；也可查看 Wiki 中的"进阶 troubleshooting"板块，获取更多故障排查方案。
                            </p>
                        </div>
                    </div>
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
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="shrink-0">
                        <Terminal className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器玩家命令</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                ⌨️ 新手入门
                            </span>
                            <span>最后编辑：2025/10/24</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：4分钟</span>
                        </div>
                    </div>
                </div>

                {/* 命令分类 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 登录命令 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">登录命令</h2>
                        </div>
                        <div className="space-y-3">
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
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                                        <span className="text-blue-600 dark:text-blue-300 text-sm">🔐</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 传送命令 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">传送命令</h2>
                        </div>
                        <div className="space-y-3">
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
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                                    <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
                                        <span className="text-purple-600 dark:text-purple-300 text-sm">🚀</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 皮肤管理 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-cyan-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">皮肤管理</h2>
                        </div>
                        <div className="space-y-3">
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
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-cyan-200 dark:border-cyan-800 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all">
                                    <div className="bg-cyan-100 dark:bg-cyan-800 p-2 rounded-lg">
                                        <span className="text-cyan-600 dark:text-cyan-300 text-sm">👤</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-cyan-700 dark:text-cyan-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 技能系统 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-emerald-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">技能系统</h2>
                        </div>
                        <div className="space-y-3">
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
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-emerald-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all">
                                    <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-lg">
                                        <span className="text-emerald-600 dark:text-emerald-300 text-sm">⭐</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 其他命令 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-amber-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">其他命令</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { command: "/killme", desc: "自杀", icon: "💀" },
                            { command: "/4", desc: "自杀", icon: "💀" },
                            { command: "/killme:4", desc: "自杀", icon: "💀" }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-4 bg-linear-to-r from-amber-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-600 transition-all">
                                <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-lg">
                                    <span className="text-amber-600 dark:text-amber-300 text-lg">{item.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono block mb-2">{item.command}</code>
                                    <p className="text-amber-700 dark:text-amber-300 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 提示信息 */}
                <div className="bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-yellow-300 dark:border-yellow-700">
                    <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-xl shrink-0">
                            <span className="text-2xl text-yellow-600 dark:text-yellow-300">💡</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-3">使用提示</h3>
                            <p className="text-yellow-800 dark:text-yellow-200 text-lg leading-relaxed">
                                所有命令区分大小写，请正确输入。遇到问题可联系管理员帮助。
                            </p>
                        </div>
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
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="shrink-0">
                        <Shield className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">领地管理</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                🏠 功能指南
                            </span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：6分钟</span>
                        </div>
                    </div>
                </div>

                {/* 命令分类网格 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 主菜单 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">主菜单</h2>
                        </div>
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-3 p-3">
                                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                                    <span className="text-blue-600 dark:text-blue-300">📋</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">打开插件的主菜单界面</p>
                                    <code className="bg-white dark:bg-gray-800 px-3 py-1 rounded text-sm font-mono">/dominion menu [page]</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 创建与删除 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">创建与删除</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { command: "/dominion create <name>", desc: "创建一个新的领地" },
                                { command: "/dominion auto_create <name>", desc: "自动创建一个新的领地" },
                                { command: "/dominion create_sub <name> <dominion_name>", desc: "在指定领地下创建子领地" },
                                { command: "/dominion auto_create_sub <name> <dominion_name>", desc: "自动在指定领地下创建子领地" },
                                { command: "/dominion delete <dominion_name> [force]", desc: "删除指定的领地" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
                                        <span className="text-purple-600 dark:text-purple-300 text-sm">🏗️</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 领地管理 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-green-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">领地管理</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { command: "/dominion resize <name> <expand|contract> <size> [direction]", desc: "调整领地大小" },
                                { command: "/dominion set_env <name> <flag> <true|false>", desc: "设置环境标志" },
                                { command: "/dominion set_guest <name> <flag> <true|false>", desc: "设置访客标志" },
                                { command: "/dominion set_map_color <name> <color>", desc: "设置地图颜色" },
                                { command: "/dominion set_tp <name>", desc: "设置传送点" },
                                { command: "/dominion set_msg <name> <enter|leave> <message>", desc: "设置消息" },
                                { command: "/dominion rename <name> <newName>", desc: "重命名领地" },
                                { command: "/dominion give <name> <player> [force]", desc: "转让领地" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                        <span className="text-green-600 dark:text-green-300 text-sm">⚙️</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 成员管理 */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-10 bg-yellow-500 rounded-full mr-4"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">成员管理</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { command: "/dominion member_add <name> <player>", desc: "向领地添加新成员" },
                                { command: "/dominion member_remove <name> <member>", desc: "从领地中移除指定成员" },
                                { command: "/dominion member_set_pri <name> <member> <flag> <true|false>", desc: "设置成员的权限标志" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-lg">
                                        <span className="text-yellow-600 dark:text-yellow-300 text-sm">👥</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 其他功能 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-red-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">权限组与模板管理</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 权限组管理 */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-red-900 dark:text-red-100 mb-4">权限组管理</h3>
                            {[
                                { command: "/dominion group_create <name> <group>", desc: "创建权限组" },
                                { command: "/dominion group_set_flag <name> <group> <flag> <true|false>", desc: "设置权限组标志" },
                                { command: "/dominion group_add_member <name> <group> <member>", desc: "添加组成员" },
                                { command: "/dominion group_remove_member <name> <group> <member>", desc: "移除组成员" },
                                { command: "/dominion group_rename <name> <group> <new_group>", desc: "重命名权限组" },
                                { command: "/dominion group_delete <name> <group>", desc: "删除权限组" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="bg-red-100 dark:bg-red-800 p-2 rounded-lg">
                                        <span className="text-red-600 dark:text-red-300 text-sm">🔐</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 模板管理与杂项 */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4">模板管理与杂项</h3>
                            {[
                                { command: "/dominion member_apply_template <name> <member> <template>", desc: "应用权限模板" },
                                { command: "/dominion template_create <template>", desc: "创建权限模板" },
                                { command: "/dominion template_delete <template>", desc: "删除权限模板" },
                                { command: "/dominion template_set_flag <template> <flag> <true|false>", desc: "设置模板标志" },
                                { command: "/dominion title_use <title_id>", desc: "使用称号" },
                                { command: "/dominion tp <name>", desc: "传送到领地" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                    <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg">
                                        <span className="text-indigo-600 dark:text-indigo-300 text-sm">📄</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono break-all">{item.command}</code>
                                        <p className="text-indigo-700 dark:text-indigo-300 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
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
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-red-200 dark:border-red-800">
                    <div className="shrink-0">
                        <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器规则</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                📜 规则制度
                            </span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：10分钟</span>
                        </div>
                    </div>
                </div>

                {/* 重要提醒 */}
                <div className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-red-300 dark:border-red-700">
                    <div className="flex items-start space-x-4">
                        <div className="bg-red-100 dark:bg-red-800 p-3 rounded-xl shrink-0">
                            <span className="text-2xl text-red-600 dark:text-red-300">⚠️</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-3">重要提醒</h2>
                            <p className="text-red-800 dark:text-red-200 text-lg leading-relaxed">
                                请仔细阅读并遵守以下规则，违规行为将受到相应处罚。仅有服主和管理员具有所有规则的最终解释权。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 核心规则 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">核心规则</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { rule: "外挂使用限制", desc: "允许使用矿透，但需适度不可过度嚣张；严禁使用其他任何形式的作弊工具", icon: "🔍" },
                            { rule: "消息发送规范", desc: "禁止消息刷屏，单次发送10条以上视为违规", icon: "💬" },
                            { rule: "服务器保护", desc: "严禁崩服(本来性能就不是很好，你还崩，让不让别人玩啊)", icon: "🛡️" },
                            { rule: "领地创建规则", desc: "禁止恶意创建领地(特别是不属于你的地方，或者公共区域，你别以为你的领地就是无敌的，我们管理员可以直接编辑，还能给你拆掉，甚至直接给你删掉)", icon: "🏠" },
                            { rule: "公共资源管理", desc: "禁止恶意给公共箱子上锁(别人共享资源，你给别人箱子锁上了，独吞是吧，小心管理员直接给你锁铲掉)", icon: "📦" },
                            { rule: "特殊装置限制", desc: "严禁建造卡服机，区块抑制器(你给服务器卡崩了封了，你不想玩，不要让别人不玩)", icon: "⚙️" },
                            { rule: "聊天用语要求", desc: "聊天栏文明用语(我看谁敢说带f开头的单词，直接给你踹了)", icon: "📝" },
                            { rule: "交易安全规范", desc: "禁止使用现实现金交易，私下交易被骗服务器概不负责", icon: "💰" },
                            { rule: "礼品码使用规则", desc: "礼品兑换代码禁止二次以高价出售，请认准官方渠道(不会真有人去花钱买吧，这东西我们Discord免费送啊)", icon: "🎁" },
                            { rule: "经验交易提醒", desc: "请不要相信那些可以售卖经验的玩家，除非他售卖的是附魔之瓶(普通玩家无法使用xp命令)", icon: "⭐" }
                        ].map((item, index) => (
                            <div key={index} className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg shrink-0">
                                        <span className="text-blue-600 dark:text-blue-300 text-lg">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-2">
                                            {index + 1}. {item.rule}
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 违规处罚机制 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-red-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">违规处罚机制</h2>
                    </div>

                    <div className="bg-linear-to-r from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/60 dark:bg-gray-600/30 p-4 rounded-lg text-center border-2 border-red-100 dark:border-red-800">
                                <div className="bg-red-100 dark:bg-red-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-red-600 dark:text-red-300 font-bold">1</span>
                                </div>
                                <h3 className="font-bold text-red-900 dark:text-red-100 text-sm mb-1">第一次违规</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm">封禁账号 1 天</p>
                                <code className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">ban1d</code>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-600/30 p-4 rounded-lg text-center border-2 border-orange-100 dark:border-orange-800">
                                <div className="bg-orange-100 dark:bg-orange-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-orange-600 dark:text-orange-300 font-bold">2</span>
                                </div>
                                <h3 className="font-bold text-orange-900 dark:text-orange-100 text-sm mb-1">第二次违规</h3>
                                <p className="text-orange-700 dark:text-orange-300 text-sm">封禁账号 30 天</p>
                                <code className="text-orange-600 dark:text-orange-400 text-xs bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">ban30d</code>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-600/30 p-4 rounded-lg text-center border-2 border-yellow-100 dark:border-yellow-800">
                                <div className="bg-yellow-100 dark:bg-yellow-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-yellow-600 dark:text-yellow-300 font-bold">3</span>
                                </div>
                                <h3 className="font-bold text-yellow-900 dark:text-yellow-100 text-sm mb-1">第三次违规</h3>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm">封禁账号 6 个月</p>
                                <code className="text-yellow-600 dark:text-yellow-400 text-xs bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">ban6m</code>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-600/30 p-4 rounded-lg text-center border-2 border-red-200 dark:border-red-700">
                                <div className="bg-red-200 dark:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-red-700 dark:text-red-300 font-bold">∞</span>
                                </div>
                                <h3 className="font-bold text-red-900 dark:text-red-100 text-sm mb-1">第四次违规</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm">永久封禁账号</p>
                                <code className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">ban∞</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    "client-versions": {
        title: "服务器客户端版本说明",
        category: "技术指南",
        icon: Wrench,
        lastUpdated: "2025/11/1",
        author: "system_mini",
        readTime: "6分钟",
        content: (
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-orange-200 dark:border-orange-800">
                    <div className="shrink-0">
                        <Wrench className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器客户端版本说明</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                💻 技术指南
                            </span>
                            <span>最后编辑：2025/11/1</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：6分钟</span>
                        </div>
                    </div>
                </div>

                {/* 支持版本 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-green-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">支持版本</h2>
                    </div>

                    <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                        <span className="text-green-600 dark:text-green-300">🎯</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">服务器支持版本</h3>
                                        <p className="text-green-700 dark:text-green-300 text-sm">1.8+ 至 1.21.10及以上版本</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                        <span className="text-green-600 dark:text-green-300">⭐</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">推荐版本</h3>
                                        <p className="text-green-700 dark:text-green-300 text-sm">1.21.10</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                        <span className="text-green-600 dark:text-green-300">🔢</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">协议号</h3>
                                        <p className="text-green-700 dark:text-green-300 text-sm">773</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                        <span className="text-green-600 dark:text-green-300">🔌</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">版本兼容插件</h3>
                                        <p className="text-green-700 dark:text-green-300 text-sm">ViaVersion v5.5.2-SNAPSHOT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 版本兼容性 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">版本兼容性</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 最佳体验 */}
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-blue-600 dark:text-blue-300">🏆</span>
                                </div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100">最佳体验</h3>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                使用1.21.10版本可获得最佳游戏体验，支持所有最新特性
                            </p>
                        </div>

                        {/* 兼容版本 */}
                        <div className="bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-yellow-600 dark:text-yellow-300">🔧</span>
                                </div>
                                <h3 className="font-bold text-yellow-900 dark:text-yellow-100">兼容版本</h3>
                            </div>
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                                1.8至1.21.10及以上版本均可正常进入并游戏
                            </p>
                        </div>
                    </div>
                </div>

                {/* 版本兼容性图表 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">版本兼容范围</h2>
                    </div>

                    <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-purple-700 dark:text-purple-300 text-sm">1.7.2</span>
                            <span className="text-purple-700 dark:text-purple-300 text-sm">1.21.10+</span>
                        </div>
                        <div className="bg-purple-200 dark:bg-purple-700 h-4 rounded-full overflow-hidden">
                            <div className="bg-linear-to-r from-green-400 to-blue-500 h-full w-full rounded-full"></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-purple-600 dark:text-purple-400 text-xs">最低兼容</span>
                            <span className="text-purple-600 dark:text-purple-400 text-xs">最新支持</span>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/50 dark:bg-gray-600/30 p-3 rounded-lg">
                                <div className="text-green-600 dark:text-green-400 font-bold text-lg">1.7.2+</div>
                                <div className="text-purple-700 dark:text-purple-300 text-xs">基础兼容</div>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-600/30 p-3 rounded-lg">
                                <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">1.12-1.20</div>
                                <div className="text-purple-700 dark:text-purple-300 text-xs">稳定支持</div>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-600/30 p-3 rounded-lg">
                                <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">1.21.10</div>
                                <div className="text-purple-700 dark:text-purple-300 text-xs">最佳体验</div>
                            </div>
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
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <div className="shrink-0">
                        <HelpCircle className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器连接问题及解决方法</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                🔧 故障排除
                            </span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：7分钟</span>
                        </div>
                    </div>
                </div>

                {/* 介绍段落 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                        在尝试连接服务器时，玩家可能会碰到形形色色的问题。下面为您详细介绍常见问题及其对应的解决策略：
                    </p>
                </div>

                {/* 常见问题 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">常见连接问题</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 连接超时 */}
                        <div className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 dark:bg-red-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-red-600 dark:text-red-300">⏱️</span>
                                </div>
                                <h3 className="font-bold text-red-900 dark:text-red-100 text-lg">连接超时</h3>
                            </div>
                            <p className="text-red-800 dark:text-red-200 text-sm mb-4">
                                <strong>问题根源：</strong>网络链路中断或服务器节点响应延迟
                            </p>
                            <ul className="text-red-700 dark:text-red-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>检查本地网络连接是否正常</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>尝试切换其他服务器节点连接</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <span>重启游戏客户端释放临时连接缓存</span>
                                </li>
                            </ul>
                        </div>

                        {/* 版本不兼容 */}
                        <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-orange-100 dark:bg-orange-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-orange-600 dark:text-orange-300">🔧</span>
                                </div>
                                <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg">版本不兼容</h3>
                            </div>
                            <p className="text-orange-800 dark:text-orange-200 text-sm mb-4">
                                <strong>问题根源：</strong>客户端版本与服务器协议不匹配
                            </p>
                            <ul className="text-orange-700 dark:text-orange-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>确认客户端版本在1.8-1.21.10范围内（协议号773）</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>推荐使用1.21.10版本获得最佳兼容性</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-1">•</span>
                                    <span>确保未使用修改过协议的第三方客户端</span>
                                </li>
                            </ul>
                        </div>

                        {/* 节点异常 */}
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-blue-600 dark:text-blue-300">🌐</span>
                                </div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg">部分节点临时异常</h3>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                                <strong>问题根源：</strong>服务器节点因网络波动或临时故障导致连接失败
                            </p>
                            <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-1">•</span>
                                    <span>切换至其他可用节点重新连接</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-1">•</span>
                                    <span>等待5-10分钟后再次尝试（节点通常会自动恢复）</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-1">•</span>
                                    <span>查看服务器群公告确认节点状态</span>
                                </li>
                            </ul>
                        </div>

                        {/* 服务器维护 */}
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-green-600 dark:text-green-300">🛠️</span>
                                </div>
                                <h3 className="font-bold text-green-900 dark:text-green-100 text-lg">服务器维护中</h3>
                            </div>
                            <p className="text-green-800 dark:text-green-200 text-sm mb-4">
                                <strong>问题根源：</strong>服务器正在进行版本更新或系统维护
                            </p>
                            <ul className="text-green-700 dark:text-green-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-1">•</span>
                                    <span>关注服务器公告了解维护结束时间</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-1">•</span>
                                    <span>紧急情况可在游戏群@服主请求协助</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-1">•</span>
                                    <span>维护期间建议暂时关闭自动重连功能</span>
                                </li>
                            </ul>
                        </div>

                        {/* 服务器负载过高 */}
                        <div className="bg-linear-to-r from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-purple-600 dark:text-purple-300">🔥</span>
                                </div>
                                <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">服务器负载过高</h3>
                            </div>
                            <p className="text-purple-800 dark:text-purple-200 text-sm mb-4">
                                <strong>问题根源：</strong>当前在线玩家过多导致服务器压力过大
                            </p>
                            <ul className="text-purple-700 dark:text-purple-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>错峰登录（避开晚间黄金时段）</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>尝试多次连接直至成功进入</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2 mt-1">•</span>
                                    <span>减少连接时加载的资源包大小</span>
                                </li>
                            </ul>
                        </div>

                        {/* 本地网络异常 */}
                        <div className="bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-yellow-600 dark:text-yellow-300">📶</span>
                                </div>
                                <h3 className="font-bold text-yellow-900 dark:text-yellow-100 text-lg">本地网络异常</h3>
                            </div>
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-4">
                                <strong>问题根源：</strong>本地网络不稳定或防火墙限制连接
                            </p>
                            <ul className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-1">•</span>
                                    <span>重启路由器刷新网络连接</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-1">•</span>
                                    <span>检查防火墙是否允许Minecraft访问网络</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-1">•</span>
                                    <span>切换网络环境（如从WiFi改为有线连接）</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 其他疑难问题 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-gray-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">其他疑难问题</h2>
                    </div>

                    <div className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-200 text-lg mb-6">
                            如果遇到的问题不在上述范围内，可尝试以下通用解决方法：
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-600/30 rounded-lg">
                                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                                    <span className="text-blue-600 dark:text-blue-300 text-lg">🔄</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">重启客户端</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">关闭并重新启动Minecraft，解决临时进程错误</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-600/30 rounded-lg">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                                    <span className="text-green-600 dark:text-green-300 text-lg">📢</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">查看公告</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">服务器公告可能包含当前问题的临时解决方案</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-600/30 rounded-lg">
                                <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
                                    <span className="text-purple-600 dark:text-purple-300 text-lg">👨‍💼</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">联系管理员</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">在游戏群中描述具体问题，管理员会协助排查</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-600/30 rounded-lg">
                                <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg">
                                    <span className="text-orange-600 dark:text-orange-300 text-lg">📋</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">检查日志</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">客户端报错日志（.minecraft/logs）可提供故障线索</p>
                                </div>
                            </div>
                        </div>
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
            <div className="space-y-8">
                {/* 页面头部：全页面统一，PR 请勿更改 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="shrink-0">
                        <Wrench className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器FRP节点贡献指南</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">💻 技术指南</span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：12分钟</span>
                        </div>
                    </div>
                </div>

                {/* 一句话明白 · 新增人话卡片 */}
                <div className="mb-6 p-4 rounded-2xl border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-bold text-red-800 dark:text-red-200">一句话：你有公网服务器吗？</p>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                没有 → 直接右上角关闭；有 → 继续看，10 分钟把自家服务器借给服主当跳板，帮大家降延迟。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 什么是FRP · 内容保持与原 Wiki 一致 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">什么是FRP</h2>
                    </div>
                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl shrink-0">
                                <span className="text-2xl text-blue-600 dark:text-blue-300">🚀</span>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 text-lg leading-relaxed">
                                FRP（Fast Reverse Proxy）是一个高性能的反向代理应用，可帮助玩家将内网服务暴露到公网，为服务器提供多节点接入支持，提升不同地区玩家的连接稳定性。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 配置要求 · 内容保持与原 Wiki 一致 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-green-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">配置要求</h2>
                    </div>
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg mt-1"><span className="text-green-600 dark:text-green-300">🌐</span></div>
                                <div><h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">网络连接</h4><p className="text-green-700 dark:text-green-300 text-sm">稳定的网络连接（建议丢包率＜1%，延迟＜100ms）</p></div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg mt-1"><span className="text-green-600 dark:text-green-300">🔗</span></div>
                                <div><h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">公网资源</h4><p className="text-green-700 dark:text-green-300 text-sm">拥有公网IP或已解析的域名（支持IPv4/IPv6）</p></div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg mt-1"><span className="text-green-600 dark:text-green-300">📊</span></div>
                                <div><h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">带宽支持</h4><p className="text-green-700 dark:text-green-300 text-sm">上行带宽≥8Mbps，满足多玩家同时连接</p></div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg mt-1"><span className="text-green-600 dark:text-green-300">⚙️</span></div>
                                <div><h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">服务端版本</h4><p className="text-green-700 dark:text-green-300 text-sm">安装FRP服务端（推荐v0.50.0及以上版本）</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FRP配置文件 · 格式与官方 Wiki 完全一致 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FRP配置文件（多格式）</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* INI */}
                        <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center mb-4"><div className="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-xl mr-4"><span className="text-2xl text-indigo-600 dark:text-indigo-300">📄</span></div><h3 className="font-bold text-indigo-900 dark:text-indigo-100">INI格式（frpc.ini）</h3></div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">{`[common]
server_addr = xxx.xxx.xxx.xxx
server_port = 7000
token = xxxxxxxxxxxxxxxxxxxx

[your_node_name]
type = tcp
local_ip = 127.0.0.1
local_port = 25566`}</pre>
                        </div>
                        {/* TOML */}
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center mb-4"><div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl mr-4"><span className="text-2xl text-purple-600 dark:text-purple-300">📄</span></div><h3 className="font-bold text-purple-900 dark:text-purple-100">TOML格式（frpc.toml）</h3></div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">{`[common]
server_addr = "xxx.xxx.xxx.xxx"
server_port = 7000
token = "xxxxxxxxxxxxxxxxxxxx"

[[proxies]]
name = "your_node_name"
type = "tcp"
local_ip = "127.0.0.1"
local_port = 25566`}</pre>
                        </div>
                        {/* YAML */}
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                            <div className="flex items-center mb-4"><div className="bg-green-100 dark:bg-green-800 p-3 rounded-xl mr-4"><span className="text-2xl text-green-600 dark:text-green-300">📄</span></div><h3 className="font-bold text-green-900 dark:text-green-100">YAML格式（frpc.yaml）</h3></div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">{`common:
  server_addr: xxx.xxx.xxx.xxx
  server_port: 7000
  token: xxxxxxxxxxxxxxxxxxxx

proxies:
  - name: your_node_name
    type: tcp
    local_ip: 127.0.0.1
    local_port: 25566`}</pre>
                        </div>
                        {/* JSON */}
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center mb-4"><div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl mr-4"><span className="text-2xl text-blue-600 dark:text-blue-300">📄</span></div><h3 className="font-bold text-blue-900 dark:text-blue-100">JSON格式（frpc.json）</h3></div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">{`{
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
}`}</pre>
                        </div>
                    </div>
                </div>

                {/* FRP 服务端示例 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-rose-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FRP服务端示例（frps.toml）</h2>
                    </div>
                    <div className="bg-linear-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-rose-200 dark:border-rose-800">
                        <div className="flex items-center mb-4">
                            <div className="bg-rose-100 dark:bg-rose-800 p-3 rounded-xl mr-4">
                                <span className="text-2xl text-rose-600 dark:text-rose-300">🛠️</span>
                            </div>
                            <p className="text-rose-800 dark:text-rose-200 text-sm">
                                把下面内容保存为 <code className="bg-rose-200 dark:bg-rose-800 px-2 py-0.5 rounded">frps.toml</code> 并放到你的 FRP 服务端目录，<strong>公网IP:7000</strong> 即对外提供节点服务。
                            </p>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                            {`[common]
bind_addr = 0.0.0.0
bind_port = 7000
# 可选：节点鉴权，客户端token需与此一致
token = "xxxxxxxxxxxxxxxxxxxx"
# 可选：日志
log_file = "frps.log"
log_level = "info"
# 可选：最大连接池
max_pool_count = 50
# 可选：Dashboard（留空即禁用）
# dashboard_addr = 0.0.0.0
# dashboard_port = 7500
# dashboard_user = "admin"
# dashboard_pwd  = "admin"`}
                        </pre>
                        <p className="text-rose-700 dark:text-rose-300 text-xs mt-3">
                            ⚠️ 防火墙/安全组务必放行 <strong>TCP 7000</strong> 及你准备给玩家用的 <strong>25565-25568</strong> 端口段。
                        </p>
                    </div>
                </div>

                {/* 节点配置与提交 · 格式与官方 Wiki 完全一致 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-10 bg-yellow-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">节点配置与提交</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 推荐端口 */}
                        <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                            <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center"><span className="bg-orange-100 dark:bg-orange-800 p-2 rounded-lg mr-3">🔌</span>推荐使用端口</h3>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full font-semibold border-2 border-orange-300 dark:border-orange-600">25565（最好）</span>
                                <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full font-semibold border-2 border-orange-300 dark:border-orange-600">25566</span>
                                <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full font-semibold border-2 border-orange-300 dark:border-orange-600">25568</span>
                                <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full font-semibold border-2 border-orange-300 dark:border-orange-600">22222</span>
                            </div>
                            <p className="text-orange-700 dark:text-orange-300 text-sm">注：端口需确保未被占用且已在防火墙开放，避免与其他服务冲突</p>
                        </div>

                        {/* 提交流程 */}
                        <div className="bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                            <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center"><span className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-lg mr-3">📤</span>节点提交流程</h3>
                            <div className="space-y-4">
                                <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">提交前准备</h4>
                                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm">
                                        <li className="flex items-start"><span className="text-yellow-500 mr-2 mt-1">1.</span><span>选择任一格式配置文件完成配置，本地测试连通性（启动命令：<code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded mx-1">frpc -c 配置文件名.格式</code>）</span></li>
                                        <li className="flex items-start"><span className="text-yellow-500 mr-2 mt-1">2.</span><span>记录节点信息：节点名称、公网IP/域名、使用端口、网络运营商</span></li>
                                    </ul>
                                </div>
                                <div className="bg-white/50 dark:bg-gray-600/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">提交方式</h4>
                                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm">
                                        <li className="flex items-start"><span className="text-yellow-500 mr-2 mt-1">1.</span><span>将配置文件与节点信息，私聊发送给服主（ID：system_mini）</span></li>
                                        <li className="flex items-start"><span className="text-yellow-500 mr-2 mt-1">2.</span><span>若通过邮件提交，主题格式为：<code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded mx-1">[节点贡献] 你的ID_推荐端口</code></span></li>
                                        <li className="flex items-start"><span className="text-yellow-500 mr-2 mt-1">3.</span><span>等待服主审核（1-2个工作日），审核通过后节点将加入服务器节点列表</span></li>
                                    </ul>
                                </div>
                                {/* 人话注意事项 · 可合并进原段落 */}
                                <div className="mt-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm">
                                    <strong>注意：</strong>服主要的是「客户端怎么连你」的示例配置（frpc.ini），
                                    但<strong>你得先自己装好 FRP 服务端（frps）</strong>，并保证
                                    <strong>公网IP:7000 能访问、25565-25568 端口已放行</strong>。
                                    审核通过后，我们会把你的节点挂到主服务器，玩家就能选你的线路进游戏。
                                </div>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                                    完全自愿，非强制，我们公网IP出口有限，只有300Mbps，经常几乎满载，想要为人民服务，就速速来贡献吧！
                                </p>
                            </div>
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
        "lastUpdated": "2025/11/21",
        "author": "system_mini",
        "readTime": "15分钟",
        "content": (
            <div className="space-y-8">
                {/* 页面头部 */}
                <div className="flex items-center space-x-4 p-6 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                    <div className="shrink-0">
                        <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">服务器特殊功能指南</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                                📁 特色功能
                            </span>
                            <span>最后编辑：2025/10/18</span>
                            <span>作者：system_mini</span>
                            <span>阅读时间：15分钟</span>
                        </div>
                    </div>
                </div>

                {/* 基础交互功能 */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-green-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">基础交互功能</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 坐下功能卡片 */}
                        <div className="group bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl">🪑</span>
                                </div>
                                <h3 className="font-bold text-green-900 dark:text-green-100 text-lg">坐下功能</h3>
                            </div>
                            <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                                手持空手状态时，右键点击下半砖或楼梯方块即可优雅坐下，体验真实的休息姿势。再次按下Shift键即可自然站起，为社交互动增添更多沉浸感。
                            </p>
                        </div>

                        {/* 连锁挖掘卡片 */}
                        <div className="group bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl">⛏️</span>
                                </div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg">连锁挖掘</h3>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed mb-4">
                                蹲下状态下使用对应工具，可一次性挖掘最多64个相同类型的矿石，大幅提升采集效率。特别优化了开采体验——按下Shift键开采时，可自动破坏同一矿脉内的全部矿石，让矿物收集更加便捷高效。
                            </p>
                            <img
                                src="https://cdn-raw.modrinth.com/data/OhduvhIc/images/f4c0ad7fa3b8b579753c1f757e80151798717c68.gif"
                                alt="连锁挖掘演示"
                                className="rounded-lg border border-gray-200 dark:border-gray-700 w-full h-auto"
                            />
                        </div>

                        {/* 农田防踩踏卡片 */}
                        <div className="group bg-linear-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl">🌾</span>
                                </div>
                                <h3 className="font-bold text-yellow-900 dark:text-yellow-100 text-lg">农田防踩踏</h3>
                            </div>
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                                农田被踩踏后不会退化为泥土，有效保护精心种植的农作物免受意外损害。这一贴心设计让农业管理更加轻松，不再担心因误操作而破坏农田生态系统。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 下界维度升级 */}
                <section className="bg-linear-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-red-200 dark:border-red-800">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-red-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">下界维度全面升级</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 生物群落优化 */}
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 dark:bg-red-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-red-600 dark:text-red-300">🌋</span>
                                </div>
                                <h3 className="text-xl font-bold text-red-900 dark:text-red-100">生物群落深度优化</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/60 dark:bg-gray-700/60 p-5 rounded-xl border border-red-100 dark:border-red-800">
                                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">下界荒原重构</h4>
                                    <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                                        从原本单调的"下界沙漠"彻底转变为充满敌意的洞穴式生态。新增壮观的下界尖刺结构，包含石笋与钟乳石群，配合黑石岩层与岩浆"湖泊"，营造出更具挑战性的探索环境。
                                    </p>
                                </div>

                                <div className="bg-white/60 dark:bg-gray-700/60 p-5 rounded-xl border border-red-100 dark:border-red-800">
                                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">森林生态增强</h4>
                                    <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                                        猩红森林与扭曲森林中新增黑石岩石群、倒下的真菌茎残骸，以及新型蔓延的巨大真菌物种。适度增加的植被密度让生态系统更加丰富，提升了生物群落的真实感与探索价值。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 史诗级结构 */}
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-purple-600 dark:text-purple-300">🏰</span>
                                </div>
                                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">史诗级新结构</h3>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-4">猩红塔与扭曲塔</h4>
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
                </section>

                {/* 主世界结构扩展 */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-emerald-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">主世界结构扩展</h2>
                    </div>

                    <div className="bg-linear-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
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
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-indigo-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">大师切割机：革命性制造系统</h2>
                    </div>

                    <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
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
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-teal-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">海洋探索：船只系统全面进化</h2>
                    </div>

                    <div className="bg-linear-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-teal-200 dark:border-teal-800">
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

                {/* 进度系统 */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-purple-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">BlazeandCave 进阶包：1202项进度挑战</h2>
                    </div>

                    <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-800 px-4 py-2 rounded-full mb-4">
                                <span className="text-purple-600 dark:text-purple-300 mr-2">🏆</span>
                                <span className="text-purple-800 dark:text-purple-200 font-semibold">超过 1000 项新进步！</span>
                            </div>
                            <p className="text-purple-700 dark:text-purple-300 text-lg">
                                BlazeandCave 的进阶包为您的世界添加了 1000 多个新进阶，使总数达到 1202 个，这为您的生存世界带来了许多新挑战或服务器的竞争力。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                                    <span className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">📋</span>
                                    进度系统特色
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                                            一些新的进步受到 1.12 之前各种现有成就以及 Minecraft 基岩版或主机版独有的成就的启发。许多纯粹是我自己或其他人的原创想法（参见额外制作人员名单部分）。您可以在此处找到进步列表。
                                        </p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">总共 16 个进阶标签！</h4>
                                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                                            原版进度中的所有五个选项卡都添加了更多进度以扩展现有内容，并且为更具体的类别添加了许多新的进度选项卡。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                                    <span className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg mr-3">🎯</span>
                                    主要进度分类
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        "BlazeandCave 的进步 - 包含基本的进度和里程碑进度",
                                        "采矿 - 与每种不同矿石相关的更多进步",
                                        "建筑 - 使用各种方块进行制作和建造",
                                        "农业 - 侧重于农作物和各种植物",
                                        "动物 - 涉及繁殖、屠宰和驯服动物以及钓鱼",
                                        "怪物 - 包含几乎所有怪物的独特进步和挑战",
                                        "武器 - 包括常规和非常规武器",
                                        "生物群落 - 与各种生物群落（包括海洋）相关的进步",
                                        "奇遇 - 与探索、村庄、贸易、突袭等相关的进步",
                                        "红石 - 制作和使用各种红石组件",
                                        "迷人 - 关于迷人的物品",
                                        "统计学 - 跟踪各种统计数据",
                                        "下面 - 与下界维度以及其中的怪物和结构有关的进步",
                                        "药水 - 与许多不同药水效果相关的进步",
                                        "结束 - 与末地维度以及其中的怪物和结构相关的进步",
                                        "超级挑战 - 数据包中最困难的改进，击败末影龙后解锁"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start bg-white/30 dark:bg-gray-700/30 p-3 rounded-lg">
                                            <span className="text-purple-500 mr-2 mt-1 text-xs">▶</span>
                                            <span className="text-purple-700 dark:text-purple-300 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 其他特殊功能 */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center mb-8">
                        <div className="w-2 h-10 bg-gray-500 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">进阶功能与系统优化</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-purple-600 dark:text-purple-300">✨</span>
                                </div>
                                <h3 className="font-bold text-purple-900 dark:text-purple-100">无限附魔系统</h3>
                            </div>
                            <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                                突破传统附魔等级限制，允许打造极致属性的顶级装备。这一系统为装备定制提供了无限可能性，让玩家能够真正打造出符合个人游戏风格的完美装备组合。
                            </p>
                        </div>

                        <div className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-gray-300 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl mr-4">
                                    <span className="text-2xl text-gray-600 dark:text-gray-300">🌌</span>
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
        )
    }
}

export default articles