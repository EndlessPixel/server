import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>状态：</strong> {status}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>IP：</strong> {ip}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>端口：</strong> {port}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>版本：</strong> {version}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>协议：</strong> {protocol}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>软件：</strong> {software}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>玩家：</strong> {players}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <strong>主机名：</strong> {hostname}
        </p>
        <Link href={path} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          查看详情
        </Link>
      </CardContent>
    </Card>
  );
}