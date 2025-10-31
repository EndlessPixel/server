import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Globe, Cpu, Users, Package, Monitor, Wifi, WifiOff, ArrowRight, Clock, Shield } from "lucide-react";

interface NodeCardProps {
  name: string;
  path: string;
  status: string;
  ip: string;
  port: string;
  version: string;
  protocol: string;
  software: string;
  players: string;
  hostname: string;
}

export function NodeCard({
  name,
  path,
  status,
  ip,
  port,
  version,
  protocol,
  software,
  players,
  hostname,
}: NodeCardProps) {
  const isOnline = status.toLowerCase().includes("在线");
  
  return (
    <Card className="group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isOnline 
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </CardTitle>
          </div>
          <Badge 
            variant={isOnline ? "default" : "destructive"} 
            className={
              isOnline 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 服务器连接信息 */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">连接地址</span>
            </div>
            <Badge variant="outline" className="text-xs bg-white dark:bg-slate-700">
              {port}
            </Badge>
          </div>
          <code className="text-sm font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
            {ip}
          </code>
        </div>

        {/* 基本信息网格 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">版本</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {version}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
              <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">协议</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {protocol}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
              <Server className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">核心</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {software}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded">
              <Users className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">玩家</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {players}
              </div>
            </div>
          </div>
        </div>

        {/* 主机名信息 */}
        {hostname && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
            <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">主机名</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {hostname}
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            <span>实时监控</span>
          </div>
          <Button 
            asChild 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white group"
          >
            <Link href={path} className="flex items-center gap-2">
              查看详情
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}