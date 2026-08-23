import { baseApi } from "./baseApi";
import type { StoredProposal } from "@/lib/types/proposal";

export interface BackendProposal {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  service: string;
  format: string;
  dimensions: string;
  language: string;
  market: string;
  status: string;
  version: number;
  clientId: string;
  client: {
    id: string;
    name: string;
    email: string;
    country?: string | null;
    avatarUrl?: string | null;
    companyName?: string | null;
  };
  quotationMode: string;
  subtotal: number | string;
  taxRate: number | string;
  taxAmount: number | string;
  discountAmount: number | string;
  totalPrice: number | string;
  currency: string;
  validUntil?: string | null;
  sentAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  pdfUrl?: string | null;
  coverModule?: Record<string, any>;
  aboutModule?: Record<string, any>;
  serviceModule?: Record<string, any>;
  whyModule?: Record<string, any>;
  scopeModule?: Record<string, any>;
  quotationModule?: Record<string, any>;
  supportModule?: Record<string, any>;
  whatWeNeedModule?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  activityLogs?: Array<{
    id: string;
    action: string;
    details?: any;
    createdAt: string;
    user?: { fullName: string; email: string };
  }>;
}

export interface ProposalListResponse {
  data: BackendProposal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProposalMetricsResponse {
  total: number;
  accepted: number;
  inReview: number;
  rejected: number;
  draft: number;
  sent: number;
  totalValue: number;
  acceptedValue: number;
  winRate: number;
}

export interface ProposalQueryParams {
  search?: string;
  status?: string;
  service?: string;
  market?: string;
  format?: string;
  language?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface CreateProposalDraftInput {
  title: string;
  clientId: string;
  service?: string;
  format?: string;
  dimensions?: string;
  language?: string;
  market?: string;
  description?: string;
}

export interface UpdateProposalDraftInput {
  title?: string;
  description?: string;
  coverModule?: Record<string, any>;
  aboutModule?: Record<string, any>;
  serviceModule?: Record<string, any>;
  whyModule?: Record<string, any>;
  scopeModule?: Record<string, any>;
  quotationModule?: Record<string, any>;
  supportModule?: Record<string, any>;
  whatWeNeedModule?: Record<string, any>;
}

export const proposalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProposals: builder.query<ProposalListResponse, ProposalQueryParams | void>({
      query: (params) => ({
        url: "/proposals",
        params: params || {},
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Proposal" as const, id })),
              { type: "Proposal", id: "LIST" },
            ]
          : [{ type: "Proposal", id: "LIST" }],
    }),

    getProposalMetrics: builder.query<ProposalMetricsResponse, void>({
      query: () => "/proposals/metrics",
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ProposalMetrics"],
    }),

    getProposalById: builder.query<BackendProposal, string>({
      query: (id) => `/proposals/${id}`,
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "Proposal", id }],
    }),

    createProposalDraft: builder.mutation<BackendProposal, CreateProposalDraftInput>({
      query: (body) => ({
        url: "/proposals/draft",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [
        { type: "Proposal", id: "LIST" },
        "ProposalMetrics",
      ],
    }),

    updateProposalDraft: builder.mutation<BackendProposal, { id: string; draft: UpdateProposalDraftInput }>({
      query: ({ id, draft }) => ({
        url: `/proposals/${id}/draft`,
        method: "PUT",
        body: draft,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Proposal", id },
        { type: "Proposal", id: "LIST" },
        "ProposalMetrics",
      ],
    }),

    patchModule: builder.mutation<BackendProposal, { id: string; moduleKey: string; patch: Record<string, any> }>({
      query: ({ id, moduleKey, patch }) => ({
        url: `/proposals/${id}/module/${moduleKey}`,
        method: "PATCH",
        body: { patch },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Proposal", id }],
    }),

    updateProposalStatus: builder.mutation<BackendProposal, { id: string; status: string; note?: string }>({
      query: ({ id, status, note }) => ({
        url: `/proposals/${id}/status`,
        method: "PATCH",
        body: { status, note },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Proposal", id },
        { type: "Proposal", id: "LIST" },
        "ProposalMetrics",
      ],
    }),

    duplicateProposal: builder.mutation<BackendProposal, string>({
      query: (id) => ({
        url: `/proposals/${id}/duplicate`,
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [
        { type: "Proposal", id: "LIST" },
        "ProposalMetrics",
      ],
    }),

    deleteProposal: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/proposals/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [
        { type: "Proposal", id: "LIST" },
        "ProposalMetrics",
      ],
    }),

    exportProposalPdf: builder.mutation<{ success: boolean; pdfUrl: string }, string>({
      query: (id) => ({
        url: `/proposals/${id}/export/pdf`,
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (_result, _error, id) => [{ type: "Proposal", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProposalsQuery,
  useLazyGetProposalsQuery,
  useGetProposalMetricsQuery,
  useGetProposalByIdQuery,
  useCreateProposalDraftMutation,
  useUpdateProposalDraftMutation,
  usePatchModuleMutation,
  useUpdateProposalStatusMutation,
  useDuplicateProposalMutation,
  useDeleteProposalMutation,
  useExportProposalPdfMutation,
} = proposalsApi;
