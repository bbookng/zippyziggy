package com.zippyziggy.gateway.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@ToString
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 500)
    private String profileImg;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private LocalDateTime regDt;

    @Column(nullable = false, columnDefinition = "boolean default 1")
    private Boolean activate;

    @Column(nullable = false, length = 10, columnDefinition = "varchar(10) default 'USER'")
    @Enumerated(value = EnumType.STRING)
    private RoleType role;

    @Column(nullable = false, length = 10)
    @Enumerated(value = EnumType.STRING)
    private Platform platform;

    @Column(nullable = false, length = 100)
    private String platformId;

    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(nullable = false, columnDefinition = "BINARY(16)")
    private UUID userUuid;

    @Column(length = 500)
    private String refreshToken;

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setActivate(Boolean activate) {
        this.activate = activate;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setProfileImg(String profileImg) {
        this.profileImg = profileImg;
    }

    public UUID getUserUuid() {
        return this.userUuid;
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }
    public RoleType getRole() {
        return this.role;
    }

    @PrePersist
    public void prePersist() {
        this.activate = this.activate == null ? true : this.activate;
        this.role = this.role == null ? RoleType.USER : this.role;
    }
}