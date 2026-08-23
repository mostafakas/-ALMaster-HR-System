"use client";

import * as React from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatItem } from "./chat-item";
import { MOCK_CHATS } from "./types";
import { ArchiveFilters } from "./archive-filters";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setSelectedChatId,
  setActiveFilter,
  setSearchQuery,
} from "@/lib/store/slices/messages-slice";

const filters = ["All", "Global", "Departments", "Individuals", "Archive"];

export function ChatListPanel() {
  const dispatch = useAppDispatch();
  const activeChatId = useAppSelector((state) => state.messages.selectedChatId);
  const activeFilter = useAppSelector((state) => state.messages.activeFilter);
  const searchQuery = useAppSelector((state) => state.messages.searchQuery);

  const filteredChats = MOCK_CHATS.filter((chat) => {
    if (activeFilter === "Archive") {
      return chat.isArchived;
    }
    if (chat.isArchived) return false;

    const matchesFilter = activeFilter === "All" || chat.type.toLowerCase().includes(activeFilter.toLowerCase().slice(0, -1));
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isArchiveView = activeFilter === "Archive";

  return (
    <div className="w-[405px] h-full flex flex-col bg-background border-r border-border overflow-hidden shrink-0">

      {/* Header */}
      <div className="p-4 pt-8 pb-5 flex flex-col gap-5">
        <div className="flex items-center gap-2 px-4">
          <div className="bg-secondary size-9 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="size-3 text-muted-foreground" />
          </div>
          <Typography className="text-2xl font-bold text-foreground font-janna shrink-0">
            {isArchiveView ? "Chats Archive" : "Chats"}
          </Typography>
        </div>
        <div className="mx-4 h-0 border-t border-border w-full shrink-0" />

      </div>

      {/* Search & Filters */}
      <div className="px-4 pb-4 flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <Input
            placeholder="Search Chats..."
            className="pl-8 h-10 bg-secondary border-none rounded-lg text-sm font-bold text-foreground placeholder:text-muted-foreground font-janna focus-visible:ring-primary/20"

            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => dispatch(setActiveFilter(filter))}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-bold font-janna transition-all whitespace-nowrap h-8 flex items-center justify-center",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}

            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Archive Specific Filters */}
      {isArchiveView && (
        <div className="mb-4">
          <ArchiveFilters />
          <div className="mx-4 mt-4 h-0 border-t border-border" />
        </div>
      )}


      {/* Chat List Title */}
      {isArchiveView && (
        <div className="px-4 pb-2">
          <Typography className="text-base font-bold text-foreground font-janna">
            Archived Chats
          </Typography>
        </div>
      )}


      {/* Chat List */}
      <ScrollArea className="flex-1 px-4 no-scrollbar">
        <div className="flex flex-col gap-2 pb-8">
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={{ ...chat, isActive: chat.id === activeChatId }}
              isArchive={isArchiveView}
              onClick={() => dispatch(setSelectedChatId(chat.id))}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

