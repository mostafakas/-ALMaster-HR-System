"use client";

import * as React from "react";
import { Smile, Paperclip, Send, AlertCircle, Building2, Mail, Users, Upload } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageBubble } from "./message-bubble";
import { ChatThread, ChatUser } from "./types";
import { EmployeeReportModal } from "../employee-report-modal";

interface ActiveChatPanelProps {
  chat: ChatThread;
  onInfoClick?: () => void;
  onAvatarClick?: (user: ChatUser) => void;
}

// Stacked Avatars for group/archived chats
function StackedAvatars({ members }: { members: ChatThread["members"] }) {
  const shown = (members ?? []).slice(0, 2);
  return (
    <div className="flex items-center pr-2">
      {shown.map((member, i) => (
        <div
          key={member.id}
          className="relative rounded-[16px] size-8 shrink-0"
          style={{ zIndex: shown.length - i, marginRight: i < shown.length - 1 ? "-8px" : "0" }}
        >
          <Avatar className="size-8 rounded-[16px]">
            <AvatarImage src={member.avatar} />
            <AvatarFallback className="rounded-[16px] text-[10px] font-bold">
              {member.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
}

export function ActiveChatPanel({ chat, onInfoClick, onAvatarClick }: ActiveChatPanelProps) {
  const [message, setMessage] = React.useState("");
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const isArchived = !!chat.isArchived;
  const isGroup = chat.type !== "Individual";

  // Split archived chat name on " • " for the title display
  const nameParts = isArchived && chat.name ? chat.name.split(" • ") : null;

  return (
    <div className="flex-1 flex flex-col bg-muted rounded-2xl overflow-hidden relative">

      {/* ── HEADER ── */}
      <div className="bg-secondary px-6 py-3 flex items-center gap-2 shrink-0">

        {isArchived ? (
          /* Archived chat header — matches Figma node 145:77721 */
          <>
            <div className="flex flex-1 gap-3 items-start min-w-0">
              {/* Stacked avatars */}
              {chat.members && chat.members.length > 0 ? (
                <StackedAvatars members={chat.members} />
              ) : (
                <div className="bg-primary/10 size-8 rounded-full flex items-center justify-center shrink-0">
                  <Building2 className="size-[13px] text-primary" />
                </div>
              )}


              {/* Title + meta */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {/* Chat name with dot separator */}
                <div className="flex items-center gap-[5px] flex-wrap">
                  {nameParts ? (
                    nameParts.map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <div className="size-1 rounded-full bg-foreground shrink-0" />
                        )}
                        <Typography className="text-foreground text-sm font-bold leading-4 font-janna whitespace-nowrap">
                          {part}
                        </Typography>
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography className="text-foreground text-sm font-bold leading-4 font-janna">
                      {chat.name}
                    </Typography>
                  )}

                </div>

                {/* Message count + member count */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Mail className="size-[10px] text-muted-foreground" />
                    <Typography className="text-muted-foreground text-xs font-bold leading-[15px] font-janna whitespace-nowrap">
                      {chat.messageCount ?? 0} Messages
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-[11px] text-muted-foreground" />
                    <Typography className="text-muted-foreground text-xs font-bold leading-[15px] font-janna whitespace-nowrap">
                      {chat.membersCount} Members
                    </Typography>
                  </div>
                </div>

              </div>
            </div>

            {/* New Report Button (Triggers the Modal) */}
            <button 
              onClick={() => setIsReportOpen(true)}
              className="bg-secondary flex items-center gap-2 h-9 px-3 rounded-lg shrink-0 hover:bg-secondary/80 transition-colors"
            >
              <Typography as="span" className="text-foreground text-xs font-bold font-janna whitespace-nowrap">
                New Report
              </Typography>
            </button>

            {/* Export Chat Button */}
            <button className="bg-primary flex items-center gap-2 h-9 px-3 rounded-lg shrink-0 hover:bg-primary/90 transition-colors">
              <Upload className="size-3 text-primary-foreground" />
              <Typography as="span" className="text-primary-foreground text-xs font-bold font-janna whitespace-nowrap">
                Export Chat
              </Typography>
            </button>

          </>
        ) : (
          /* Regular chat header */
          <>
            <div className="bg-primary/10 size-10 rounded-full flex items-center justify-center shrink-0">
              <Building2 className="size-[13.33px] text-primary" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <Typography className="text-foreground text-sm font-bold leading-4 font-janna">
                {chat.name}
              </Typography>
              <Typography className="text-muted-foreground text-xs font-bold leading-4 font-janna">
                {chat.membersCount} Members
              </Typography>
            </div>
            <button
              onClick={onInfoClick}
              className="size-5 flex items-center justify-center rounded-md hover:bg-background/50 transition-all shrink-0"
            >
              <AlertCircle className="size-5 text-foreground" />
            </button>
          </>

        )}
      </div>

      {/* ── MESSAGES AREA ── */}
      <ScrollArea className="flex-1 px-6 py-6 no-scrollbar">
        <div className="flex flex-col gap-6">
          {chat.messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onAvatarClick={() => {
                const member = chat.members?.find((u) => u.id === m.senderId);
                if (member && onAvatarClick) onAvatarClick(member);
              }}
            />
          ))}

          {/* Typing indicator — only for non-archived chats */}
          {!isArchived && (
            <div className="flex gap-[11px] items-center">
              <Avatar className="size-8 rounded-[16px] shrink-0">
                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-lg px-3 py-2 h-8 flex items-center">
                <div className="flex gap-1 items-center">
                  <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="size-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>

            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── INPUT BAR — hidden for archived chats ── */}
      {!isArchived && (
        <div className="sticky bottom-0 z-20 bg-secondary px-6 py-5 flex gap-2 items-center shrink-0 rounded-b-2xl">
          <div className="flex-1 bg-muted rounded-lg h-12 flex items-center pl-4 pr-1.5 py-1.5 gap-1">
            <input
              className="flex-1 bg-transparent border-none outline-none text-foreground text-base font-bold placeholder:text-muted-foreground/30 font-janna min-w-0"
              placeholder="be read|"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-secondary size-10 flex items-center justify-center rounded-lg hover:bg-secondary/80 transition-colors shrink-0">
              <Smile className="size-4 text-muted-foreground" />
            </button>
          </div>


          <div className="flex gap-2 items-center shrink-0">
            <button className="bg-muted size-12 flex items-center justify-center rounded-lg hover:bg-secondary/50 transition-colors shadow-sm">
              <Paperclip className="size-4 text-muted-foreground" />
            </button>
            <button className="bg-primary size-12 flex items-center justify-center rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Send className="size-4 text-primary-foreground" />
            </button>
          </div>

        </div>
      )}

      {/* Shared Report Modal */}
      <EmployeeReportModal 
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        employee={{
          id: chat.id,
          name: chat.name?.split(" • ")[0] || chat.name || "Unknown User",
          avatar: chat.members?.[0]?.avatar
        }}
        range={{
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: new Date()
        }}
      />

    </div>
  );
}
