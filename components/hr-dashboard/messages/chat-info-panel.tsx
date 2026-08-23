"use client";

import { Users, Upload, Building2, Palette, Megaphone, Edit2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatThread } from "./types";

interface ChatInfoPanelProps {
  chat: ChatThread;
}

function ChatIcon({ chat }: { chat: ChatThread }) {
  if (chat.type === "Global") return <Building2 className="size-[30.6px] text-primary" />;
  if (chat.type === "Department") {
    if (chat.name.includes("Marketing")) return <Megaphone className="size-[30.6px] text-primary" />;
    if (chat.name.includes("Design")) return <Palette className="size-[30.6px] text-primary" />;
    if (chat.name.includes("Content")) return <Edit2 className="size-[30.6px] text-primary" />;
  }
  return <User className="size-[30.6px] text-primary" />;
}


export function ChatInfoPanel({ chat }: ChatInfoPanelProps) {
  return (
    <div className="w-[356px] h-full bg-muted border-l border-border flex flex-col shrink-0 overflow-hidden relative rounded-2xl">
      {/* Header accent background */}
      <div className="h-[192px] w-full bg-secondary absolute top-0 left-0 z-0" />


      <div className="relative z-10 flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 py-8 px-4">
          <div className="bg-primary/10 size-[92px] rounded-full flex items-center justify-center ">
            <ChatIcon chat={chat} />
          </div>

          <div className="text-center flex flex-col gap-1">
            <Typography className="text-xl font-bold text-foreground font-janna leading-6">
              {chat.name}
            </Typography>
            <Typography className="text-sm font-bold text-muted-foreground font-janna leading-5">
              {chat.membersCount} Members
            </Typography>
          </div>
          <div className="h-px bg-border w-full mt-2" />
        </div>


        {/* Content Section */}
        <div className="flex-1 flex flex-col px-4 pt-5 pb-5 gap-5 overflow-hidden">
          {/* Members Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-foreground" />
              <Typography className="text-base font-bold text-foreground font-janna leading-6">
                Members
              </Typography>
            </div>
            <Typography className="text-sm font-bold text-muted-foreground font-janna leading-5">
              {chat.membersCount} Members
            </Typography>
          </div>


          {/* Members List */}
          <ScrollArea className="flex-1 no-scrollbar">
            <div className="flex flex-col gap-5 pb-4">
              {(chat.members ?? []).map((member) => (
                <div key={member.id} className="flex gap-2 items-center">
                  <Avatar className="size-10 rounded-full shrink-0">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <Typography className="text-sm font-bold text-foreground font-janna leading-4 truncate">
                        {member.name}
                      </Typography>
                      <Typography className="text-xs font-bold text-muted-foreground font-janna leading-4 shrink-0">
                        {member.joinedDate}
                      </Typography>
                    </div>
                    <Typography className="text-xs font-bold text-muted-foreground font-janna leading-4">
                      {member.role}
                    </Typography>
                  </div>

                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Action Buttons Footer */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="h-px bg-border w-full" />
            <div className="flex gap-2 w-full">
              <Button
                variant="default"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-md shadow-primary/10"
              >
                <Upload className="size-3 text-primary-foreground" />
                Export Chat
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-background border-border text-foreground hover:bg-secondary/50 rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-sm"
              >
                <Upload className="size-3 text-foreground" />
                Archive Chat
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
