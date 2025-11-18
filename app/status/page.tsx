import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Server, Globe, Wifi, Activity, Monitor, MapPin, ArrowRight, Users, Cpu, BarChart3 } from "lucide-react";

const NODES = [
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

const SERVICES = [
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
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">核心服务</h2>
                <p className="text-slate-600 dark:text-slate-400">关键服务状态概览</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.name} className="group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 bg-linear-to-r ${service.color} rounded-xl text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{service.name}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{service.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          {service.external && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
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
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Network Nodes */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Wifi className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">网络节点</h2>
                <p className="text-slate-600 dark:text-slate-400">全球分布式网络节点状态</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {NODES.map((node) => (
                <Card key={node.name} className="group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{node.name}</h3>
                          <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs">
                            {node.region}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {node.description}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <Button 
                        asChild 
                        size="sm" 
                        variant="outline"
                        className="transition-all group-hover:scale-105"
                      >
                        <Link href={node.path} className="flex items-center gap-2">
                          节点详情
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  监控说明
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                    <span>所有服务状态每 30 秒自动更新一次</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    <span>节点状态包含 CPU、内存、网络流量等详细信息</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                    <span>遇到问题可查看详细监控或联系技术支持</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  技术支持
                </h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p>如果您发现服务异常或需要技术支持：</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href="https://github.com/EndlessPixel/server/issues" target="_blank" rel="noopener noreferrer">
                        提交 Issue
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910" target="_blank" rel="noopener noreferrer">
                        加入 QQ 群
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}