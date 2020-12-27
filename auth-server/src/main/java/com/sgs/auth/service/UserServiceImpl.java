package com.sgs.auth.service;

import com.sgs.auth.model.User;
import com.sgs.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository userRepository;

    public List<User> allUserInfo() {
        return userRepository.findAll();
    }
}

