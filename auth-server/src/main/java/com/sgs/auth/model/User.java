package com.sgs.auth.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB 에게 식별자 위임하기
    private int seq;

    @Column(length = 50, nullable = false, unique = true)
    private String email;

    @Setter
    @Column(length = 100, nullable = false)
    private String password;

    @Setter
    @Column(length = 50, nullable = false)
    private String nickname;

    private String name; // 본명

    private String socialType; // OAuth2 인증 받은 소셜 미디어

    private String principal; // OAuth2 인증으로 제공받는 키 값

    @Setter
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updatedAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "salt_id")
    @Setter
    private Salt salt;
}
