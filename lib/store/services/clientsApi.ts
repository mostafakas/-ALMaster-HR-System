import { baseApi } from "./baseApi";

export interface BackendClient {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  companyName?: string | null;
  industry?: string | null;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    proposals?: number;
  };
}

export interface ClientListResponse {
  data: BackendClient[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  companyName?: string;
  industry?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  address?: string;
  notes?: string;
}

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientListResponse, { search?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/clients",
        params: params || {},
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Client" as const, id })),
              { type: "Client", id: "LIST" },
            ]
          : [{ type: "Client", id: "LIST" }],
    }),

    getClientById: builder.query<BackendClient, string>({
      query: (id) => `/clients/${id}`,
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "Client", id }],
    }),

    createClient: builder.mutation<BackendClient, CreateClientInput>({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),

    updateClient: builder.mutation<BackendClient, { id: string; patch: Partial<CreateClientInput> }>({
      query: ({ id, patch }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: patch,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),

    deleteClient: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useLazyGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
