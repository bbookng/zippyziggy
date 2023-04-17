package com.zippyziggy.member.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@Getter
public class Member {

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
	private LocalDateTime regDt;

	@Column(nullable = false)
	private Boolean activate;

	@Column(nullable = false, length = 10)
	private RoleType role;

	@Column(nullable = false, length = 10)
	private Platform platform;

	@Column(nullable = false, length = 128)
	private String userUuid;

}
