"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiClock,
  FiCheck,
  FiMessageSquare,
  FiCheckCircle,
  FiExternalLink,
  FiShield,
  FiMail,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import {
  useGetAdminConversationsQuery,
  useGetAdminConversationDetailsQuery,
  useAdminReplyMutation,
} from "@/redux/api/chatApi";
import toast from "react-hot-toast";

const QUICK_REPLIES = [
  "ধন্যবাদ! আমরা আপনার অর্ডারটি চেক করছি, দয়া করে একটু অপেক্ষা করুন।",
  "আপনার অর্ডারটি আজকের ডেলিভারি স্লটে প্রসেসিং হচ্ছে।",
  "আমাদের প্রতিটি পণ্য ১০০% ফ্রেশ ও বাছাই করা। কোনো সমস্যায় জানালে সাথে সাথে সমাধান পাবেন।",
  "আমাদের ডেলিভারি চার্জ সম্পূর্ণ ফ্রি এবং ক্যাশ অন ডেলিভারি প্রযোজ্য।",
  "আপনার কোনো জরুরি প্রশ্ন থাকলে আমাদের হেল্পলাইন নাম্বারেও যোগাযোগ করতে পারেন।",
];

export default function AdminLiveChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread">("all");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll conversations every 3.5s
  const {
    data: convData,
    isLoading: isLoadingList,
    refetch: refetchList,
    isFetching: isFetchingList,
  } = useGetAdminConversationsQuery(undefined, {
    pollingInterval: 3500,
  });

  // Poll selected conversation messages every 3s
  const {
    data: activeConvData,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useGetAdminConversationDetailsQuery(selectedConversationId || "", {
    skip: !selectedConversationId,
    pollingInterval: 3000,
  });

  const [adminReply, { isLoading: isSending }] = useAdminReplyMutation();

  const conversations = convData?.data || [];
  const activeConversation = activeConvData?.data;

  // Auto-scroll to bottom of messages when conversation changes or new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Filter conversations
  const filteredConversations = conversations.filter((c: any) => {
    const matchesSearch =
      (c.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.customerPhone || "").includes(searchTerm) ||
      (c.sessionId || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === "unread") {
      return (c.unreadByAdmin || 0) > 0;
    }
    return true;
  });

  const totalUnread = conversations.reduce(
    (sum: number, c: any) => sum + (c.unreadByAdmin || 0),
    0
  );

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedConversationId || isSending) return;

    const messageText = replyText.trim();
    setReplyText("");

    try {
      await adminReply({
        conversationId: selectedConversationId,
        text: messageText,
      }).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "মেসেজ পাঠাতে সমস্যা হয়েছে");
      setReplyText(messageText);
    }
  };

  const handleQuickReply = (text: string) => {
    setReplyText(text);
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("bn-BD", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className=" space-y-4 w-full mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <RiCustomerService2Fill size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">সবজিহাট কাস্টমার সাপোর্ট ডেস্ক</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                লাইভ মোড
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              ওয়েবসাইট থেকে আসা গ্রাহকদের সরাসরি লাইভ উত্তর দিন (ইন-সাইট রিয়েল-টাইম সাপোর্ট)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalUnread > 0 && (
            <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {totalUnread}টি অপঠিত মেসেজ
            </span>
          )}
          <button
            onClick={() => {
              refetchList();
              if (selectedConversationId) refetchDetails();
            }}
            disabled={isFetchingList}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 transition"
          >
            <FiRefreshCw className={isFetchingList ? "animate-spin" : ""} size={14} />
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
        {/* Left Column: Conversations List */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-gray-200 flex flex-col h-full bg-white">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-gray-100 space-y-2.5 bg-gray-50/60">
            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="গ্রাহকের নাম বা ফোন দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${filterType === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                সব চ্যাট ({conversations.length})
              </button>
              <button
                onClick={() => setFilterType("unread")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${filterType === "unread"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                অপঠিত
                {totalUnread > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === "unread"
                      ? "bg-white text-rose-600 font-bold"
                      : "bg-rose-500 text-white"
                      }`}
                  >
                    {totalUnread}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {isLoadingList ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                চ্যাট লিস্ট লোড হচ্ছে...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <FiMessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                কোনো চ্যাট মেসেজ পাওয়া যায়নি
              </div>
            ) : (
              filteredConversations.map((conv: any) => {
                const isSelected = selectedConversationId === conv._id;
                const unreadCount = conv.unreadByAdmin || 0;
                const lastMsg = conv.lastMessage || {};
                const isCustomerLast = lastMsg.sender === "user";

                return (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition relative ${isSelected
                      ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {(conv.customerName || "G")[0].toUpperCase()}
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"
                            }`}
                        >
                          {conv.customerName || "গ্রাহক (অতিথি)"}
                        </h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {formatTime(conv.lastMessageAt || conv.updatedAt)}
                        </span>
                      </div>

                      {conv.customerPhone ? (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-1">
                          <FiPhone size={10} className="text-gray-400" />
                          {conv.customerPhone}
                        </p>
                      ) : conv.customerEmail ? (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-1 truncate">
                          <FiMail size={10} className="text-gray-400 flex-shrink-0" />
                          {conv.customerEmail}
                        </p>
                      ) : null}

                      <p
                        className={`text-xs truncate ${unreadCount > 0 ? "font-semibold text-gray-800" : "text-gray-500"
                          }`}
                      >
                        {!isCustomerLast && lastMsg.text && (
                          <span className="text-emerald-600 font-medium mr-1">আপনি:</span>
                        )}
                        {lastMsg.text || "নতুন চ্যাট শুরু হয়েছে"}
                      </p>
                    </div>

                    {/* Unread Pill */}
                    {unreadCount > 0 && (
                      <div className="flex-shrink-0 mt-1">
                        <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col h-full bg-[#efeae2]">
          {selectedConversationId && activeConversation ? (
            <>
              {/* Active Conversation Header (WhatsApp green style) */}
              <div className="px-4 py-3 bg-[#075E54] text-white flex items-center justify-between shadow-md flex-shrink-0 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                    {(activeConversation.customerName || "G")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold truncate">
                        {activeConversation.customerName || "গ্রাহক (ভিজিটর)"}
                      </h3>
                      {activeConversation.userID ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-medium flex items-center gap-1">
                          <FiShield size={10} /> রেজিস্টার্ড
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-[10px]">
                          গেস্ট ভিজিটর
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-100/90 mt-0.5">
                      {activeConversation.customerPhone && (
                        <span className="flex items-center gap-1 font-mono">
                          <FiPhone size={11} /> {activeConversation.customerPhone}
                        </span>
                      )}
                      {activeConversation.customerEmail && (
                        <span className="flex items-center gap-1 text-emerald-100">
                          <FiMail size={11} /> {activeConversation.customerEmail}
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-200/70 truncate">
                        সেশন: {activeConversation.sessionId?.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeConversation.customerPhone && (
                    <a
                      href={`tel:${activeConversation.customerPhone}`}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
                      title="সরাসরি কল দিন"
                    >
                      <FiPhone size={14} />
                      <span className="hidden sm:inline">কল</span>
                    </a>
                  )}
                  {activeConversation.customerPhone && (
                    <a
                      href={`https://wa.me/88${activeConversation.customerPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white transition text-xs flex items-center gap-1"
                      title="অফিসিয়াল হোয়াটসঅ্যাপে ওপেন করুন"
                    >
                      <FaWhatsapp size={14} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Chat Messages Body with WhatsApp background */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3"
                style={{
                  backgroundImage:
                    "radial-gradient(#00000008 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                {/* Notice banner */}
                <div className="flex justify-center my-2">
                  <div className="bg-[#ffeecd] border border-[#f5d799] text-[#7a5814] text-[11px] px-3 py-1 rounded-lg shadow-sm text-center max-w-md">
                    🔒 এই গ্রাহক সবজিহাটের ওয়েবসাইট থেকে সরাসরি মেসেজ পাঠাচ্ছেন। আপনি এখানে উত্তর দিলে গ্রাহক তার ব্রাউজারে রিয়েল-টাইম দেখতে পাবেন।
                  </div>
                </div>

                {isLoadingDetails ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    মেসেজ লোড হচ্ছে...
                  </div>
                ) : (activeConversation.messages || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    কোনো মেসেজ হিস্ট্রি নেই
                  </div>
                ) : (
                  activeConversation.messages.map((msg: any, idx: number) => {
                    const isAdmin = msg.sender === "admin";

                    return (
                      <div
                        key={idx}
                        className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed relative ${isAdmin
                            ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                            : "bg-white text-gray-900 rounded-tl-none border border-gray-100"
                            }`}
                        >
                          {/* Sender tag if admin */}
                          {isAdmin && (
                            <div className="text-[10px] font-bold text-emerald-800 mb-0.5">
                              {msg.adminName || "সাপোর্ট টিম"}
                            </div>
                          )}

                          {/* Message Content */}
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                          {/* Timestamp & double tick */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isAdmin ? "text-emerald-700/80" : "text-gray-400"
                              }`}
                          >
                            <span>{formatTime(msg.timestamp)}</span>
                            {isAdmin && (
                              <span className="text-[#53bdeb] font-bold">✓✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Bar */}
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 overflow-x-auto flex gap-2 flex-shrink-0 scrollbar-none">
                <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap self-center mr-1">
                  ⚡ কুইক রিপ্লাই:
                </span>
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="px-2.5 py-1 text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-gray-700 border border-gray-200 rounded-full whitespace-nowrap transition flex-shrink-0 shadow-2xs"
                  >
                    {reply.length > 32 ? reply.slice(0, 32) + "..." : reply}
                  </button>
                ))}
              </div>

              {/* Reply Input Form */}
              <form
                onSubmit={handleSendReply}
                className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0"
              >
                <input
                  type="text"
                  placeholder="গ্রাহকের উত্তর লিখুন... (Enter চাপুন)"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-gray-800"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="px-4 py-2.5 bg-[#075E54] hover:bg-[#128C7E] disabled:bg-gray-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:cursor-not-allowed"
                >
                  <FiSend size={14} />
                  <span>{isSending ? "পাঠানো হচ্ছে..." : "সেন্ড"}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f0f2f5]">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <RiCustomerService2Fill size={42} />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                সবজিহাট লাইভ কাস্টমার চ্যাট ডেস্ক
              </h3>
              <p className="text-xs text-gray-500 max-w-md mb-4 leading-relaxed">
                ওয়েবসাইটে গ্রাহক মেসেজ পাঠালে বাম পাশের তালিকায় ভেসে উঠবে। যেকোনো চ্যাটে ক্লিক করে সরাসরি কথা বলুন।
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                রিয়েল-টাইম সিংকিং সক্রিয় আছে
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
