"use client";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Server, Globe, Activity, ArrowRight, Users} from "lucide-react";
interface ServiceItem {
  name: string;
  path: string;
  icon: React.ElementType;
  status: "online" | "offline" | "maintenance";
  description: string;
  color: string;
  external?: boolean;
}
const SERVICES: ServiceItem[] = [
  {
    name: "Minecraft 服务器状态",
    path: "/status/mcserverstatus",
    icon: Server,
    status: "online",
    description: "游戏服务器实时状态",
    color: "from-foreground/90 to-foreground/70"
  },
  {
    name: "服务器性能监控",
    path: "http://sys.epmc.qzz.io",
    icon: Activity,
    status: "online",
    description: "服务器性能监控",
    color: "from-foreground/90 to-foreground/70",
    external: true
  }
];
const ServiceCard: React.FC<{ service: ServiceItem }> = React.memo(({ service }) => {
  const Icon = service.icon;
  return (
    <Card className="group bg-card border-foreground/8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-foreground/12">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-linear-to-r ${service.color} rounded-xl text-white`}>
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            className="bg-foreground text-background hover:bg-foreground/85 transition-all group-hover:scale-105"
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
      <div className="p-2 bg-secondary rounded-lg text-foreground/60">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});
export default function StatusIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              服务状态监控
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              实时监控 EndlessPixel 所有服务的运行状态、性能指标和在线状态
            </p>
          </div>
          <section className="mb-12" aria-labelledby="services-heading">
            <SectionHeader 
              title="核心服务" 
              description="关键服务状态概览"
              icon={<Server className="w-5 h-5 text-foreground/60" aria-hidden="true" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </div>
          </section>
          <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-foreground/8 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-foreground/60" aria-hidden="true" />
                  技术支持
                </h3>
                <div className="space-y-4 text-muted-foreground">
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
                        href="https://qm.qq.com/q/sFrax2Ilxe" 
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