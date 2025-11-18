"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowLeft, Cpu, Network, HardDrive, Activity, Clock, Database } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 11
        }
      }
    },
    title: { display: false },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    point: {
      radius: 2,
      hoverRadius: 5
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        maxTicksLimit: 8,
        font: {
          size: 10
        }
      }
    },
    y: {
      grid: {
        color: "rgba(128,128,128,0.1)",
        drawBorder: false
      },
      ticks: {
        font: {
          size: 10
        }
      }
    },
  },
} as const;

interface ServerStatusCardProps {
  node: string;
}

export function ServerStatusCard({ node }: ServerStatusCardProps) {
  const [nodeData, setNodeData] = useState<any>(null);
  const [cpuChartData, setCpuChartData] = useState<any>({ labels: [], datasets: [] });
  const [trafficChartData, setTrafficChartData] = useState<any>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestSample, setLatestSample] = useState<any>(null);

  const fetchNodeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://cf-v2.uapis.cn/node_status_info?nodename=${encodeURIComponent(node)}`
      );

      if (!response.ok) throw new Error(`请求失败: ${response.statusText}`);

      const data = await response.json();
      setNodeData(data);

      const raw = data.data?.status_list || [];
      const step = Math.max(1, Math.floor(raw.length / 50));
      const statusList = raw.filter((_: any, i: number) => i % step === 0).slice(-50);

      const timestamps = statusList.map((item: any) =>
        new Date(item.timestamp).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // CPU 图表数据
      const cpuUsages = statusList.map((item: any) => item.cpu_usage);
      setCpuChartData({
        labels: timestamps,
        datasets: [
          {
            label: "CPU 使用率",
            data: cpuUsages,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      });

      // 网络流量数据
      const pickNumber = (obj: any, keys: string[]) => {
        for (const k of keys) {
          const v = obj?.[k];
          if (v !== undefined && v !== null && !Number.isNaN(Number(v))) return Number(v) / 1e6; // 转换为 MB
        }
        return 0;
      };

      const uploadBandwidth = statusList.map((item: any) =>
        pickNumber(item, ["upload_bandwidth", "tx", "tx_bytes", "upload_bytes", "out_bytes", "total_traffic_out", "sent"])
      );
      const downloadBandwidth = statusList.map((item: any) =>
        pickNumber(item, ["download_bandwidth", "recv_bandwidth", "rx", "rx_bytes", "download_bytes", "total_traffic_in", "recv_packets", "received"])
      );

      setLatestSample(raw.length ? raw[raw.length - 1] : null);

      setTrafficChartData({
        labels: timestamps,
        datasets: [
          {
            label: "上传带宽",
            data: uploadBandwidth,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: "下载带宽",
            data: downloadBandwidth,
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      });

    } catch (err) {
      console.error("获取节点数据失败:", err);
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }, [node]);

  useEffect(() => {
    fetchNodeData();
    const interval = setInterval(fetchNodeData, 20000);
    return () => clearInterval(interval);
  }, [fetchNodeData]);

  if (loading && !nodeData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">加载节点数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">加载失败</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={fetchNodeData} variant="outline">
            重试
          </Button>
        </div>
      </div>
    );
  }

  const nodeDetails = nodeData?.data?.node_details;

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <Card className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/status/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回状态页</span>
                </a>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {node} 节点监控
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  实时监控节点性能和网络状态
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Beta 2
            </Badge>
          </div>

          {/* 节点概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">CPU 信息</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {nodeDetails?.cpu_info} ({nodeDetails?.num_cores} 核心)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <HardDrive className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">存储使用</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {Math.round(nodeDetails?.storage_used / 1e9)} / {Math.round(nodeDetails?.storage_total / 1e9)} GB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">今日流量</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ↓{Math.round(nodeDetails?.total_traffic_in / 1e6)} MB / ↑{Math.round(nodeDetails?.total_traffic_out / 1e6)} MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 系统负载 */}
          <div className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-slate-900 dark:text-white">系统负载</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{nodeDetails?.load1}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">1分钟</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{nodeDetails?.load5}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">5分钟</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{nodeDetails?.load15}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">15分钟</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU 使用率图表 */}
        <Card className="border-0 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>CPU 使用率趋势</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={cpuChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* 网络流量图表 */}
        <Card className="border-0 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Network className="w-4 h-4 text-green-500" />
              <span>网络带宽趋势 (MB/s)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={trafficChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 实时状态 */}
      {latestSample && (
        <Card className="border-0 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>实时状态</span>
              <span className="text-xs font-normal text-slate-500 ml-auto">
                更新时间: {new Date(latestSample.timestamp).toLocaleTimeString("zh-CN")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {latestSample.cur_conns ?? latestSample.active_conn ?? "0"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">当前连接</div>
              </div>

              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {latestSample.cpu_usage ?? "0"}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">CPU 使用</div>
              </div>

              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {latestSample.memory_used ? Math.round(latestSample.memory_used / 1e6) : "0"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">内存 (MB)</div>
              </div>

              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {latestSample.client_counts ?? "0"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">客户端数</div>
              </div>

              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {(latestSample.proxy_tcp ?? 0) + (latestSample.proxy_udp ?? 0)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">TCP/UDP 代理</div>
              </div>

              <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {(latestSample.proxy_http ?? 0) + (latestSample.proxy_https ?? 0)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">HTTP(S) 代理</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}