"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./types";

interface MessageBubbleProps {
  message: ChatMessage;
  onAvatarClick?: () => void;
}

export function MessageBubble({ message, onAvatarClick }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-[11px] w-full",
        message.isMe ? "justify-end" : "justify-start"
      )}
    >
      {!message.isMe && (
        <Avatar
          className="size-8 rounded-[16px] shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          onClick={onAvatarClick}
        >

          <AvatarImage src={`https://ui.shadcn.com/avatars/0${message.senderId.length % 5 + 1}.png`} />
          <AvatarFallback>{message.senderName[0]}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[511px]",
          message.isMe ? "items-end" : "items-start"
        )}
      >
        {!message.isMe && (
          <div
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onAvatarClick}
          >
            <Typography className="text-foreground text-xs font-bold leading-4 font-janna">
              {message.senderName}
            </Typography>
            {message.senderRole && (
              <Typography className="text-primary text-xs font-bold leading-4 font-janna">
                [{message.senderRole}]
              </Typography>
            )}
          </div>

        )}

        <div className={cn(
          "flex flex-col gap-1.5",
          message.isMe ? "items-end" : "items-start"
        )}>
          <div
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-janna",
              message.isMe
                ? "bg-primary text-primary-foreground leading-4"
                : "bg-secondary text-foreground leading-[18px]"
            )}

          >
            {message.content}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1">
              {message.reactions.map((reaction, i) => (
                <div
                  key={i}
                  className="bg-secondary rounded-full px-3 py-1 flex items-center gap-1 shadow-sm"
                >
                  <span className="text-xs">{reaction.emoji}</span>
                  <Typography className="text-foreground text-xs font-bold leading-[14px] font-janna">
                    {reaction.count}
                  </Typography>
                </div>

              ))}
            </div>
          )}
        </div>

        <Typography className="text-muted-foreground text-xs font-bold leading-4 font-janna">
          {message.timestamp}
        </Typography>

      </div>
    </div>
  );
}
