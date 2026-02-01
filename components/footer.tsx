"use client";

import Link from "next/link"
import {
  Server, Github, MessageCircle, Video, Smartphone, Gamepad2,
  Heart, ExternalLink, Users, Download, BookOpen, Eye, ChevronRight, Twitch, Facebook, Code
} from "lucide-react"
import { useState } from "react"

// 类型定义抽离，提高可维护性
type SocialLink = {
  icon: React.ElementType;
  href: string;
  label: string;
};

type NavLink = {
  icon: React.ElementType;
  href: string;
  label: string;
  external?: boolean;
};

type ServerInfoItem = {
  label: string;
  value: string;
  color: string;
};

// 社交媒体链接组件 - 优化交互和视觉
const SocialLinks = ({ links }: { links: SocialLink[] }) => (
  <div className="flex space-x-3">
    {links.map((social) => {
      const Icon = social.icon;
      return (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-slate-700/20 border border-slate-700/50 hover:border-emerald-500/50"
          title={social.label}
          aria-label={`访问我们的${social.label}`}
        >
          <Icon className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
          {/* 微动画装饰 */}
          <span className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 border border-emerald-500/20 transition-transform duration-300 -z-10"></span>
        </a>
      );
    })}
  </div>
);

// 导航链接组件 - 优化交互和可访问性
const NavLinks = ({ links }: { links: NavLink[] }) => (
  <ul className="space-y-1">
    {links.map((link) => {
      const Icon = link.icon;
      return (
        <li key={link.label}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full text-slate-300 hover:text-white transition-all duration-200 group py-2 px-3 rounded-lg hover:bg-slate-800/50"
              aria-label={`${link.label}（外部链接）`}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <span>{link.label}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </a>
          ) : (
            <Link
              href={link.href}
              className="flex items-center justify-between w-full text-slate-300 hover:text-white transition-all duration-200 group py-2 px-3 rounded-lg hover:bg-slate-800/50"
              aria-label={link.label}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <span>{link.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
            </Link>
          )}
        </li>
      );
    })}
  </ul>
);

// 服务器信息组件 - 优化视觉层次
const ServerInfo = ({ info }: { info: ServerInfoItem[] }) => (
  <div className="space-y-2 text-slate-300 bg-slate-800/20 rounded-xl p-4 border border-slate-700/50">
    {info.map((item, index) => (
      <div key={index} className="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-slate-800/30 transition-colors">
        <span className="text-sm text-slate-400">{item.label}</span>
        <span className={`font-medium ${item.color} text-sm`}>{item.value}</span>
      </div>
    ))}
  </div>
);

// 品牌标识组件 - 优化视觉效果
const BrandLogo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center space-x-3 mb-6 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${isHovered ? 'bg-linear-to-rrom-emerald-500 to-teal-600 scale-105' : 'bg-linear-to-r from-green-500 to-emerald-600'
        }`}>
        <Server className="w-7 h-7 text-white transition-transform duration-500" />
      </div>
      <div>
        <h2 className="font-bold text-2xl bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-tight">
          EndlessPixel
        </h2>
        <div className="flex items-center space-x-1.5 mt-1">
          <span className="text-xs text-emerald-400 font-medium flex items-center">
            在线
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-1"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

// 版权信息组件 - 优化视觉和响应式
const Copyright = ({ startYear = 2024 }: { startYear?: number }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm pt-6 border-t border-slate-800/50 mt-6">
      <div className="flex items-center space-x-2">
        <span>&copy; {startYear}{currentYear > startYear ? `–${currentYear}` : ''} EndlessPixel Studio</span>
      </div>

      <div className="flex items-center space-x-2">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
        <span>by the community</span>
      </div>
    </div>
  );
};

// 主 Footer 组件 - 整体重构
export function Footer() {
  // 社交媒体链接数据
  const socialLinks: SocialLink[] = [
    { icon: Github, href: 'https://gitee.com/system_mini', label: 'Gitee' },
    { icon: Github, href: 'https://github.com/EndlessPixel', label: 'GitHub' },
    { icon: Code, href: 'https://codeberg.org/system_mini', label: 'Codeberg' },
    { icon: MessageCircle, href: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910', label: 'QQ群' },
    { icon: Gamepad2, href: 'https://discord.gg/k63hRWt3fF', label: 'Discord' },
    { icon: Video, href: 'https://space.bilibili.com/3546799478409405', label: 'Bilibili' },
    { icon: Smartphone, href: 'https://kuaishou.cn/profile/3xth2cp4jf5ha6c', label: '快手' },
    { icon: Twitch, href: 'https://www.twitch.tv/system_mini', label: 'Twitch' },
    { icon: Facebook, href: 'https://www.facebook.com/system_mini', label: 'Facebook' }
  ];

  // 导航链接数据
  const navLinks: NavLink[] = [
    { icon: Download, href: "/downloads", label: "资源下载" },
    { icon: Eye, href: "/status", label: "服务器状态" },
    { icon: BookOpen, href: "/wiki", label: "Wiki 百科" },
    { icon: Users, href: "/about", label: "关于我们" },
    { icon: Server, href: "https://stats.uptimerobot.com/uHTdCauXWA", label: "状态监控", external: true }
  ];

  // 服务器信息数据
  const serverInfo: ServerInfoItem[] = [
    { label: "版本", value: "1.21.11", color: "text-green-400" },
    { label: "QQ群", value: "870594910", color: "text-blue-400" },
    { label: "模式", value: "离线模式", color: "text-amber-400" },
    { label: "费用", value: "完全免费", color: "text-emerald-400" }
  ];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
              一个由热爱游戏的玩家组成的社区，致力于提供有趣、自由、开放的游戏世界。
              我们相信游戏的魅力在于创造与分享。
            </p>
            <SocialLinks links={socialLinks} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center space-x-2 text-slate-100">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>快速导航</span>
            </h3>
            <NavLinks links={navLinks} />
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-semibold text-lg mb-5 flex items-center space-x-2 text-slate-100">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>服务器信息</span>
            </h3>
            <ServerInfo info={serverInfo} />
          </div>
        </div>

        {/* Bottom Section */}
        <Copyright startYear={2024} />
      </div>
    </footer>
  );
}

// 默认导出，方便使用
export default Footer;