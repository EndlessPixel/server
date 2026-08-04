"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Server,
  Heart,
  ExternalLink,
  Users,
  Download,
  BookOpen,
  Eye,
  ChevronRight,
  Activity,
  Images,
  Code,
} from "lucide-react";
import { RunningDuration } from "./running-duration";

type SocialLink = { icon: React.ElementType; href: string; label: string };
type NavLink = {
  icon: React.ElementType;
  href: string;
  label: string;
  external?: boolean;
};

const SocialLinks = ({ links }: { links: SocialLink[] }) => (
  <div className="flex flex-wrap gap-3">
    {links.map((social) => {
      const Icon = social.icon;
      return (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
          title={social.label}
        >
          <Icon className="w-5 h-5 text-white/60 hover:text-white" />
        </a>
      );
    })}
  </div>
);

const NavLinks = ({ links }: { links: NavLink[] }) => (
  <ul className="space-y-0.5">
    {links.map((link) => {
      const Icon = link.icon;
      return (
        <li key={link.label}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-white/30" />
                <span>{link.label}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-white/20" />
            </a>
          ) : (
            <Link
              href={link.href}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors duration-200 group"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-white/30" />
                <span>{link.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          )}
        </li>
      );
    })}
  </ul>
);

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Image
        src="/favicon.ico"
        alt="EndlessPixel"
        width={48}
        height={48}
        className="rounded-xl"
      />
      <h2 className="font-bold text-3xl text-white tracking-tight">
        EndlessPixel
      </h2>
    </div>
  );
};

const Copyright = ({ startYear = 2024 }: { startYear?: number }) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-sm pt-6 mt-6 border-t border-white/[0.06]">
      <span>
        &copy; {startYear}
        {currentYear > startYear ? `–${currentYear}` : ""} EndlessPixel Studio
        <span className="text-[0px] text-white/30">
          本工作室与杭州无尽像素科技有限公司（成立时间：2025-08-26，统一社会信用代码：91330106MAEUDLLYXY）无任何隶属、投资或合作关系，请勿将本工作室与该公司混淆，仅因意外重名导致。
        </span>
      </span>
      <div className="flex items-center gap-2">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-white/30" />
        <span>by community</span>
      </div>
    </div>
  );
};

export function Footer() {
  const socialLinks: SocialLink[] = [
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/github/white"
          width="18"
          height="18"
          alt="GitHub"
        />
      ),
      href: "https://github.com/EndlessPixel",
      label: "GitHub",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/qq/white"
          width="18"
          height="18"
          alt="QQ群"
        />
      ),
      href: "https://qm.qq.com/q/sFrax2Ilxe",
      label: "QQ群",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/discord/white"
          width="18"
          height="18"
          alt="Discord"
        />
      ),
      href: "https://discord.gg/k63hRWt3fF",
      label: "Discord",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/bilibili/white"
          width="18"
          height="18"
          alt="Bilibili"
        />
      ),
      href: "https://space.bilibili.com/3546799478409405",
      label: "Bilibili",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/kuaishou/white"
          width="18"
          height="18"
          alt="快手"
        />
      ),
      href: "https://kuaishou.cn/profile/3xth2cp4jf5ha6c",
      label: "快手",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/twitch/white"
          width="18"
          height="18"
          alt="Twitch"
        />
      ),
      href: "https://www.twitch.tv/system_mini",
      label: "Twitch",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/x/white"
          width="18"
          height="18"
          alt="X"
        />
      ),
      href: "https://x.com/system_mini",
      label: "X",
    },
    {
      icon: () => (
        <img
          src="https://cdn.simpleicons.org/youtube/white"
          width="18"
          height="18"
          alt="YouTube"
        />
      ),
      href: "https://www.youtube.com/channel/UCMhwQrCnysEi0z0PTB655Eg",
      label: "YouTube",
    },
  ];

  const navLinks: NavLink[] = [
    { icon: Activity, href: "/live", label: "服务器实况" },
    { icon: Images, href: "/gallery", label: "玩家图册" },
    { icon: Download, href: "/downloads", label: "资源下载" },
    { icon: Eye, href: "/status", label: "服务器状态" },
    { icon: Users, href: "/about", label: "关于我们" },
    {
      icon: Code,
      href: "https://github.com/EndlessPixel/server",
      label: "官网代码仓库",
      external: true,
    },
    {
      icon: BookOpen,
      href: "https://wiki.endlesspixel.cn",
      label: "Wiki 百科",
      external: true,
    },
    {
      icon: Server,
      href: "http://sys.epmc.qzz.io",
      label: "状态监控",
      external: true,
    },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 左侧品牌区 */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-white/40 text-sm leading-relaxed max-w-md">
              EndlessPixel 是一群喜欢 Minecraft
              的玩家凑在一起搭的服务器，不收费，想玩随时来。
            </p>
            <SocialLinks links={socialLinks} />
            <p className="text-sm text-white/30">服务器创立至今：</p>
            <RunningDuration />
          </div>

          {/* 右侧：2列导航 */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-base mb-4 text-white/60 tracking-tight">
                快速导航
              </h3>
              <NavLinks links={navLinks.slice(0, 4)} />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 text-white/60 tracking-tight">
                &nbsp;
              </h3>
              <NavLinks links={navLinks.slice(4)} />
            </div>
          </div>
        </div>

        <Copyright startYear={2024} />
      </div>
    </footer>
  );
}

export default Footer;
