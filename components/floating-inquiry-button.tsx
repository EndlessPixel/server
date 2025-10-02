"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Plus, User, ArrowLeft } from "lucide-react";

// 定义消息类型
interface Message {
  sender: "User" | "EPMCBot" | "HumanSupport";
  text: string;
  time: string;
  id: string;
}

// 定义对话节点结构 - 支持无限层级嵌套
interface ConversationNode {
  id: string;
  text: string;
  options: {
    label: string;
    target: string; // 目标节点ID
  }[];
  response?: string; // 如果是叶子节点，直接回复内容
  parent?: string; // 父节点ID，用于返回
}

// 对话节点数据库 - 可以无限扩展层级
const conversationNodes: Record<string, ConversationNode> = {
  // 根节点
  "root": {
    id: "root",
    text: navigator.language.startsWith("zh") 
      ? "请问您需要哪方面的帮助？" 
      : "What kind of help do you need?",
    options: [
      { 
        label: navigator.language.startsWith("zh") ? "服务器连接问题" : "Server connection issues", 
        target: "server_connection" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "白名单申请" : "Whitelist application", 
        target: "whitelist_application" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "模组支持" : "Mod support", 
        target: "mod_support" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "服务器状态" : "Server status", 
        target: "server_status" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "转人工支持" : "Transfer to human support", 
        target: "transfer_human" 
      }
    ]
  },

  // 服务器连接问题 (第一层)
  "server_connection": {
    id: "server_connection",
    text: navigator.language.startsWith("zh") 
      ? "服务器连接问题有多种可能，请问您遇到的是哪种情况？" 
      : "There are several possible server connection issues. Which one are you experiencing?",
    options: [
      { 
        label: navigator.language.startsWith("zh") ? "无法连接到服务器" : "Cannot connect to server", 
        target: "connection_failed" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "连接后经常断开" : "Frequent disconnections", 
        target: "connection_drop" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "显示版本不匹配" : "Version mismatch", 
        target: "version_mismatch" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "返回上一级" : "Back to previous level", 
        target: "root" 
      }
    ],
    parent: "root"
  },

  // 其他节点保持结构不变，仅添加多语言支持
  "connection_failed": {
    id: "connection_failed",
    text: navigator.language.startsWith("zh") 
      ? "无法连接到服务器可能有以下原因，请问您的情况是？" 
      : "There may be several reasons for failing to connect to the server. What's your situation?",
    options: [
      { 
        label: navigator.language.startsWith("zh") ? "显示'无法找到服务器'" : "Shows 'server not found'", 
        target: "server_not_found" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "连接超时" : "Connection timeout", 
        target: "connection_timeout" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "显示'被服务器拒绝'" : "Shows 'rejected by server'", 
        target: "server_rejected" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "返回上一级" : "Back to previous level", 
        target: "server_connection" 
      }
    ],
    parent: "server_connection"
  },

  // 精简显示其他节点，实际使用时保持完整结构
  "server_not_found": {
    id: "server_not_found",
    text: navigator.language.startsWith("zh") 
      ? "请检查您输入的服务器地址和端口是否正确。官方地址是 play.epmc.example.com:25565" 
      : "Please check if the server address and port you entered are correct. The official address is play.epmc.example.com:25565",
    options: [
      { 
        label: navigator.language.startsWith("zh") ? "地址正确但仍无法连接" : "Address is correct but still cannot connect", 
        target: "correct_address_issue" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "我输错了地址" : "I entered the wrong address", 
        target: "wrong_address" 
      },
      { 
        label: navigator.language.startsWith("zh") ? "返回上一级" : "Back to previous level", 
        target: "connection_failed" 
      }
    ],
    parent: "connection_failed"
  },

  // 其他必要节点...
  "correct_address_issue": {
    id: "correct_address_issue",
    text: navigator.language.startsWith("zh") 
      ? "请尝试以下步骤：1. 检查防火墙设置 2. 重启路由器 3. 暂时关闭VPN" 
      : "Please try the following steps: 1. Check firewall settings 2. Restart router 3. Temporarily disable VPN",
    options: [
      { label: navigator.language.startsWith("zh") ? "已尝试，仍无法解决" : "Tried but still not working", target: "tried_still_issue" },
      { label: navigator.language.startsWith("zh") ? "问题已解决" : "Issue resolved", target: "issue_resolved" },
      { label: navigator.language.startsWith("zh") ? "返回上一级" : "Back to previous level", target: "server_not_found" }
    ],
    parent: "server_not_found"
  },
  
  "transfer_human": {
    id: "transfer_human",
    text: navigator.language.startsWith("zh") 
      ? "需要为您转接人工支持吗？" 
      : "Would you like to be transferred to human support?",
    options: [
      { label: navigator.language.startsWith("zh") ? "是的，请转接" : "Yes, please transfer", target: "confirm_transfer" },
      { label: navigator.language.startsWith("zh") ? "暂时不需要" : "Not at the moment", target: "root" }
    ],
    parent: "root"
  },
  
  "confirm_transfer": { 
    id: "confirm_transfer", 
    text: navigator.language.startsWith("zh") 
      ? "正在转接人工支持，请稍候..." 
      : "Transferring to human support, please wait...", 
    options: [], 
    parent: "transfer_human" 
  }
  
  // 其他节点保持完整...
};

