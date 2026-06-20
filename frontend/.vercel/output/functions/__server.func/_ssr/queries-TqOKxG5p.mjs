import { n as api } from "./client-4kwFZpQp.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-TqOKxG5p.js
function useDashboardAnalytics() {
	return useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: () => api.get("/api/analytics/dashboard"),
		staleTime: 3e4,
		refetchInterval: 3e4
	});
}
function useCampaignAnalytics(campaignId) {
	return useQuery({
		queryKey: [
			"analytics",
			"campaign",
			campaignId
		],
		queryFn: () => api.get(`/api/analytics/campaign/${campaignId}`),
		enabled: !!campaignId
	});
}
function useCustomers(params = {}) {
	const { page = 0, size = 20, search } = params;
	return useQuery({
		queryKey: ["customers", {
			page,
			size,
			search
		}],
		queryFn: () => search && search.trim().length > 0 ? api.get("/api/customers/search", {
			query: search,
			page,
			size
		}) : api.get("/api/customers", {
			page,
			size
		}),
		placeholderData: (prev) => prev
	});
}
function useCreateCustomer() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => api.post("/api/customers", payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
			queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
		}
	});
}
function useSegments(params = {}) {
	const { page = 0, size = 20 } = params;
	return useQuery({
		queryKey: ["segments", {
			page,
			size
		}],
		queryFn: () => api.get("/api/segments", {
			page,
			size
		})
	});
}
function useSegmentPreview() {
	return useMutation({ mutationFn: (rules) => api.post("/api/segments/preview", { rules }) });
}
function useCreateSegment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => api.post("/api/segments", payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["segments"] });
		}
	});
}
function useCampaigns(params = {}) {
	const { page = 0, size = 20 } = params;
	return useQuery({
		queryKey: ["campaigns", {
			page,
			size
		}],
		queryFn: () => api.get("/api/campaigns", {
			page,
			size
		})
	});
}
function useCreateCampaign() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => api.post("/api/campaigns", payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
		}
	});
}
function useLaunchCampaign() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (campaignId) => api.post(`/api/campaigns/${campaignId}/launch`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["analytics"] });
		}
	});
}
function useAiSegment() {
	return useMutation({ mutationFn: (prompt) => api.post("/api/ai/segment", { prompt }) });
}
function useAiCampaign() {
	return useMutation({ mutationFn: (goal) => api.post("/api/ai/campaign", { goal }) });
}
function useAiCommand() {
	return useMutation({ mutationFn: (prompt) => api.post("/api/ai/command", { prompt }) });
}
//#endregion
export { useCampaigns as a, useCreateSegment as c, useLaunchCampaign as d, useSegmentPreview as f, useCampaignAnalytics as i, useCustomers as l, useAiCommand as n, useCreateCampaign as o, useSegments as p, useAiSegment as r, useCreateCustomer as s, useAiCampaign as t, useDashboardAnalytics as u };
