// Types mirroring the XenoReach crm-core backend DTOs.
// Keep in sync with crm-core/src/main/java/com/xenoreach/crm/dto/**

export type Channel = "WHATSAPP" | "SMS" | "EMAIL" | "RCS";
export type CampaignStatus = "DRAFT" | "SCHEDULED" | "RUNNING" | "COMPLETED";
export type CommunicationStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "OPENED"
  | "READ"
  | "CLICKED"
  | "FAILED";

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ---- Auth ----
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  pictureUrl?: string | null;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// ---- Customers ----
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  gender?: string | null;
  age?: number | null;
  totalSpend: number;
  lastOrderDate?: string | null;
  createdAt: string;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  gender?: string;
  age?: number;
}

// ---- Orders ----
export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  amount: number;
  status: string;
  orderDate: string;
}

export interface OrderRequest {
  customerId: number;
  amount: number;
  status?: string;
  orderDate?: string;
}

// ---- Segments ----
export interface SegmentCondition {
  field: "totalSpend" | "age" | "city" | "gender" | "inactiveDays" | "lastOrderDate" | string;
  operator: string;
  value: string | number;
}

export interface SegmentRuleGroup {
  operator: "AND" | "OR";
  conditions: Array<SegmentCondition | SegmentRuleGroup>;
}

export interface Segment {
  id: number;
  name: string;
  description?: string | null;
  rules: SegmentRuleGroup;
  audienceSize: number;
  createdAt: string;
}

export interface SegmentRequest {
  name: string;
  description?: string;
  rules: SegmentRuleGroup;
}

export interface SegmentPreviewResponse {
  audienceSize: number;
}

// ---- Campaigns ----
export interface Campaign {
  id: number;
  name: string;
  segmentId: number;
  segmentName: string;
  channel: Channel;
  subject?: string | null;
  message: string;
  cta?: string | null;
  abTestingEnabled?: boolean;
  variantBSubject?: string | null;
  variantBMessage?: string | null;
  variantBCta?: string | null;
  status: CampaignStatus;
  audienceSize: number;
  scheduledFor?: string | null;
  launchedAt?: string | null;
  createdAt: string;
}

export interface CampaignRequest {
  name: string;
  segmentId: number;
  channel: Channel;
  subject?: string;
  message: string;
  cta?: string;
  abTestingEnabled?: boolean;
  variantBSubject?: string;
  variantBMessage?: string;
  variantBCta?: string;
  scheduledFor?: string;
}

export interface CampaignDeliveryStats {
  campaignId: number;
  campaignName: string;
  status: string;
  total: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
}

export interface CampaignTemplate {
  id: number;
  name: string;
  channel: Channel;
  subject?: string | null;
  message: string;
  cta?: string | null;
  createdAt: string;
}

export interface CampaignTemplateRequest {
  name: string;
  channel: Channel;
  subject?: string;
  message: string;
  cta?: string;
}

// ---- Analytics ----
export interface ChannelPerformance {
  channel: Channel;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
}

export interface CampaignSummary {
  id: number;
  name: string;
  channel: string;
  status: string;
  audienceSize: number;
  openRate: number;
}

export interface DashboardAnalytics {
  totalCustomers: number;
  totalCampaigns: number;
  runningCampaigns: number;
  totalRevenue: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalFailed: number;
  totalConverted: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  channelPerformance: ChannelPerformance[];
  recentCampaigns: CampaignSummary[];
}

export interface CampaignAnalytics {
  campaignId: number;
  campaignName: string;
  channel: string;
  status: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  opened: number;
  read: number;
  clicked: number;
  failed: number;
  converted: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

// ---- AI ----
export interface CustomerRiskResponse {
  customerId: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskReasoning: string;
}

export interface AiSegmentResponse {
  segmentName: string;
  description: string;
  rules: SegmentRuleGroup;
  estimatedAudienceSize: number;
}

export interface AiCampaignResponse {
  campaignName: string;
  subject: string;
  message: string;
  cta: string;
  recommendedChannel: Channel;
  channelReasoning: string;
}

export interface AiCommandResponse {
  segment: AiSegmentResponse;
  audienceSize: number;
  campaign: AiCampaignResponse;
  recommendedChannel: string;
  summary: string;
}

// ---- Customer Timeline ----
export interface TimelineEntry {
  type: "CAMPAIGN_SENT" | "DELIVERED" | "OPENED" | "CLICKED" | "FAILED" | "CONVERTED" | "ORDER";
  title: string;
  description: string;
  channel?: string | null;
  amount?: number | null;
  occurredAt: string;
  campaignId?: number | null;
  campaignName?: string | null;
}

export interface CustomerTimelineResponse {
  customerId: number;
  customerName: string;
  email: string;
  timeline: TimelineEntry[];
}

