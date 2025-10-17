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
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "12分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">整合包安装指南</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>分类：新手入门</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：12分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-600 p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">快速开始</h2>
            <p className="text-blue-800 dark:text-blue-200">
              本指南将帮助您快速安装并开始游玩 EndlessPixel 服务器。无论您是新手还是老玩家，都可以轻松完成以下步骤。
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">详细安装步骤</h2>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  1
                </span>
                准备启动器
              </h3>
              <p className="text-muted-foreground ml-9">
                选择一个适合您的启动器，例如 PCL2、HMCL 或官方启动器。以下是它们的特点：
              </p>
              <ul className="ml-9 mt-2 list-disc list-inside text-muted-foreground">
                <li><strong>PCL2</strong>：界面美观，功能丰富，适合高级玩家。</li>
                <li><strong>HMCL</strong>：轻量级，启动速度快，适合新手。</li>
                <li><strong>官方启动器</strong>：稳定可靠，官方支持。</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  2
                </span>
                安装 Java 环境
              </h3>
              <p className="text-muted-foreground ml-9">
                确保您的设备已安装 Java 21 或更高版本。如果尚未安装，请前往{" "}
                <a href="https://www.oracle.com/java/technologies/javase-downloads.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Oracle 官方网站
                </a>{" "}
                下载并安装。
              </p>
              <div className="ml-9 mt-2">
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>注意：</strong>低于 Java 21 的版本可能导致游戏无法正常运行。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  3
                </span>
                下载整合包
              </h3>
              <p className="text-muted-foreground ml-9">
                前往{" "}
                <a href="/downloads" className="text-primary hover:underline font-medium">
                  资源下载页面
                </a>{" "}
                下载最新版本的整合包。推荐选择标有“Latest”标签的版本以获得最佳体验。
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  4
                </span>
                导入整合包
              </h3>
              <p className="text-muted-foreground ml-9">
                将下载的整合包文件拖入启动器窗口，启动器会自动完成安装。您只需等待进度条完成即可。
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  5
                </span>
                启动游戏
              </h3>
              <p className="text-muted-foreground ml-9">
                点击启动器中的“启动游戏”按钮，开始您的冒险之旅！
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">常见问题解答</h2>
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">启动失败</h3>
              <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm">
                <li>• 检查 Java 版本是否为 Java 21 或更高。</li>
                <li>• 确保启动器设置的 Java 路径正确。</li>
                <li>• 尝试重新下载整合包。</li>
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">内存不足</h3>
              <ul className="text-orange-800 dark:text-orange-200 space-y-1 text-sm">
                <li>• 建议分配至少 4GB 内存。</li>
                <li>• 在启动器设置中调整内存分配。</li>
                <li>• 关闭其他占用内存的程序。</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 dark:border-green-600 p-4 mt-6">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>提示：</strong>如果遇到问题，可以加入我们的 QQ 群（870594910）寻求帮助，或查看其他 Wiki 文章获取更多信息。
            </p>
          </div>
        </div>
      </div>
    ),
  },
  "server-commands": {
    title: "服务器玩家命令",
    category: "新手入门",
    icon: Terminal,
    lastUpdated: "2025/08/15",
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
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：5分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-foreground mb-4">传送命令</h2>
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <ul className="space-y-2">
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/spawn</code> - 传送到主城
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/home</code> - 传送到家
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/sethome [名称]</code> - 设置家的位置
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/delhome [名称]</code> - 删除家
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/tpa [玩家名]</code> - 请求传送到某玩家
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/tpaccept</code> - 接受传送请求
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/tpdeny</code> - 拒绝传送请求
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">皮肤管理</h2>
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-4">
            <ul className="space-y-2">
              <li>
                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">
                  /skin set &lt;正版玩家用户名&gt;
                </code>{" "}
                - 设置皮肤
              </li>
              <li>
                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skins</code> -
                打开皮肤菜单
              </li>
              <li>
                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skin clear</code> -
                清除皮肤
              </li>
              <li>
                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skin update</code> -
                更新皮肤
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">技能系统</h2>
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-4">
            <ul className="space-y-2">
              <li>
                <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/skills</code> -
                查看技能等级
              </li>
              <li>
                <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">
                  /skills lang [language]
                </code>{" "}
                - 更改您的个人语言
              </li>
              <li>
                <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/stats</code> -
                打开统计数据菜单，显示所有统计数据概览和玩家等级
              </li>
              <li>
                <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/mana</code> -
                显示当前法力值
              </li>
              <li>
                <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">
                  /sk sources [skill] [sortType]
                </code>{" "}
                - 打开技能的来源菜单，显示获得经验值的方法
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mt-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>提示：</strong>所有命令都区分大小写，请确保正确输入。如果遇到问题，可以联系管理员获取帮助。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  "create-claims": {
    title: "如何创建领地",
    category: "新手入门",
    icon: Shield,
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "8分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">如何创建领地</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>分类：新手入门</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：8分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-foreground mb-4">创建领地步骤</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">1. 准备工具</h3>
              <p className="text-blue-800 dark:text-blue-200">手持箭（Arrow）作为选择工具</p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">2. 选择范围</h3>
              <ul className="text-green-800 dark:text-green-200 space-y-1">
                <li>• 左键点击第一个角落</li>
                <li>• 右键点击对角线的另一个角落</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">3. 创建领地</h3>
              <p className="text-purple-800 dark:text-purple-200">
                输入命令：
                <code className="bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded text-foreground">
                  /dom define [领地名称]
                </code>
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">管理命令</h2>
          <div className="bg-muted/50 p-4 rounded-lg">
            <ul className="space-y-2">
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/dom remove [领地名称]</code> - 删除领地
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/dom info [领地名称]</code> - 查看领地信息
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded text-foreground">/dom list</code> - 查看所有领地
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  "server-rules": {
    title: "服务器规则",
    category: "规则制度",
    icon: Shield,
    lastUpdated: "2025/08/15",
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
              <span>最后编辑：2025/08/15</span>
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
            <p className="text-red-800 dark:text-red-200">请仔细阅读并遵守以下规则，违规行为将受到相应处罚。</p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">基本规则</h2>
          <div className="space-y-3">
            <div className="bg-muted/50 p-3 rounded">
              <strong>1. 禁止恶意破坏</strong> - 不得故意破坏他人建筑或服务器设施
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <strong>2. 禁止使用外挂</strong> - 严禁使用任何形式的作弊工具
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <strong>3. 文明聊天</strong> - 禁止发送不当言论、广告或刷屏
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
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "6分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Wrench className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">服务器客户端版本说明</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>分类：技术指南</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：6分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">支持版本</h2>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-green-800">
              <strong>服务器支持版本：</strong>1.8 - 1.21.8
            </p>
            <p className="text-green-800">
              <strong>推荐版本：</strong>1.21.4
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">版本兼容性</h2>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <strong>最佳体验：</strong>使用1.21.4版本可获得最佳游戏体验
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <strong>兼容版本：</strong>1.8-1.21.8版本均可正常游戏
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
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "7分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">服务器连接问题及解决方法</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>分类：故障排除</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：7分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">常见问题</h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">连接超时</h3>
              <ul className="text-red-800 space-y-1">
                <li>• 检查网络连接</li>
                <li>• 尝试切换节点</li>
                <li>• 重启游戏客户端</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">版本不兼容</h3>
              <ul className="text-orange-800 space-y-1">
                <li>• 确认客户端版本在1.8-1.21.8范围内</li>
                <li>• 推荐使用1.21.4版本</li>
              </ul>
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
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "12分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">服务器FRP节点贡献指南</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>分类：技术指南</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：12分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是FRP</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800">
              FRP（Fast Reverse Proxy）是一个高性能的反向代理应用，可以帮助您将内网服务暴露到公网。
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">配置要求</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              <li>• 稳定的网络连接</li>
              <li>• 公网IP或域名</li>
              <li>• 足够的带宽支持</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  "special-features": {
    title: "服务器特殊功能指南",
    category: "特色功能",
    icon: Trophy,
    lastUpdated: "2025/08/15",
    author: "system_mini",
    readTime: "15分钟",
    content: (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">服务器特殊功能指南</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>分类：特色功能</span>
              <span>•</span>
              <span>最后编辑：2025/08/15</span>
              <span>•</span>
              <span>作者：system_mini</span>
              <span>•</span>
              <span>阅读时间：15分钟</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">坐下功能</h2>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-green-800">空手右键点击下半砖或楼梯可以坐下，再次右键或移动即可站起。</p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">连锁挖掘</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800">蹲下并使用对应工具可以连锁挖掘最多128个相同方块，大大提高挖掘效率。</p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">农田防踩踏</h2>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p className="text-yellow-800">农田踩踏后不会被破坏，保护您的农作物不受意外损害。</p>
          </div>
        </div>
      </div>
    ),
  },
}

export default articles
