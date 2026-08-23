import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
  selectedChatId: string;
  showInfo: boolean;
  selectedContactId: string | null;
  activeFilter: string;
  searchQuery: string;
}

const initialState: MessagesState = {
  selectedChatId: "global-chat",
  showInfo: false,
  selectedContactId: null,
  activeFilter: "All",
  searchQuery: "",
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
      state.selectedContactId = null;
    },
    setShowInfo: (state, action: PayloadAction<boolean>) => {
      state.showInfo = action.payload;
    },
    toggleInfo: (state) => {
      state.showInfo = !state.showInfo;
    },
    setSelectedContactId: (state, action: PayloadAction<string | null>) => {
      state.selectedContactId = action.payload;
      if (action.payload) state.showInfo = true;
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setSelectedChatId,
  setShowInfo,
  toggleInfo,
  setSelectedContactId,
  setActiveFilter,
  setSearchQuery,
} = messagesSlice.actions;
export default messagesSlice.reducer;
