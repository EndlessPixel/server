import React from "react";
import { NodeCard } from "@/components/node-card";

const NODES = [
  {
    name: "四川成都多线",
    path: "/status/frpnode/cd3",
    status: "在线",
    ip: "192.168.1.1",
    port: "8080",
    version: "v2.0",
    protocol: "HTTP/1.1",
    software: "Nginx",
    players: "N/A",
    hostname: "localhost",
  },
  {
    name: "四川成都电信",
    path: "/status/frpnode/cd1",
    status: "在线",
    ip: "192.168.1.3",
    port: "8082",
    version: "v2.2",
    protocol: "HTTP/1.1",
    software: "Nginx",
    players: "N/A",
    hostname: "localhost",
  },
  {
    name: "四川成都联通",
    path: "/status/frpnode/cd2",
    status: "在线",
    ip: "192.168.1.4",
    port: "8083",
    version: "v2.3",
    protocol: "HTTP/1.1",
    software: "Nginx",
    players: "N/A",
    hostname: "localhost",
  },
  {
    name: "Minecraft 服务器",
    path: "/status/mcserverstatus",
    status: "未知",
    ip: "-",
    port: "-",
    version: "-",
    protocol: "-",
    software: "-",
    players: "0 / 0",
    hostname: "-",
  },
];

export default function StatusIndexPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        节点状态导航
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {NODES.map((node) => (
          <NodeCard key={node.name} {...node} />
        ))}
      </div>
    </div>
  );
}