"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STATISTICS_API = "/api/stats/proxy";

export function StatReporter() {
  const pathname = usePathname();

  useEffect(() => {
    const reportStatistics = async () => {
      try {
        const clientTime = Math.floor(Date.now() / 1000);
        
        await fetch(STATISTICS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: new URL(window.location.href).origin,
            path: window.location.pathname + window.location.search,
            client_time: clientTime,
            server_time: clientTime,
          }),
          keepalive: true,
        });
      } catch {
        // 上报失败不影响主业务
      }
    };

    reportStatistics();
  }, [pathname]);

  return null;
}