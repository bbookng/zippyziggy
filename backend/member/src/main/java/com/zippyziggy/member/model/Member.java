package com.zippyziggy.member.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

import javax.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@Getter
@ToString
public class Member implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 10)
	private String nickname;

	@Column(length = 255)
	private String profileImg;

	@Column(nullable = false, length = 255)
	private String name;

	@Column(nullable = false)
	@CreationTimestamp
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

	public void setNickname(String nickname) {this.nickname = nickname;}

	public void setProfileImg(String profileImg) {this.profileImg = profileImg;}

	@PrePersist
	public void prePersist() {
		this.activate = this.activate == null ? true : this.activate;
		this.role = this.role == null ? RoleType.USER : this.role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {
                return getRole().toString();
            }
        });
		return collect;
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return nickname;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
