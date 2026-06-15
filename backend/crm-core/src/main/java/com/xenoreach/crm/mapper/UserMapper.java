package com.xenoreach.crm.mapper;

import com.xenoreach.crm.dto.response.UserResponse;
import com.xenoreach.crm.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .role(user.getRole().name())
                .build();
    }
}
