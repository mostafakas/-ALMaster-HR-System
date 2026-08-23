"use client";

import { ChatListPanel } from "@/components/hr-dashboard/messages/chat-list-panel";
import { ActiveChatPanel } from "@/components/hr-dashboard/messages/active-chat-panel";
import { ChatInfoPanel } from "@/components/hr-dashboard/messages/chat-info-panel";
import { ContactInfoPanel } from "@/components/hr-dashboard/messages/contact-info-panel";
import { MOCK_CHATS } from "@/components/hr-dashboard/messages/types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  toggleInfo,
  setSelectedContactId,
} from "@/lib/store/slices/messages-slice";

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state) => state.messages.selectedChatId);
  const showInfo = useAppSelector((state) => state.messages.showInfo);
  const selectedContactId = useAppSelector((state) => state.messages.selectedContactId);

  const selectedChat = MOCK_CHATS.find((c) => c.id === selectedChatId) ?? MOCK_CHATS[0];
  const selectedContact = selectedContactId
    ? (selectedChat.members?.find((m) => m.id === selectedContactId) ?? null)
    : null;

  const handleAvatarClick = (userId: string) => {
    dispatch(setSelectedContactId(userId));
  };

  const handleInfoClick = () => {
    if (selectedContactId) {
      dispatch(setSelectedContactId(null));
    } else {
      dispatch(toggleInfo());
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-muted">
      {/* Sidebar List - Takes full height independently */}
      <ChatListPanel />

      {/* Right Container: Header + Active Chat Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden bg-background px-6 pb-6 pt-2">

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Main Active Chat */}
          {selectedChat ? (
            <ActiveChatPanel
              chat={selectedChat}
              onInfoClick={handleInfoClick}
              onAvatarClick={(user) => handleAvatarClick(user.id)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white text-slate-400 font-janna font-bold rounded-2xl">
              Select a chat to start messaging
            </div>
          )}

          {/* Info Panel - Shows to the right of active chat */}
          {showInfo && selectedChat && (
            selectedContact ? (
              <ContactInfoPanel
                user={selectedContact}
                onClose={() => dispatch(setSelectedContactId(null))}
              />
            ) : (
              <ChatInfoPanel chat={selectedChat} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
