"use client";

import React, { useState } from "react";
import type { JSX } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Lock, UserCheck, Shield, ArrowRight, Sparkles } from "lucide-react";

const AUTHORIZE_URL =
  "https://github.com/login/oauth/authorize?client_id=Ov23lirB3OziFtPWOy9X&redirect_uri=https://ep.endlesspixel.fun/users/login/success&scope=read:user user:email&state=RANDOM_STRING";

export default function LoginPage(): JSX.Element {
  const [loading, setLoading] = useState(false);

  function handleLogin(): void {
    setLoading(true);
    window.location.href = AUTHORIZE_URL;
  }

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "安全认证",
      description: "通过 GitHub OAuth 安全协议进行身份验证"
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "隐私保护",
      description: "仅获取必要的公开信息和邮箱权限"
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "快速登录",
      description: "无需注册新账号，使用现有 GitHub 账户"
    }
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-lg mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                欢迎回来
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                使用 GitHub 账号登录 EndlessPixel 社区
              </p>
            </div>

            {/* Login Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 pb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      GitHub 登录
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      安全快捷的身份验证方式
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Permissions */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
                    请求的权限范围
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0 px-3 py-1">
                      read:user
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0 px-3 py-1">
                      user:email
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                    我们仅请求基础公开资料和邮箱权限，用于创建您的账户。
                  </p>
                </div>

                {/* Login Button */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg py-3 text-base font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>正在跳转到 GitHub...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Github className="w-5 h-5" />
                        <span>使用 GitHub 登录</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  {/* Fallback Link */}
                  <div className="text-center">
                    <a
                      href={AUTHORIZE_URL}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = AUTHORIZE_URL;
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      如果按钮无响应，点击此处直接跳转
                    </a>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                      <span className="text-green-600 dark:text-green-300 text-lg">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
                        登录说明
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-xs">
                        登录成功后，您将自动跳转回 EndlessPixel 社区，可以立即开始使用所有功能。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>您的信息安全受到保护，我们不会存储您的 GitHub 密码</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}