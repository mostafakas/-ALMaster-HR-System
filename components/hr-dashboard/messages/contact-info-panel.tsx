"use client";

import { Phone, Video, Upload, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ChatUser } from "./types";

interface ContactInfoPanelProps {
  user: ChatUser;
  onClose?: () => void;
}

export function ContactInfoPanel({ user, onClose }: ContactInfoPanelProps) {
  return (
    <div className="w-[356px] h-fit bg-muted border-l border-border flex flex-col shrink-0 overflow-hidden relative rounded-2xl">
      {/* Header accent background */}
      <div className="h-[192px] w-full bg-secondary absolute top-0 left-0 z-0" />


      <div className="relative z-10 flex flex-col h-full items-center px-4 py-5 gap-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Avatar className="size-[92px] rounded-full shadow-sm shrink-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>

          
          <div className="text-center flex flex-col gap-1">
            <Typography className="text-xl font-bold text-foreground font-janna leading-[24px]">
              {user.name}
            </Typography>
            <Typography className="text-sm font-bold text-muted-foreground font-janna leading-[20px]">
              {user.role || "Team Member"}
            </Typography>
          </div>
        </div>


        {/* Separator */}
        <div className="h-px bg-border w-full" />


        {/* Contact Actions Section */}
        <div className="flex flex-col gap-2 w-full pt-1">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-md shadow-primary/10"
          >
            <Phone className="size-3 text-primary-foreground" />
            Call
          </Button>
          <Button
            variant="outline"
            className="bg-secondary border-border text-foreground hover:bg-secondary/80 rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-sm"
          >
            <Video className="size-3 text-foreground" />
            Video Call
          </Button>
        </div>


        {/* Separator */}
        <div className="h-px bg-border w-full mt-2" />


        {/* Chat Management Section */}
        <div className="flex gap-2 w-full mt-1">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-md shadow-primary/10"
          >
            <Plus className="size-4 text-primary-foreground" />
            Export Chat
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-secondary border-border text-foreground hover:bg-secondary/80 rounded-lg h-9 font-janna font-bold text-xs gap-2 px-3 shadow-sm"
          >
            <Upload className="size-3 text-foreground" />
            Archive Chat
          </Button>
        </div>

      </div>
    </div>
  );
}
