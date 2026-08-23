import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EmployeeStatus = "Online" | "Meeting" | "Break" | "IDLE" | "Offline";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department?: string;
  status: EmployeeStatus;
  avatar?: string;
}

interface EmployeeState {
  list: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
}

const initialState: EmployeeState = {
  list: [],
  loading: false,
  error: null,
  selectedEmployee: {
    id: "4",
    name: "John Smith",
    role: "Content Manager",
    status: "Online",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    selectEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const { setEmployees, setLoading, setError, selectEmployee } =
  employeeSlice.actions;
export default employeeSlice.reducer;
