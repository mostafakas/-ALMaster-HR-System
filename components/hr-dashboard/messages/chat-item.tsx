"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { MessageSquare, Megaphone, Palette, User, Edit2, Building2, Mail, Users } from "lucide-react";
import { ChatThread } from "./types";

interface ChatItemProps {
  chat: ChatThread;
  onClick: () => void;
  isArchive?: boolean;
}

const getIcon = (chat: ChatThread) => {
  if (chat.type === "Global") return Building2;
  if (chat.type === "Department") {
    if (chat.name.includes("Marketing")) return Megaphone;
    if (chat.name.includes("Design")) return Palette;
    if (chat.name.includes("Content")) return Edit2;
  }
  return User;
};

const getIconBg = (chat: ChatThread) => {
  if (chat.type === "Global") return "bg-primary/10";
  if (chat.type === "Department") {
    if (chat.name.includes("Marketing")) return "bg-warning/10";
    if (chat.name.includes("Design")) return "bg-success/10";
    if (chat.name.includes("Content")) return "bg-destructive/10";
  }
  return "bg-secondary";
};


const getIconColor = (chat: ChatThread) => {
  if (chat.type === "Global") return "text-primary";
  if (chat.type === "Department") {
    if (chat.name.includes("Marketing")) return "text-warning";
    if (chat.name.includes("Design")) return "text-success";
    if (chat.name.includes("Content")) return "text-destructive";
  }
  return "text-muted-foreground";
};


export const ChatItem = React.memo(function ChatItem({ chat, onClick, isArchive }: ChatItemProps) {
  const Icon = getIcon(chat);
  const iconBg = getIconBg(chat);
  const iconColor = getIconColor(chat);

  if (isArchive) {
    const names = chat.name.split(" • ");
    return (
      <div
        onClick={onClick}
        className={cn(
          "group flex items-center px-4 py-3 gap-3 cursor-pointer transition-all duration-200 rounded-lg w-full",
          chat.isActive
            ? "bg-primary/10 border-l-4 border-primary"
            : "bg-secondary hover:bg-secondary/80"
        )}

      >
        <div className="flex isolate items-center shrink-0">
          <Avatar className="size-8 rounded-full border-2 border-background shrink-0 z-[2]">
            <AvatarImage src={`https://ui.shadcn.com/avatars/01.png`} />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div className="-ml-2 size-8 rounded-full flex items-center justify-center shrink-0 z-[1] bg-background border-2 border-background overflow-hidden">
             {chat.type === "Department" ? (
               <div className={cn("size-full flex items-center justify-center", iconBg)}>
                 <Icon className={cn("size-3", iconColor)} />
               </div>
             ) : (
               <Avatar className="size-full rounded-full">
                 <AvatarImage src={`https://ui.shadcn.com/avatars/02.png`} />
                 <AvatarFallback>J</AvatarFallback>
               </Avatar>
             )}
          </div>
        </div>


        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Typography className="text-foreground text-sm font-bold leading-4 truncate font-janna">
              {names[0]}
            </Typography>
            <div className="size-1 rounded-full bg-foreground shrink-0" />
            <Typography className="text-foreground text-sm font-bold leading-4 truncate font-janna">
              {names[1]}
            </Typography>
          </div>


          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Mail className="size-2.5 text-muted-foreground" />
              <Typography className="text-muted-foreground text-xs font-bold leading-[15px] font-janna">
                {chat.lastMessage}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-2.5 text-muted-foreground" />
              <Typography className="text-muted-foreground text-xs font-bold leading-[15px] font-janna">
                {chat.lastMessageTime}
              </Typography>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-start p-4 gap-2 cursor-pointer transition-all duration-200 rounded-lg w-full",
        chat.isActive
          ? "bg-primary/10 border-l-4 border-primary"
          : "bg-secondary hover:bg-secondary/80"
      )}

    >
      <div className="flex gap-2 items-start flex-1 min-w-0">
        {chat.type !== "Individual" ? (
          <div className={cn("size-12 rounded-full flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("size-[16.8px]", iconColor)} />
          </div>
        ) : (
          <Avatar className="size-12 rounded-full shrink-0">
            <AvatarImage src={`https://ui.shadcn.com/avatars/0${chat.id.length % 5 + 1}.png`} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <Typography className="text-foreground text-sm font-bold leading-4 truncate font-janna">
              {chat.name}
            </Typography>
            <Typography className="text-muted-foreground text-xs font-bold leading-4 shrink-0 font-janna">
              {chat.lastMessageTime}
            </Typography>
          </div>


          {chat.type !== "Individual" && (
            <div className="flex items-center gap-1">
              <User className="size-3 text-muted-foreground" />
              <Typography className="text-muted-foreground text-xs font-bold leading-[15px] font-janna">
                {chat.membersCount} Members
              </Typography>
            </div>
          )}


          <div className="flex items-center justify-between gap-2 mt-0.5">
            <Typography className={cn(
              "text-xs leading-4 truncate font-janna",
              chat.unreadCount > 0 ? "text-foreground font-bold" : "text-muted-foreground font-normal"
            )}>
              {chat.lastMessage}
            </Typography>


            {chat.unreadCount > 0 && (
              <div className="bg-primary h-[18px] min-w-[18px] px-2 rounded-full flex items-center justify-center shrink-0">
                <Typography className="text-primary-foreground text-xs font-bold leading-[14px] font-janna">
                  {chat.unreadCount}
                </Typography>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
});
