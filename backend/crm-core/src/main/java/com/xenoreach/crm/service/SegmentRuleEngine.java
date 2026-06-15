package com.xenoreach.crm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.exception.BadRequestException;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Converts a segment "rules" JSON tree into a JPA {@link Specification} that
 * can be applied to {@link Customer} queries.
 *
 * Supported rule tree shape (recursive):
 * <pre>
 * {
 *   "operator": "AND" | "OR",
 *   "conditions": [
 *     { "field": "totalSpend", "operator": ">", "value": 5000 },
 *     { "field": "inactiveDays", "operator": ">", "value": 60 },
 *     { "operator": "OR", "conditions": [ ... ] }   // nested groups allowed
 *   ]
 * }
 * </pre>
 *
 * Supported fields:
 *  - totalSpend   (numeric, on customers.total_spend)
 *  - age          (numeric, on customers.age)
 *  - city         (string, on customers.city)
 *  - gender       (string, on customers.gender)
 *  - inactiveDays (derived: days since customers.last_order_date)
 *  - lastOrderDate (date, on customers.last_order_date)
 *
 * Supported operators: =, !=, >, >=, <, <=, contains
 */
@Component
public class SegmentRuleEngine {

    public Specification<Customer> toSpecification(JsonNode rules) {
        return (root, query, cb) -> buildPredicate(rules, root, cb);
    }

    private Predicate buildPredicate(JsonNode node, jakarta.persistence.criteria.Root<Customer> root,
                                      jakarta.persistence.criteria.CriteriaBuilder cb) {

        if (node == null || node.isNull()) {
            return cb.conjunction();
        }

        // Group node (AND/OR with nested conditions)
        if (node.has("conditions")) {
            String operator = node.has("operator") ? node.get("operator").asText("AND") : "AND";
            JsonNode conditions = node.get("conditions");

            List<Predicate> predicates = new ArrayList<>();
            Iterator<JsonNode> it = conditions.elements();
            while (it.hasNext()) {
                predicates.add(buildPredicate(it.next(), root, cb));
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }

            return "OR".equalsIgnoreCase(operator)
                    ? cb.or(predicates.toArray(new Predicate[0]))
                    : cb.and(predicates.toArray(new Predicate[0]));
        }

        // Leaf condition node
        return buildLeafPredicate(node, root, cb);
    }

    @SuppressWarnings("unchecked")
    private Predicate buildLeafPredicate(JsonNode node, jakarta.persistence.criteria.Root<Customer> root,
                                          jakarta.persistence.criteria.CriteriaBuilder cb) {

        if (!node.has("field") || !node.has("operator") || !node.has("value")) {
            throw new BadRequestException("Invalid segment rule: each condition requires 'field', 'operator' and 'value'");
        }

        String field = node.get("field").asText();
        String operator = node.get("operator").asText();
        JsonNode valueNode = node.get("value");

        switch (field) {
            case "totalSpend": {
                var path = root.<BigDecimal>get("totalSpend");
                BigDecimal value = new BigDecimal(valueNode.asText());
                return numericPredicate(cb, path, operator, value);
            }
            case "age": {
                var path = root.<Integer>get("age");
                Integer value = valueNode.asInt();
                return numericPredicate(cb, path, operator, value);
            }
            case "city": {
                var path = root.<String>get("city");
                return stringPredicate(cb, path, operator, valueNode.asText());
            }
            case "gender": {
                var path = root.<String>get("gender");
                return stringPredicate(cb, path, operator, valueNode.asText());
            }
            case "inactiveDays": {
                // inactiveDays > X  <=>  lastOrderDate < (now - X days)
                int days = valueNode.asInt();
                LocalDateTime threshold = LocalDateTime.now().minusDays(days);
                var path = root.<LocalDateTime>get("lastOrderDate");

                // Invert comparison: more inactive days => older lastOrderDate
                switch (operator) {
                    case ">":
                    case ">=":
                        return cb.or(cb.isNull(path), cb.lessThan(path, threshold));
                    case "<":
                    case "<=":
                        return cb.and(cb.isNotNull(path), cb.greaterThan(path, threshold));
                    case "=":
                    case "==":
                        return cb.and(cb.isNotNull(path), cb.between(path, threshold.minusDays(1), threshold.plusDays(1)));
                    default:
                        throw new BadRequestException("Unsupported operator '" + operator + "' for field 'inactiveDays'");
                }
            }
            case "lastOrderDate": {
                var path = root.<LocalDateTime>get("lastOrderDate");
                LocalDateTime value = LocalDateTime.parse(valueNode.asText());
                return dateComparisonPredicate(cb, path, operator, value);
            }
            default:
                throw new BadRequestException("Unsupported segment field: " + field);
        }
    }

    private <T extends Comparable<T>> Predicate numericPredicate(jakarta.persistence.criteria.CriteriaBuilder cb,
                                                                   jakarta.persistence.criteria.Expression<T> path,
                                                                   String operator, T value) {
        switch (operator) {
            case ">": return cb.greaterThan(path, value);
            case ">=": return cb.greaterThanOrEqualTo(path, value);
            case "<": return cb.lessThan(path, value);
            case "<=": return cb.lessThanOrEqualTo(path, value);
            case "=":
            case "==": return cb.equal(path, value);
            case "!=": return cb.notEqual(path, value);
            default: throw new BadRequestException("Unsupported numeric operator: " + operator);
        }
    }

    private Predicate dateComparisonPredicate(jakarta.persistence.criteria.CriteriaBuilder cb,
                                               jakarta.persistence.criteria.Expression<LocalDateTime> path,
                                               String operator, LocalDateTime value) {
        switch (operator) {
            case ">": return cb.greaterThan(path, value);
            case ">=": return cb.greaterThanOrEqualTo(path, value);
            case "<": return cb.lessThan(path, value);
            case "<=": return cb.lessThanOrEqualTo(path, value);
            case "=":
            case "==": return cb.equal(path, value);
            case "!=": return cb.notEqual(path, value);
            default: throw new BadRequestException("Unsupported date operator: " + operator);
        }
    }

    private Predicate stringPredicate(jakarta.persistence.criteria.CriteriaBuilder cb,
                                       jakarta.persistence.criteria.Expression<String> path,
                                       String operator, String value) {
        switch (operator) {
            case "=":
            case "==": return cb.equal(cb.lower(path), value.toLowerCase());
            case "!=": return cb.notEqual(cb.lower(path), value.toLowerCase());
            case "contains": return cb.like(cb.lower(path), "%" + value.toLowerCase() + "%");
            default: throw new BadRequestException("Unsupported string operator: " + operator);
        }
    }
}
