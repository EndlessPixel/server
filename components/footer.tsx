import Link from "next/link"
import { 
  Server, Github, MessageCircle, Video, Smartphone, Gamepad2, 
  Heart, ExternalLink, Users, Download, BookOpen, Eye 
} from "lucide-react"

// 社交媒体链接组件
const SocialLinks = ({ links }: { links: Array<{ icon: React.ElementType, href: string, label: string }> }) => (
  <div className="flex space-x-3">
    {links.map((social) => {
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
)

// 导航链接组件
const NavLinks = ({ links }: { links: Array<{ icon: React.ElementType, href: string, label: string, external?: boolean }> }) => (
  <ul className="space-y-3">
    {links.map((link) => {
      const Icon = link.icon
      return (
        <li key={link.label}>
          {link.external ? (
            <a 
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-200 group py-1"
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </a>
          ) : (
            <Link
              href={link.href}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-200 group py-1"
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>{link.label}</span>
              {link.external && (
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
              )}
            </Link>
          )}
        </li>
      )
    })}
  </ul>
)

// 服务器信息组件
const ServerInfo = ({ info }: { info: Array<{ label: string, value: string, color: string }> }) => (
  <div className="space-y-3 text-slate-300">
    {info.map((item, index) => (
      <div key={index} className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
        <span className="text-sm">{item.label}</span>
        <span className={`font-mono ${item.color} text-sm`}>{item.value}</span>
      </div>
    ))}
  </div>
)

// 品牌标识组件
const BrandLogo = () => (
  <div className="flex items-center space-x-3 mb-4">
    <div className="w-10 h-10 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
      <Server className="w-6 h-6 text-white" />
    </div>
    <div>
      <span className="font-bold text-2xl bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
        EndlessPixel
      </span>
      <div className="flex items-center space-x-1 mt-1">
        <span className="text-xs text-emerald-400 font-medium">在线</span>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
)

// 版权信息组件
const Copyright = ({ startYear = 2024 }: { startYear?: number }) => {
  const currentYear = new Date().getFullYear()
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="flex items-center space-x-2 text-slate-400 text-sm">
        <span>&copy; {startYear}{currentYear > startYear ? `~${currentYear}` : ''} EndlessPixel Studio</span>
      </div>

      <div className="flex items-center space-x-2 text-slate-400 text-sm">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
        <span>by the community</span>
      </div>
    </div>
  )
}

export function Footer() {
  // 社交媒体链接数据
  const socialLinks = [
    { icon: Github, href: "https://github.com/EndlessPixel", label: "GitHub" },
    { icon: MessageCircle, href: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910", label: "QQ群" },
    { icon: Gamepad2, href: "https://discord.gg/k63hRWt3fF", label: "Discord" },
    { icon: Video, href: "https://space.bilibili.com/3546799478409405", label: "Bilibili" },
    { icon: Smartphone, href: "https://kuaishou.cn/profile/3xth2cp4jf5ha6c", label: "快手" }
  ]

  // 导航链接数据
  const navLinks = [
    { icon: Download, href: "/downloads", label: "资源下载" },
    { icon: Eye, href: "/status", label: "服务器状态" },
    { icon: BookOpen, href: "/wiki", label: "Wiki 百科" },
    { icon: Users, href: "/about", label: "关于我们" },
    { icon: Server, href: "https://stats.uptimerobot.com/uHTdCauXWA", label: "状态监控", external: true }
  ]

  // 服务器信息数据
  const serverInfo = [
    { label: "版本", value: "1.21.10", color: "text-green-400" },
    { label: "QQ群", value: "870594910", color: "text-blue-400" },
    { label: "模式", value: "离线模式", color: "text-amber-400" },
    { label: "费用", value: "完全免费", color: "text-emerald-400" }
  ]

  return (
    <footer className="bg-linear-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white border-t border-slate-700 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="text-slate-300 mb-6 max-w-md text-sm leading-relaxed">
              一个由热爱游戏的玩家组成的社区，致力于提供有趣、自由、开放的游戏世界。
              我们相信游戏的魅力在于创造与分享。
            </p>
            <SocialLinks links={socialLinks} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>快速导航</span>
            </h3>
            <NavLinks links={navLinks} />
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <Server className="w-5 h-5 text-green-400" />
              <span>服务器信息</span>
            </h3>
            <ServerInfo info={serverInfo} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 dark:border-slate-800 mt-8 pt-8">
          <Copyright startYear={2024} />
        </div>
      </div>
    </footer>
  )
}