// 本地存储工具函数
const LocalStorageService = {
  getChatGroups: (): Record<string, Message[]> => {
    try {
      const stored = localStorage.getItem("chatGroups");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("加载聊天记录失败:", error);
      return {};
    }
  },

  saveChatGroups: (groups: Record<string, Message[]>) => {
    try {
      localStorage.setItem("chatGroups", JSON.stringify(groups));
    } catch (error) {
      console.error("保存聊天记录失败:", error);
    }
  },
};

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 8);

export function FloatingInquiryButton() {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false);
  const [chatGroups, setChatGroups] = useState<Record<string, Message[]>>({});
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [currentNodeId, setCurrentNodeId] = useState("root"); // 当前对话节点ID
  const [userEmail, setUserEmail] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  
  // 自动滚动到最新消息
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 初始化加载聊天记录
  useEffect(() => {
    const groups = LocalStorageService.getChatGroups();
    setChatGroups(groups);
    
    if (Object.keys(groups).length > 0) {
      setActiveGroup(Object.keys(groups)[0]);
    }
  }, []);

  // 自动滚动
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeGroup, chatGroups]);

  // 发送初始消息 - 使用多语言欢迎消息
  useEffect(() => {
    if (activeGroup && (!chatGroups[activeGroup] || chatGroups[activeGroup].length === 0)) {
      // 根据浏览器语言设置欢迎消息
      const welcomeMessage: Message = {
        sender: "EPMCBot",
        text: navigator.language.startsWith("zh")
          ? "您好，我是EPMCBot，有什么问题可以直接问我，但我不是万能的，如有复杂问题，建议去群里咨询人工客服，请问有什么可以帮助你的吗"
          : "Hello, I am EPMCbot. If you have any questions, you can ask me directly, but I am not omnipotent. If you have complex questions, I suggest going to the group to consult the manual customer service. Can I help you?",
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };

      setChatGroups(prevGroups => {
        const updatedGroups = { ...prevGroups, [activeGroup]: [welcomeMessage] };
        LocalStorageService.saveChatGroups(updatedGroups);
        return updatedGroups;
      });
    }
  }, [activeGroup, chatGroups]);

  // 获取当前对话节点
  const currentNode = conversationNodes[currentNodeId];

  // 发送消息处理
  const handleSendMessage = (message: Message) => {
    if (!activeGroup) return;

    setChatGroups(prevGroups => {
      const currentMessages = prevGroups[activeGroup] || [];
      const updatedMessages = [...currentMessages, message];
      const updatedGroups = { ...prevGroups, [activeGroup]: updatedMessages };
      LocalStorageService.saveChatGroups(updatedGroups);
      return updatedGroups;
    });
  };

  // 处理节点跳转
  const navigateToNode = (nodeId: string, userMessageText?: string) => {
    if (!activeGroup) return;

    // 如果有用户消息，先发送用户消息
    if (userMessageText) {
      const userMessage: Message = {
        sender: "User",
        text: userMessageText,
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };
      handleSendMessage(userMessage);
    }

    // 延迟发送机器人回复，模拟思考过程
    setTimeout(() => {
      const targetNode = conversationNodes[nodeId];
      
      // 特殊节点处理
      if (nodeId === "confirm_transfer") {
        handleTransferToHuman();
        return;
      }
      
      if (nodeId === "end_chat") {
        handleEndChat();
        return;
      }

      // 发送机器人回复
      const botMessage: Message = {
        sender: "EPMCBot",
        text: targetNode.text,
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };
      
      handleSendMessage(botMessage);
      setCurrentNodeId(nodeId);
    }, userMessageText ? 800 : 0);
  };

  // 转接到人工支持
  const handleTransferToHuman = () => {
    if (!activeGroup) return;
    
    setIsTransferring(true);
    
    setTimeout(() => {
      const noticeMessage: Message = {
        sender: "EPMCBot",
        text: navigator.language.startsWith("zh")
          ? `📧 您将通过 ${userEmail || "您的预留邮箱"} 接收支持通知`
          : `📧 You will receive support notifications via ${userEmail || "your reserved email"}`,
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };
      handleSendMessage(noticeMessage);
      
      setTimeout(() => {
        const humanMessage: Message = {
          sender: "HumanSupport",
          text: navigator.language.startsWith("zh")
            ? "您好！我是人工支持，请问有什么可以帮助您的？"
            : "Hello! I'm human support, how can I help you?",
          time: new Date().toLocaleTimeString(),
          id: generateId()
        };
        handleSendMessage(humanMessage);
      }, 1000);
    }, 1000);
  };

  // 其他方法保持不变...
  const handleEndChat = () => {
    if (!activeGroup) return;
    
    setCurrentNodeId("root");
    setTimeout(() => {
      const newChatMessage: Message = {
        sender: "EPMCBot",
        text: navigator.language.startsWith("zh")
          ? "如果有新的问题，欢迎随时开始新的对话！"
          : "If you have new questions, feel free to start a new conversation anytime!",
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };
      handleSendMessage(newChatMessage);
    }, 500);
  };

  const goToParentNode = () => {
    if (currentNode.parent) {
      navigateToNode(currentNode.parent);
    }
  };

  const handleCreateGroup = () => {
    const groupNamePrompt = navigator.language.startsWith("zh") ? "请输入对话名称：" : "Please enter conversation name:";
    const groupName = prompt(groupNamePrompt);
    if (!groupName || !groupName.trim() || chatGroups[groupName]) return;
    
    const emailPrompt = navigator.language.startsWith("zh") ? "请输入您的邮箱（用于接收回复通知）：" : "Please enter your email (for reply notifications):";
    const email = prompt(emailPrompt);
    setUserEmail(email || "");

    // 初始消息使用多语言欢迎消息
    const welcomeMessage: Message = {
      sender: "EPMCBot",
      text: navigator.language.startsWith("zh")
        ? "您好，我是EPMCBot，有什么问题可以直接问我，但我不是万能的，如有复杂问题，建议去群里咨询人工客服，请问有什么可以帮助你的吗"
        : "Hello, I am EPMCbot. If you have any questions, you can ask me directly, but I am not omnipotent. If you have complex questions, I suggest going to the group to consult the manual customer service. Can I help you?",
      time: new Date().toLocaleTimeString(),
      id: generateId()
    };

    setChatGroups(prev => {
      const updated = { ...prev, [groupName]: [welcomeMessage] };
      LocalStorageService.saveChatGroups(updated);
      return updated;
    });
    setActiveGroup(groupName);
    setCurrentNodeId("root");
    setIsTransferring(false);
  };

  const handleDeleteGroup = () => {
    if (!activeGroup) return;
    
    const confirmMessage = navigator.language.startsWith("zh") 
      ? `确定要删除对话"${activeGroup}"吗？` 
      : `Are you sure you want to delete the conversation "${activeGroup}"?`;
      
    if (confirm(confirmMessage)) {
      setChatGroups(prev => {
        const { [activeGroup]: _, ...remaining } = prev;
        LocalStorageService.saveChatGroups(remaining);
        return remaining;
      });
      setActiveGroup(prev => {
        const groups = Object.keys(chatGroups);
        const index = groups.indexOf(prev as string);
        return groups[index > 0 ? index - 1 : 0] || null;
      });
      setCurrentNodeId("root");
      setIsTransferring(false);
    }
  };

  const handleInputSend = () => {
    if (!activeGroup || isTransferring) return;
    
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    // 发送用户消息
    const userMessage: Message = {
      sender: "User",
      text: trimmedInput,
      time: new Date().toLocaleTimeString(),
      id: generateId()
    };
    handleSendMessage(userMessage);
    setUserInput("");
    
    // 机器人回复
    setTimeout(() => {
      // 简单的自然语言处理，尝试匹配相关节点
      const lowerInput = trimmedInput.toLowerCase();
      let matchedNodeId = "root";
      
      if (lowerInput.includes("连接") || lowerInput.includes("无法进入") || 
          lowerInput.includes("connect") || lowerInput.includes("cannot enter")) {
        matchedNodeId = "server_connection";
      } else if (lowerInput.includes("白名单") || lowerInput.includes("申请") ||
                 lowerInput.includes("whitelist") || lowerInput.includes("apply")) {
        matchedNodeId = "whitelist_application";
      } else if (lowerInput.includes("模组") || lowerInput.includes("mod")) {
        matchedNodeId = "mod_support";
      } else if (lowerInput.includes("状态") || lowerInput.includes("在线") ||
                 lowerInput.includes("status") || lowerInput.includes("online")) {
        matchedNodeId = "server_status";
      } else if (lowerInput.includes("人工") || lowerInput.includes("客服") ||
                 lowerInput.includes("human") || lowerInput.includes("service")) {
        matchedNodeId = "transfer_human";
      }

      // 发送匹配的节点回复
      const botMessage: Message = {
        sender: "EPMCBot",
        text: conversationNodes[matchedNodeId].text,
        time: new Date().toLocaleTimeString(),
        id: generateId()
      };
      handleSendMessage(botMessage);
      setCurrentNodeId(matchedNodeId);
    }, 1000);
  };

  return (
    <>
      {/* 浮动按钮 */}
      <Button
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
        aria-label={navigator.language.startsWith("zh") ? "打开咨询窗口" : "Open inquiry window"}
      >
        <MessageSquare className="w-6 h-6 mx-auto" />
      </Button>

      {/* 咨询对话框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {navigator.language.startsWith("zh") ? "EPMC服务器支持(beta)" : "EPMC Server Support"}
              {isTransferring && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {navigator.language.startsWith("zh") ? "人工支持中" : "In human support"}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* 对话分组选择 */}
            <div className="flex items-center gap-2">
              <select
                className="border rounded p-2 flex-1 bg-white"
                value={activeGroup || ""}
                onChange={(e) => {
                  setActiveGroup(e.target.value || null);
                  setCurrentNodeId("root");
                  setIsTransferring(false);
                }}
                disabled={Object.keys(chatGroups).length === 0}
              >
                <option value="" disabled>
                  {navigator.language.startsWith("zh") ? "选择对话" : "Select conversation"}
                </option>
                {Object.keys(chatGroups).map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              
              <Button size="sm" onClick={handleCreateGroup} className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> 
                {navigator.language.startsWith("zh") ? "新建" : "New"}
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteGroup}
                disabled={!activeGroup}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> 
                {navigator.language.startsWith("zh") ? "删除" : "Delete"}
              </Button>
            </div>

            {/* 聊天记录区域 */}
            <div
              ref={chatContainerRef}
              className="h-80 overflow-y-auto border rounded-lg p-3 bg-gray-50"
            >
              {activeGroup ? (
                chatGroups[activeGroup]?.length > 0 ? (
                  chatGroups[activeGroup].map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "User" ? "justify-end" : 
                        msg.sender === "HumanSupport" ? "justify-start" : "justify-start"
                      } mb-3 last:mb-0`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          msg.sender === "User" ? "bg-blue-500 text-white" :
                          msg.sender === "HumanSupport" ? "bg-green-500 text-white" :
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="font-semibold text-xs mb-1 flex justify-between items-center">
                          <span>
                            {msg.sender === "User" && (navigator.language.startsWith("zh") ? "您" : "You")}
                            {msg.sender === "EPMCBot" && (navigator.language.startsWith("zh") ? "EPMC机器人" : "EPMC Bot")}
                            {msg.sender === "HumanSupport" && (navigator.language.startsWith("zh") ? "人工支持" : "Human Support")}
                          </span>
                          <span className={
                            msg.sender === "User" ? "text-blue-100" :
                            msg.sender === "HumanSupport" ? "text-green-100" : "text-gray-500"
                          }>
                            {msg.time}
                          </span>
                        </div>
                        <div className="whitespace-pre-line">{msg.text}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    {navigator.language.startsWith("zh") ? "正在初始化对话..." : "Initializing conversation..."}
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500 text-center mt-4">
                  {navigator.language.startsWith("zh") ? "请选择或创建一个对话" : "Please select or create a conversation"}
                </p>
              )}
            </div>

            {/* 导航按钮 - 允许返回上一级 */}
            {activeGroup && currentNode.parent && !isTransferring && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToParentNode}
                className="flex items-center gap-1 self-start text-xs"
              >
                <ArrowLeft className="w-3 h-3" />
                {navigator.language.startsWith("zh") ? "返回上一级" : "Back to previous level"}
              </Button>
            )}

            {/* 选项按钮区域 - 动态生成当前节点的选项 */}
            {activeGroup && currentNode.options.length > 0 && !isTransferring && (
              <div className="flex flex-wrap gap-2">
                {currentNode.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={() => navigateToNode(option.target, option.label)}
                    className="text-xs whitespace-nowrap"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}

            {/* 消息输入区域 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  isTransferring 
                    ? (navigator.language.startsWith("zh") ? "正在与人工支持交谈..." : "Talking with human support...")
                    : (navigator.language.startsWith("zh") ? "输入消息..." : "Enter message...")
                }
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleInputSend()}
                disabled={!activeGroup || isTransferring}
              />
              <Button 
                onClick={handleInputSend} 
                disabled={!activeGroup || !userInput.trim() || isTransferring}
              >
                {navigator.language.startsWith("zh") ? "发送" : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
    