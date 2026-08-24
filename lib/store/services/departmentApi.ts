import { baseApi } from "./baseApi";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<{ items: Department[] }, void>({
      query: () => "/departments",
      transformResponse: (response: { success: boolean; data: { items: Department[] } }) => {
        return response.data;
      },
      providesTags: ["Department"],
    }),
    addDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({
        url: "/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation<Department, { id: string; data: Partial<Department> }>({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
