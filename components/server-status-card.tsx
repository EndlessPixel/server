"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GRADIENT_COLORS = [
  "from-blue-200 to-purple-200",
  "from-green-200 to-blue-200",
  "from-purple-200 to-green-200",
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const, // ✅ 字面量 "top"
    },
    title: { display: false },
  },
  elements: {
    line: { tension: 0 }, // 直线
    point: { radius: 0 }, // 不画点
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "rgba(128,128,128,0.1" } },
  },
} as const; // ✅ 整个对象也锁定，避免其他推导错误

interface ServerStatusCardProps {
  node: string;
}

export function ServerStatusCard({ node }: ServerStatusCardProps) {
  const [nodeData, setNodeData] = useState<any>(null);
  const [cpuChartData, setCpuChartData] = useState<any>({ labels: [], datasets: [] });
  const [trafficChartData, setTrafficChartData] = useState<any>({ labels: [], datasets: [] });
  const [gradientIndex, setGradientIndex] = useState(0);
  const [latestSample, setLatestSample] = useState<any>(null);

  const fetchNodeData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://cf-v2.uapis.cn/node_status_info?nodename=${encodeURIComponent(node)}`
      );
      if (!response.ok) throw new Error(`Failed to fetch node data: ${response.statusText}`);
      const data = await response.json();
      console.log("Fetched node data:", data); // Debug log for fetched data
      setNodeData(data);

      const raw = data.data?.status_list || [];
      const step = Math.max(1, Math.floor(raw.length / 50));
      const statusList = raw.filter((_: any, i: number) => i % step === 0).slice(-50);

      const timestamps = statusList.map((item: any) =>
        new Date(item.timestamp).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      const cpuUsages = statusList.map((item: any) => item.cpu_usage);
      setCpuChartData({
        labels: timestamps,
        datasets: [
          {
            label: "CPU Usage (%)",
            data: cpuUsages,
            backgroundColor: (ctx: any) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, `rgba(75, 192, 192, 0.2)`);
              g.addColorStop(1, `rgba(75, 192, 192, 0)`);
              return g;
            },
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      });

      // 柔性取字段：有些 API 可能使用 tx/rx、upload_bandwidth、recv_bandwidth、tx_bytes 等不同字段名
      const pickNumber = (obj: any, keys: string[]) => {
        for (const k of keys) {
          const v = obj?.[k];
          if (v !== undefined && v !== null && !Number.isNaN(Number(v))) return Number(v);
        }
        return 0;
      };

      const uploadBandwidth = statusList.map((item: any) =>
        // 常见字段优先级：upload_bandwidth, tx, tx_bytes, upload_bytes, total_traffic_out
        pickNumber(item, ["upload_bandwidth", "tx", "tx_bytes", "upload_bytes", "out_bytes", "total_traffic_out", "sent"])
      );
      const downloadBandwidth = statusList.map((item: any) =>
        // 常见字段优先级：download_bandwidth, recv_bandwidth, rx, rx_bytes, total_traffic_in, recv_packets
        pickNumber(item, ["download_bandwidth", "recv_bandwidth", "rx", "rx_bytes", "download_bytes", "total_traffic_in", "recv_packets", "received"])
      );
      // 保存最近一条原始样本，供 UI 展示更多实时字段
      setLatestSample(raw.length ? raw[raw.length - 1] : null);

      setTrafficChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Upload Bandwidth (MB/s)",
            data: uploadBandwidth,
            backgroundColor: (ctx: any) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, `rgba(255, 99, 132, 0.2)`);
              g.addColorStop(1, `rgba(255, 99, 132, 0)`);
              return g;
            },
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: true,
          },
          {
            label: "Download Bandwidth (MB/s)",
            data: downloadBandwidth,
            backgroundColor: (ctx: any) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, `rgba(54, 162, 235, 0.2)`);
              g.addColorStop(1, `rgba(54, 162, 235, 0)`);
              return g;
            },
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching node data:", error);
    }
  }, [node]);

  useEffect(() => {
    fetchNodeData();

    const interval = setInterval(fetchNodeData, 20000); // Auto-update every 20 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [fetchNodeData]);

  return (
    <div className={`p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 dark:border-slate-800`}>
      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Frp 节点状态监控 Beta2  -- {node}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button className="px-4 py-2 rounded-md bg-cyan-500 text-white"><a href="/status/">返回</a></button>
          <br/><br/>
          {nodeData && nodeData.data && nodeData.data.node_details ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">节点名称：</span>
                    <span className="ml-2">{node}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">CPU 信息：</span>
                    <span className="ml-2">{nodeData.data.node_details.cpu_info} ({nodeData.data.node_details.num_cores} 核心)</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">存储：</span>
                    <span className="ml-2">已用 {Math.round(nodeData.data.node_details.storage_used / 1e9)} GB / 总计 {Math.round(nodeData.data.node_details.storage_total / 1e9)} GB</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">系统负载：</span>
                    <span className="ml-2">1m: {nodeData.data.node_details.load1} • 5m: {nodeData.data.node_details.load5} • 15m: {nodeData.data.node_details.load15}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">今日流量：</span>
                    <span className="ml-2 font-mono">下载 {Math.round(nodeData.data.node_details.total_traffic_in / 1e6)} MB</span>
                    <span className="mx-2 text-slate-400">/</span>
                    <span className="ml-2 font-mono">上传 {Math.round(nodeData.data.node_details.total_traffic_out / 1e6)} MB</span>
                  </p>
                </div>
              </div>

              {latestSample ? (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    <strong>最新样本时间：</strong>
                    {new Date(latestSample.timestamp).toLocaleString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between"><span className="text-slate-600">当前连接</span><span className="font-mono">{latestSample.cur_conns ?? latestSample.active_conn ?? "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">活跃连接</span><span className="font-mono">{latestSample.active_conn ?? "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">被动连接</span><span className="font-mono">{latestSample.passive_conn ?? "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">客户端数</span><span className="font-mono">{latestSample.client_counts ?? "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">内存使用</span><span className="font-mono">{latestSample.memory_used !== undefined ? Math.round(latestSample.memory_used / 1e6) + " MB" : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">CPU 使用</span><span className="font-mono">{latestSample.cpu_usage !== undefined ? latestSample.cpu_usage + " %" : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">已发送报文</span><span className="font-mono">{latestSample.sent_packets !== undefined ? Intl.NumberFormat("zh-CN").format(latestSample.sent_packets) : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">已接收报文</span><span className="font-mono">{latestSample.recv_packets !== undefined ? Intl.NumberFormat("zh-CN").format(latestSample.recv_packets) : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">下载 使用率</span><span className="font-mono">{latestSample.download_bandwidth_usage_percent !== undefined ? latestSample.download_bandwidth_usage_percent + " %" : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">上传 使用率</span><span className="font-mono">{latestSample.upload_bandwidth_usage_percent !== undefined ? latestSample.upload_bandwidth_usage_percent + " %" : "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">代理 HTTP</span><span className="font-mono">{latestSample.proxy_http ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">代理 TCP</span><span className="font-mono">{latestSample.proxy_tcp ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">代理 UDP</span><span className="font-mono">{latestSample.proxy_udp ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">代理 HTTPS</span><span className="font-mono">{latestSample.proxy_https ?? 0}</span></div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-64 bg-transparent rounded-md p-2 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-2">CPU 使用趋势</div>
                  <div className="h-[calc(100%-1rem)]">
                    <Line data={cpuChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="h-64 bg-transparent rounded-md p-2 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-2">网络流量趋势</div>
                  <div className="h-[calc(100%-1rem)]">
                    <Line data={trafficChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">加载中...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}