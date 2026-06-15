package com.xenoreach.crm.dto.response;

import com.xenoreach.crm.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ChannelPerformance {
    private Channel channel;
    private long sent;
    private long delivered;
    private long opened;
    private long clicked;
    private double openRate;
}
