package com.sgs.auth.service;

import com.sgs.auth.model.User;
import com.sgs.auth.model.UserRole;
import javassist.NotFoundException;

import java.util.Optional;

public interface AuthService {

    String VERIFICATION_LINK = "http://localhost:8080/api/user/verify/";

    String CHANGE_PASSWORD_LINK = "http://localhost:8080/api/user/password/";

    String REDIS_CHANGE_PASSWORD_PREFIX = "CPW";

    User join(String nickname, String password, String name, String email);

    User login(String email, String password);

    Optional<User> findMemberByEmail(String email);

    void sendVerificationEmail(User user) throws NotFoundException;

    User verifyEmail(String key) throws NotFoundException;

    User modifyUserRole(User user, UserRole userRole);

    void changePassword(User user, String password) throws NotFoundException;

    boolean isPasswordUuidValidate(String key);

    void requestChangePassword(User user) throws NotFoundException;
}
