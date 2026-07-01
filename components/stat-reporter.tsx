"use client";

import { useEffect } from "react";

const STATISTICS_API = "/api/stats/proxy";

export function StatReporter() {
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
            url: window.location.href,
            path: window.location.pathname,
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
  }, []);

  return null;
}