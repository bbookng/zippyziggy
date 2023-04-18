package com.zippyziggy.member.model;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.*;

import org.hibernate.annotations.ColumnDefault;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@Getter
@DynamicInsert
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
	@CreationTimestamp
	private LocalDateTime regDt;

	@Column(nullable = false, columnDefinition = "boolean not null default 1")
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

}
