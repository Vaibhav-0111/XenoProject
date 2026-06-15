package com.xenoreach.channel.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter @Setter
@Component
@ConfigurationProperties(prefix = "app.simulation")
public class SimulationProperties {
    private int minDelaySeconds = 1;
    private int maxDelaySeconds = 10;
    private double failureRate = 0.05;
    private double openRate = 0.65;
    private double clickRate = 0.35;
    private double conversionRate = 0.20;
    private int maxRetries = 3;
}
