"use client";

import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  Server, Globe, Activity, Monitor, MapPin, ArrowRight, 
  Users, CheckCircle2, AlertCircle, Info
} from "lucide-react";

/* ---------------- 类型定义 ---------------- */
interface ServiceItem {
  name: string;
  path: string;
  icon: React.ElementType;
  status: "online" | "offline" | "maintenance";
  description: string;
  color: string;
  external?: boolean;
}

interface NodeItem {
  name: string;
  path: string;
  region: string;
  status: "online" | "offline" | "maintenance";
  description: string;
}

/* ---------------- 常量数据 ---------------- */
const NODES: NodeItem[] = [
  { 
    name: "四川成都电信", 
    path: "/status/frpnode/cd1",
    region: "西南", 
    status: "online",
    description: "成都电信节点，低延迟优化"
  },
  { 
    name: "上海多线", 
    path: "/status/frpnode/sh",
    region: "华东",
    status: "online",
    description: "上海多线BGP，全国覆盖"
  },
];

const SERVICES: ServiceItem[] = [
  {
    name: "Minecraft 服务器",
    path: "/status/mcserverstatus",
    icon: Server,
    status: "online",
    description: "游戏服务器实时状态",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "服务状态监控",
    path: "https://stats.uptimerobot.com/uHTdCauXWA",
    icon: Activity,
    status: "online",
    description: "全方位服务监控",
    color: "from-blue-500 to-cyan-600",
    external: true
  }
];

/* ---------------- 组件 ---------------- */
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  let icon, color, text;
  
  switch (status) {
    case "online":
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      text = "在线";
      break;
    case "offline":
      icon = <AlertCircle className="w-3.5 h-3.5" />;
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      text = "离线";
      break;
    case "maintenance":
      icon = <Info className="w-3.5 h-3.5" />;
      color = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      text = "维护中";
      break;
    default:
      icon = <Info className="w-3.5 h-3.5" />;
      color = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      text = "未知";
  }
  
  return (
    <Badge className={`${color} flex items-center gap-1`}>
      {icon}
      {text}
    </Badge>
  );
});

const ServiceCard: React.FC<{ service: ServiceItem }> = React.memo(({ service }) => {
  const Icon = service.icon;
  
  return (
    <Card className="group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-linear-to-r ${service.color} rounded-xl text-white`}>
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{service.name}</h3>
                <StatusBadge status={service.status} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{service.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {service.external && (
              <span className="flex items-center gap-1" aria-label="外部服务">
                <Globe className="w-4 h-4" aria-hidden="true" />
                外部服务
              </span>
            )}
          </div>
          <Button 
            asChild 
            size="sm" 
            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all group-hover:scale-105"
          >
            <Link 
              href={service.path}
              target={service.external ? "_blank" : undefined}
              rel={service.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2"
            >
              查看详情
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

const SectionHeader: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}> = React.memo(({ title, description, icon }) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
});

/* ---------------- 主页面组件 ---------------- */
export default function StatusIndexPage() {
  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/20">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-700 to-purple-600 dark:from-slate-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              服务状态监控
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              实时监控 EndlessPixel 所有服务的运行状态、性能指标和在线状态
            </p>
          </div>

          {/* Service Overview Cards */}
          <section className="mb-12" aria-labelledby="services-heading">
            <SectionHeader 
              title="核心服务" 
              description="关键服务状态概览"
              icon={<Server className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </div>
          </section>

          {/* Additional Information */}
          <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

            <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" aria-hidden="true" />
                  技术支持
                </h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p>如果您发现服务异常或需要技术支持：</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link 
                        href="https://github.com/EndlessPixel/server/issues" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="提交问题到GitHub"
                      >
                        提交 Issue
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link 
                        href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="加入QQ群获取支持"
                      >
                        加入 QQ 群
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}