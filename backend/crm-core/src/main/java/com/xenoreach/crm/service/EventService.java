package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.EventCallbackRequest;

public interface EventService {
    void processCallback(EventCallbackRequest request);
}
