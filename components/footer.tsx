import Link from "next/link"
import { Server, Github, MessageCircle, Video, Smartphone, Gamepad2, Heart, ExternalLink, Users, Download, BookOpen, Eye } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white border-t border-slate-700 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  EndlessPixel
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-emerald-400 font-medium">在线</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md text-sm leading-relaxed">
              一个由热爱游戏的玩家组成的社区，致力于提供有趣、自由、开放的游戏世界。
              我们相信游戏的魅力在于创造与分享。
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Github, href: "https://github.com/EndlessPixel", label: "GitHub" },
                { icon: MessageCircle, href: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910", label: "QQ群" },
                { icon: Gamepad2, href: "https://discord.gg/k63hRWt3fF", label: "Discord" },
                { icon: Video, href: "https://space.bilibili.com/3546799478409405", label: "Bilibili" },
                { icon: Smartphone, href: "https://kuaishou.cn/profile/3xth2cp4jf5ha6c", label: "快手" }
              ].map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg border border-slate-700 hover:border-slate-600"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>快速导航</span>
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Download, href: "/downloads", label: "资源下载" },
                { icon: Eye, href: "/status", label: "服务器状态" },
                { icon: BookOpen, href: "/wiki", label: "Wiki 百科" },
                { icon: Users, href: "/about", label: "关于我们" },
                { icon: Server, href: "https://stats.uptimerobot.com/uHTdCauXWA", label: "状态监控", external: true }
              ].map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-200 group py-1"
                      target={link.external ? "_blank" : undefined}
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      <span>{link.label}</span>
                      {link.external && (
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <Server className="w-5 h-5 text-green-400" />
              <span>服务器信息</span>
            </h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
                <span className="text-sm">版本</span>
                <span className="font-mono text-green-400 text-sm">1.21.10</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
                <span className="text-sm">QQ群</span>
                <span className="font-mono text-blue-400 text-sm">870594910</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
                <span className="text-sm">模式</span>
                <span className="text-amber-400 text-sm">离线模式</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
                <span className="text-sm">费用</span>
                <span className="text-emerald-400 text-sm">完全免费</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 dark:border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>&copy; 2024{currentYear > 2024 ? `~${currentYear}` : ''} EndlessPixel Studio</span>
              <span className="text-slate-600">•</span>
              <span>All rights reserved</span>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>by the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}