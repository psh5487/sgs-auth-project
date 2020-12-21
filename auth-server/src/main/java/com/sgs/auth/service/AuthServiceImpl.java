package com.sgs.auth.service;

import com.sgs.auth.model.Salt;
import com.sgs.auth.model.User;
import com.sgs.auth.model.UserRole;
import com.sgs.auth.repository.UserRepository;
import com.sgs.auth.util.RedisUtil;
import com.sgs.auth.util.SaltUtil;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final SaltUtil saltUtil;

    private final RedisUtil redisUtil;

    private final EmailService emailService;

    // 회원가입
    @Override
    @Transactional
    public User join(String nickname, String password, String name, String email) {

        checkArgument(isNotEmpty(nickname), "Nickname must be provided");
        checkArgument(isNotEmpty(password), "Password must be provided");
        checkArgument(isNotEmpty(name), "Name must be provided");

        // 중복 체크
        findMemberByEmail(email).ifPresent((user) -> {
            throw new RuntimeException("Already existed User");
        });

        // salt 생성 및 비밀번호 encoding
        String salt = saltUtil.genSalt();

        User user = User.builder()
                .nickname(nickname)
                .salt(new Salt(salt))
                .password(saltUtil.encodePassword(salt, password))
                .name(name)
                .email(email)
                .role(UserRole.ROLE_NOT_PERMITTED)
                .build();

        return userRepository.save(user);
    }

    // 로그인
    @Override
    public User login(String email, String password) {

        checkNotNull(password, "Password must be provided");

        // 해당 이메일 가입 여부 확인
        User user = findMemberByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not existed user"));

        // 비밀번호 일치 여부 확인
        String salt = user.getSalt().getSalt();
        String encodedPassword = saltUtil.encodePassword(salt, password);

        if (!user.getPassword().equals(encodedPassword))
            throw new RuntimeException("Wrong password");

        if (user.getSocialType() != null)
            throw new RuntimeException("Registered With Social Account. Login With Social.");

        return user;
    }

    // 이메일로 회원 정보 찾기
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findMemberByEmail(String email) {

        checkNotNull(email, "Email must be provided.");
        return userRepository.findByEmail(email);
    }

    // 인증 Email 보내기
    @Override
    public void sendVerificationEmail(User user) throws NotFoundException {
        if (user == null)
            throw new NotFoundException("Not Existed User");

        // Random String uuid 만들기
        UUID uuid = UUID.randomUUID();

        // redis 에 유효시간 지정하여 uuid(Key), user email(value) 저장
        redisUtil.setDataExpire(uuid.toString(), user.getEmail(), RedisUtil.EMAIL_VERIFICATION_KEY_DURATION);

        // 메일 보내기
        emailService.sendMail(user.getEmail(), "[STOVE] 회원가입 인증메일입니다.", VERIFICATION_LINK + uuid.toString());
    }

    // 인증 Email Key 확인하기
    @Override
    public User verifyEmail(String key) throws NotFoundException {
        String email = redisUtil.getData(key);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Not Existed"));

        modifyUserRole(user, UserRole.ROLE_USER);
        redisUtil.deleteData(key);
        return user;
    }

    // 사용자 Role 변경하기
    @Override
    public User modifyUserRole(User user, UserRole userRole) {
        user.setRole(userRole);
        return userRepository.save(user);
    }

    // 비밀번호 변경하기
    @Override
    public void changePassword(User user, String password) throws NotFoundException {
        if (user == null)
            throw new NotFoundException("Not Existed User");

        String salt = saltUtil.genSalt();
        user.setSalt(new Salt(salt));
        user.setPassword(saltUtil.encodePassword(salt, password));
        userRepository.save(user);
    }

    // 인증 키를 통한 비밀번호 유효성 확인
    @Override
    public boolean isPasswordUuidValidate(String key) {
        String email = redisUtil.getData(key);
        return !email.equals("");
    }

    // 비밀번호 변경 Email 보내기
    @Override
    public void requestChangePassword(User user) throws NotFoundException {
        if (user == null)
            throw new NotFoundException("Not Existed User");

        String key = REDIS_CHANGE_PASSWORD_PREFIX + UUID.randomUUID();

        // redis 를 통한 유효시간 설정
        redisUtil.setDataExpire(key, user.getEmail(), 60 * 30L);

        // 메일 보내기
        emailService.sendMail(user.getEmail(), "[STOVE] 사용자 비밀번호 안내 메일", CHANGE_PASSWORD_LINK + key);
    }

}
