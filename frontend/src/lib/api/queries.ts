import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type {
  AiCampaignResponse,
  AiCommandResponse,
  AiSegmentResponse,
  Campaign,
  CampaignAnalytics,
  CampaignRequest,
  Customer,
  CustomerRequest,
  DashboardAnalytics,
  OrderResponse,
  PagedResponse,
  Segment,
  SegmentPreviewResponse,
  SegmentRequest,
  SegmentRuleGroup,
} from "./types";

// =====================================================================
// Analytics
// =====================================================================

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => api.get<DashboardAnalytics>("/api/analytics/dashboard"),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useCampaignAnalytics(campaignId: number | undefined) {
  return useQuery({
    queryKey: ["analytics", "campaign", campaignId],
    queryFn: () => api.get<CampaignAnalytics>(`/api/analytics/campaign/${campaignId}`),
    enabled: !!campaignId,
  });
}

// =====================================================================
// Customers
// =====================================================================

export function useCustomers(params: { page?: number; size?: number; search?: string } = {}) {
  const { page = 0, size = 20, search } = params;
  return useQuery({
    queryKey: ["customers", { page, size, search }],
    queryFn: () =>
      search && search.trim().length > 0
        ? api.get<PagedResponse<Customer>>("/api/customers/search", { query: search, page, size })
        : api.get<PagedResponse<Customer>>("/api/customers", { page, size }),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: number | undefined) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => api.get<Customer>(`/api/customers/${id}`),
    enabled: !!id,
  });
}

export function useCustomerOrders(customerId: number | undefined) {
  return useQuery({
    queryKey: ["customers", customerId, "orders"],
    queryFn: () => api.get<OrderResponse[]>(`/api/orders/customer/${customerId}`),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerRequest) => api.post<Customer>("/api/customers", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

export function useImportCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post<{ imported: number }>("/api/customers/import", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

// =====================================================================
// Segments
// =====================================================================

export function useSegments(params: { page?: number; size?: number; search?: string } = {}) {
  const { page = 0, size = 20, search } = params;
  return useQuery({
    queryKey: ["segments", { page, size, search }],
    queryFn: () =>
      search && search.trim().length > 0
        ? api.get<PagedResponse<Segment>>("/api/segments/search", { query: search, page, size })
        : api.get<PagedResponse<Segment>>("/api/segments", { page, size }),
    placeholderData: (prev) => prev,
  });
}

export function useSegment(id: number | undefined) {
  return useQuery({
    queryKey: ["segments", id],
    queryFn: () => api.get<Segment>(`/api/segments/${id}`),
    enabled: !!id,
  });
}

export function useSegmentPreview() {
  return useMutation({
    mutationFn: (rules: SegmentRuleGroup) =>
      api.post<SegmentPreviewResponse>("/api/segments/preview", { rules }),
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SegmentRequest) => api.post<Segment>("/api/segments", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}

// =====================================================================
// Campaigns
// =====================================================================

export function useCampaigns(params: { page?: number; size?: number; search?: string } = {}) {
  const { page = 0, size = 20, search } = params;
  return useQuery({
    queryKey: ["campaigns", { page, size, search }],
    queryFn: () =>
      search && search.trim().length > 0
        ? api.get<PagedResponse<Campaign>>("/api/campaigns/search", { query: search, page, size })
        : api.get<PagedResponse<Campaign>>("/api/campaigns", { page, size }),
    placeholderData: (prev) => prev,
  });
}

export function useCampaign(id: number | undefined) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => api.get<Campaign>(`/api/campaigns/${id}`),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CampaignRequest) => api.post<Campaign>("/api/campaigns", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

export function useLaunchCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: number) => api.post<Campaign>(`/api/campaigns/${campaignId}/launch`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// =====================================================================
// AI
// =====================================================================

export function useAiSegment() {
  return useMutation({
    mutationFn: (prompt: string) => api.post<AiSegmentResponse>("/api/ai/segment", { prompt }),
  });
}

export function useAiCampaign() {
  return useMutation({
    mutationFn: (goal: string) => api.post<AiCampaignResponse>("/api/ai/campaign", { goal }),
  });
}

export function useAiCommand() {
  return useMutation({
    mutationFn: (prompt: string) => api.post<AiCommandResponse>("/api/ai/command", { prompt }),
  });
}
