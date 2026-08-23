import { baseApi } from "./baseApi";
import type { 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest 
} from "@/lib/types/employee";
import type { 
  ApiResponse, 
  PaginatedData, 
  QueryParams 
} from "@/lib/types/api";

/**
 * Employee API endpoints with advanced cache management and response transformation.
 */
export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<PaginatedData<Employee>, QueryParams | void>({
      query: (params) => ({
        url: "/employees",
        params: params || {},
      }),
      // Unpack response and throw error if success is false
      transformResponse: (response: ApiResponse<PaginatedData<Employee>>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      transformResponse: (response: ApiResponse<Employee>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    addEmployee: builder.mutation<Employee, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Employee>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<Employee, UpdateEmployeeRequest>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Employee>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<void>) => {
        if (!response.success) throw new Error(response.message);
      },
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
