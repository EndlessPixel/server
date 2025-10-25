import Link from "next/link"
import { Server, Github, MessageCircle, Video, Smartphone, Gamepad2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">EndlessPixel</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
              一个由热爱游戏的玩家组成的社区，致力于提供有趣、自由、开放的游戏世界。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/EndlessPixel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/k63hRWt3fF"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
              </a>
              <a
                href="https://space.bilibili.com/3546799478409405"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
              >
                <Video className="w-5 h-5" />
              </a>
              <a
                href="https://kuaishou.cn/profile/3xth2cp4jf5ha6c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
              >
                <Smartphone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/downloads" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  资源下载
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  服务器状态
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Wiki 百科
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="https://stats.uptimerobot.com/uHTdCauXWA" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  服务器状态监控
                </Link>
              </li>
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-semibold mb-4">服务器信息</h3>
            <ul className="space-y-2 text-gray-300 dark:text-gray-400">
              <li>版本: Java Minecraft 1.21.10</li>
              <li>QQ群: 870594910</li>
              <li>模式: 离线模式</li>
              <li>费用: 完全免费</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center text-gray-300 dark:text-gray-400">
          <p>&copy; 2024~2025 EndlessPixel Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
