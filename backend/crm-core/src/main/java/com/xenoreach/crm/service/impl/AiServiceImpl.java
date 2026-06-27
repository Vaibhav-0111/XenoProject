package com.xenoreach.crm.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xenoreach.crm.ai.AiClient;
import com.xenoreach.crm.dto.request.AiCampaignRequest;
import com.xenoreach.crm.dto.request.AiCommandRequest;
import com.xenoreach.crm.dto.request.AiSegmentRequest;
import com.xenoreach.crm.dto.response.AiCampaignResponse;
import com.xenoreach.crm.dto.response.AiCommandResponse;
import com.xenoreach.crm.dto.response.AiSegmentResponse;
import com.xenoreach.crm.entity.Channel;
import com.xenoreach.crm.service.AiService;
import com.xenoreach.crm.service.SegmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.dto.response.CustomerRiskResponse;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiClient aiClient;
    private final SegmentService segmentService;
    private final ObjectMapper objectMapper;
    private final CustomerRepository customerRepository;

    private static final String SEGMENT_SYSTEM_PROMPT = """
            You are the AI segmentation engine for XenoReach AI, a marketing CRM.
            Convert the user's natural-language audience description into a JSON object with this exact shape:
            {
              "segmentName": "short title-case name for the audience",
              "description": "one sentence description",
              "rules": {
                "operator": "AND" | "OR",
                "conditions": [
                  {"field": "totalSpend|age|city|gender|inactiveDays|lastOrderDate", "operator": ">|>=|<|<=|=|!=|contains", "value": <number or string>}
                ]
              }
            }
            Only output valid JSON, no markdown, no commentary.
            "inactiveDays" means days since the customer's last order (higher = more dormant).
            """;

    private static final String CAMPAIGN_SYSTEM_PROMPT = """
            You are the AI campaign generator for XenoReach AI, a marketing CRM for D2C brands.
            Given a marketing goal, output a JSON object with this exact shape:
            {
              "campaignName": "short campaign name",
              "subject": "email subject line (<= 60 chars)",
              "message": "the marketing message body, include {{first_name}} as a personalization token",
              "cta": "short call-to-action text",
              "recommendedChannel": "WHATSAPP" | "SMS" | "EMAIL" | "RCS",
              "channelReasoning": "one sentence explaining why this channel fits the goal"
            }
            Only output valid JSON, no markdown, no commentary.
            """;

    private static final String RISK_SYSTEM_PROMPT = """
            You are the AI customer analyst for XenoReach AI.
            Given customer data (total spend, inactive days), output a JSON object with this shape:
            {
              "riskScore": <integer 0-100, where 100 is highly likely to churn>,
              "riskLevel": "LOW" | "MEDIUM" | "HIGH",
              "riskReasoning": "one short sentence explaining the score"
            }
            Only output valid JSON, no markdown, no commentary.
            """;

    @Override
    public AiSegmentResponse generateSegment(AiSegmentRequest request) {
        AiSegmentResponse response;
        try {
            String raw = aiClient.complete(SEGMENT_SYSTEM_PROMPT, request.getPrompt());
            response = parseSegmentResponse(raw);
        } catch (Exception e) {
            log.info("Falling back to heuristic segment generation ({})", e.getMessage());
            response = heuristicSegment(request.getPrompt());
        }

        int audienceSize = segmentService.computeAudienceSize(response.getRules());
        return AiSegmentResponse.builder()
                .segmentName(response.getSegmentName())
                .description(response.getDescription())
                .rules(response.getRules())
                .estimatedAudienceSize(audienceSize)
                .build();
    }

    @Override
    public AiCampaignResponse generateCampaign(AiCampaignRequest request) {
        try {
            String raw = aiClient.complete(CAMPAIGN_SYSTEM_PROMPT, request.getGoal());
            return parseCampaignResponse(raw);
        } catch (Exception e) {
            log.info("Falling back to heuristic campaign generation ({})", e.getMessage());
            return heuristicCampaign(request.getGoal());
        }
    }

    @Override
    public AiCommandResponse executeCommand(AiCommandRequest request) {
        AiSegmentRequest segmentRequest = new AiSegmentRequest();
        segmentRequest.setPrompt(request.getPrompt());
        AiSegmentResponse segment = generateSegment(segmentRequest);

        AiCampaignRequest campaignRequest = new AiCampaignRequest();
        campaignRequest.setGoal(request.getPrompt());
        AiCampaignResponse campaign = generateCampaign(campaignRequest);

        String summary = String.format(
                "Built audience '%s' (~%d customers) and drafted the '%s' campaign. Recommended channel: %s.",
                segment.getSegmentName(), segment.getEstimatedAudienceSize(),
                campaign.getCampaignName(), campaign.getRecommendedChannel());

        return AiCommandResponse.builder()
                .segment(segment)
                .audienceSize(segment.getEstimatedAudienceSize())
                .campaign(campaign)
                .recommendedChannel(campaign.getRecommendedChannel().name())
                .summary(summary)
                .build();
    }

    @Override
    public CustomerRiskResponse calculateCustomerRisk(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> ResourceNotFoundException.of("Customer", customerId));

        long inactiveDays = 0;
        if (customer.getLastOrderDate() != null) {
            inactiveDays = ChronoUnit.DAYS.between(customer.getLastOrderDate().toLocalDate(), LocalDate.now());
        }

        String prompt = String.format("Customer %s has spent ₹%.2f and has been inactive for %d days.", 
                                      customer.getName(), customer.getTotalSpend(), inactiveDays);

        try {
            String raw = aiClient.complete(RISK_SYSTEM_PROMPT, prompt);
            JsonNode root = objectMapper.readTree(extractJson(raw));
            return CustomerRiskResponse.builder()
                    .customerId(customerId)
                    .riskScore(root.path("riskScore").asInt(50))
                    .riskLevel(root.path("riskLevel").asText("MEDIUM"))
                    .riskReasoning(root.path("riskReasoning").asText("Calculated based on recent activity."))
                    .build();
        } catch (Exception e) {
            log.info("Falling back to heuristic risk generation for customer {}", customerId);
            int riskScore = (int) Math.min(100, (inactiveDays * 0.8));
            if (customer.getTotalSpend() > 5000) {
                riskScore = Math.max(0, riskScore - 20); // Premium customers are slightly less likely to churn immediately
            }
            String level = riskScore > 70 ? "HIGH" : (riskScore > 40 ? "MEDIUM" : "LOW");
            return CustomerRiskResponse.builder()
                    .customerId(customerId)
                    .riskScore(riskScore)
                    .riskLevel(level)
                    .riskReasoning("Based on " + inactiveDays + " days of inactivity and total spend.")
                    .build();
        }
    }

    // =====================================================================
    // JSON parsing of LLM output
    // =====================================================================

    private AiSegmentResponse parseSegmentResponse(String raw) throws Exception {
        JsonNode root = objectMapper.readTree(extractJson(raw));
        return AiSegmentResponse.builder()
                .segmentName(root.path("segmentName").asText("AI Generated Segment"))
                .description(root.path("description").asText(""))
                .rules(root.path("rules"))
                .estimatedAudienceSize(0)
                .build();
    }

    private AiCampaignResponse parseCampaignResponse(String raw) throws Exception {
        JsonNode root = objectMapper.readTree(extractJson(raw));
        Channel channel;
        try {
            channel = Channel.valueOf(root.path("recommendedChannel").asText("WHATSAPP").toUpperCase());
        } catch (Exception e) {
            channel = Channel.WHATSAPP;
        }

        return AiCampaignResponse.builder()
                .campaignName(root.path("campaignName").asText("AI Generated Campaign"))
                .subject(root.path("subject").asText(""))
                .message(root.path("message").asText(""))
                .cta(root.path("cta").asText("Shop Now"))
                .recommendedChannel(channel)
                .channelReasoning(root.path("channelReasoning").asText(""))
                .build();
    }

    /** Strips markdown code fences if the model wrapped its JSON in ```json ... ``` */
    private String extractJson(String raw) {
        if (raw == null) throw new IllegalArgumentException("Empty AI response");
        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceAll("^```(json)?", "").replaceAll("```$", "").trim();
        }
        return trimmed;
    }

    // =====================================================================
    // Heuristic (offline) generators -- used when no AI provider key is set
    // =====================================================================

    private static final Pattern SPEND_PATTERN = Pattern.compile(
            "(?:spen[dt]|spending|spent)[^0-9₹]*(?:₹|rs\\.?|inr)?\\s*([0-9,]+)", Pattern.CASE_INSENSITIVE);

    private static final Pattern INACTIVE_PATTERN = Pattern.compile(
            "(?:inactive|haven'?t\\s+(?:purchased|ordered|bought)|no\\s+orders?|dormant)[^0-9]*([0-9]+)\\s*days?", Pattern.CASE_INSENSITIVE);

    private static final Pattern CITY_PATTERN = Pattern.compile(
            "(?:in|from)\\s+(Delhi|Mumbai|Bengaluru|Bangalore|Chennai|Pune|Hyderabad|Kolkata)", Pattern.CASE_INSENSITIVE);

    private AiSegmentResponse heuristicSegment(String prompt) {
        ObjectNode rules = objectMapper.createObjectNode();
        ArrayNode conditions = objectMapper.createArrayNode();
        rules.put("operator", "AND");
        rules.set("conditions", conditions);

        StringBuilder nameBuilder = new StringBuilder();
        StringBuilder descBuilder = new StringBuilder("Customers");

        Matcher spendMatcher = SPEND_PATTERN.matcher(prompt);
        if (spendMatcher.find()) {
            double value = Double.parseDouble(spendMatcher.group(1).replace(",", ""));
            ObjectNode cond = objectMapper.createObjectNode();
            cond.put("field", "totalSpend");
            cond.put("operator", ">");
            cond.put("value", value);
            conditions.add(cond);
            nameBuilder.append("High Value ");
            descBuilder.append(" who have spent over ₹").append((long) value);
        }

        Matcher inactiveMatcher = INACTIVE_PATTERN.matcher(prompt);
        if (inactiveMatcher.find()) {
            int days = Integer.parseInt(inactiveMatcher.group(1));
            ObjectNode cond = objectMapper.createObjectNode();
            cond.put("field", "inactiveDays");
            cond.put("operator", ">");
            cond.put("value", days);
            conditions.add(cond);
            nameBuilder.append("Dormant ");
            descBuilder.append(descBuilder.indexOf("spent") > 0 ? " and" : "").append(" inactive for over ").append(days).append(" days");
        }

        Matcher cityMatcher = CITY_PATTERN.matcher(prompt);
        if (cityMatcher.find()) {
            ObjectNode cond = objectMapper.createObjectNode();
            cond.put("field", "city");
            cond.put("operator", "=");
            cond.put("value", cityMatcher.group(1));
            conditions.add(cond);
            nameBuilder.append(cityMatcher.group(1)).append(" ");
            descBuilder.append(" based in ").append(cityMatcher.group(1));
        }

        if (prompt.toLowerCase().contains("premium")) {
            if (conditions.isEmpty()) {
                ObjectNode cond = objectMapper.createObjectNode();
                cond.put("field", "totalSpend");
                cond.put("operator", ">");
                cond.put("value", 10000);
                conditions.add(cond);
            }
            nameBuilder.insert(0, "Premium ");
            descBuilder.append(" identified as premium shoppers");
        }

        if (conditions.isEmpty()) {
            // Default: everyone -- empty AND group matches all customers
            nameBuilder.append("All Customers ");
            descBuilder = new StringBuilder("All customers in the database");
        }

        nameBuilder.append("Segment");

        return AiSegmentResponse.builder()
                .segmentName(capitalizeWords(nameBuilder.toString().trim()))
                .description(descBuilder.toString().trim())
                .rules(rules)
                .estimatedAudienceSize(0)
                .build();
    }

    private AiCampaignResponse heuristicCampaign(String goal) {
        String lower = goal.toLowerCase();

        String campaignName;
        String subject;
        String message;
        String cta;
        Channel channel;
        String reasoning;

        boolean festive = lower.contains("diwali") || lower.contains("festival") || lower.contains("sale") || lower.contains("christmas");
        boolean premium = lower.contains("premium") || lower.contains("vip") || lower.contains("high value");
        boolean winback = lower.contains("inactive") || lower.contains("dormant") || lower.contains("win back") || lower.contains("win-back") || lower.contains("re-engage");

        if (festive) {
            campaignName = "Festive Celebration Offer";
            subject = "🎉 A Festive Surprise Just For You, {{first_name}}!";
            message = "Hi {{first_name}}, celebrate the festive season with an exclusive offer crafted just for you. " +
                    "Shop your favourites before the celebrations end!";
            cta = "Claim Festive Offer";
        } else if (winback) {
            campaignName = "We Miss You Win-Back Campaign";
            subject = "We miss you, {{first_name}} 💙";
            message = "Hi {{first_name}}, it's been a while! Here's something special to welcome you back -- " +
                    "come explore what's new since your last visit.";
            cta = "Come Back & Save";
        } else if (premium) {
            campaignName = "Premium Customer Appreciation";
            subject = "An Exclusive Reward For You, {{first_name}}";
            message = "Hi {{first_name}}, as one of our most valued customers, we'd like to offer you early access " +
                    "to our newest collection along with a special thank-you gift.";
            cta = "Explore Exclusive Access";
        } else {
            campaignName = "Personalized Outreach Campaign";
            subject = "Something New For You, {{first_name}}";
            message = "Hi {{first_name}}, we've got something we think you'll love based on what you usually shop for. " +
                    "Take a look before it's gone!";
            cta = "Discover Now";
        }

        if (winback || festive) {
            channel = Channel.WHATSAPP;
            reasoning = "WhatsApp typically drives the highest open and response rates for time-sensitive, re-engagement style messages.";
        } else if (premium) {
            channel = Channel.EMAIL;
            reasoning = "Email allows richer formatting and a more premium tone, well suited to high-value customer communication.";
        } else {
            channel = Channel.SMS;
            reasoning = "SMS offers fast, near-instant delivery for short, action-oriented promotional messages.";
        }

        return AiCampaignResponse.builder()
                .campaignName(campaignName)
                .subject(subject)
                .message(message)
                .cta(cta)
                .recommendedChannel(channel)
                .channelReasoning(reasoning)
                .build();
    }

    private String capitalizeWords(String input) {
        String[] words = input.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (w.isEmpty()) continue;
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }
}
