import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RolesState {
  activeRoleId: string;
}

const initialState: RolesState = {
  activeRoleId: "almaster-ceo",
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setActiveRoleId: (state, action: PayloadAction<string>) => {
      state.activeRoleId = action.payload;
    },
  },
});

export const { setActiveRoleId } = rolesSlice.actions;
export default rolesSlice.reducer;
