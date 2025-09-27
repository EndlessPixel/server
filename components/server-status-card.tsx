"use client";

import { useState, useEffect } from "react";
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
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  elements: {
    line: {
      tension: 0.4, // Add curve to the lines
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
};

interface ServerStatusCardProps {
  node: string;
}

export function ServerStatusCard({ node }: ServerStatusCardProps) {
  const [nodeData, setNodeData] = useState<any>(null);
  const [cpuChartData, setCpuChartData] = useState<any>({ labels: [], datasets: [] });
  const [trafficChartData, setTrafficChartData] = useState<any>({ labels: [], datasets: [] });
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    async function fetchNodeData() {
      try {
        const response = await fetch(
          `http://cf-v2.uapis.cn/node_status_info?nodename=${encodeURIComponent(node)}`
        );
        if (!response.ok) throw new Error(`Failed to fetch node data: ${response.statusText}`);
        const data = await response.json();
        console.log("Fetched node data:", data); // Debug log for fetched data
        setNodeData(data);

        // Only keep the last 50 entries
        const statusList = data.data?.status_list?.slice(-50) || [];

        // Format timestamps
        const timestamps = statusList.map((item: any) =>
          new Date(item.timestamp).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );

        // Update CPU usage chart data
        const cpuUsages = statusList.map((item: any) => item.cpu_usage);
        setCpuChartData({
          labels: timestamps,
          datasets: [
            {
              label: "CPU Usage (%)",
              data: cpuUsages,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        });

        // Update traffic chart data
        const uploadBandwidth = statusList.map((item: any) => item.upload_bandwidth);
        const downloadBandwidth = statusList.map((item: any) => item.recv_packets);
        setTrafficChartData({
          labels: timestamps,
          datasets: [
            {
              label: "Upload Bandwidth (MB/s)",
              data: uploadBandwidth,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
            },
            {
              label: "Download Bandwidth (MB/s)",
              data: downloadBandwidth,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching node data:", error);
      }
    }

    fetchNodeData();

    const interval = setInterval(fetchNodeData, 20000); // Auto-update every 20 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [node]);

  return (
    <div
      className={`p-6 bg-gradient-to-br ${GRADIENT_COLORS[gradientIndex]} backdrop-blur-md rounded-2xl shadow-lg border border-dashed border-gray-300`}
    >
      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Frp 节点状态监控
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nodeData && nodeData.data && nodeData.data.node_details ? (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>节点名称：</strong>
                {node}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>CPU 信息：</strong>
                {nodeData.data.node_details.cpu_info} ({nodeData.data.node_details.num_cores} 核心)
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>存储：</strong>
                已用 {Math.round(nodeData.data.node_details.storage_used / 1e9)} GB / 总计 {Math.round(nodeData.data.node_details.storage_total / 1e9)} GB
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>系统负载：</strong>
                1分钟: {nodeData.data.node_details.load1}, 5分钟: {nodeData.data.node_details.load5}, 15分钟: {nodeData.data.node_details.load15}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>今日流量：</strong>
                下载 {Math.round(nodeData.data.node_details.total_traffic_in / 1e6)} MB / 上传 {Math.round(nodeData.data.node_details.total_traffic_out / 1e6)} MB
              </p>

              <div className="h-64">
                <Line data={cpuChartData} options={chartOptions} />
              </div>
              <div className="h-64">
                <Line data={trafficChartData} options={chartOptions} />
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
