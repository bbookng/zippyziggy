package com.zippyziggy.prompt.prompt.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.annotations.ColumnDefault;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Getter
public class Temp {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false, length = 255)
	private String title;

	@Column(nullable = false, length = 255)
	private String description;

	@Column(nullable = false)
	@ColumnDefault("0")
	private Integer hit;

	@Column(nullable = false)
	private LocalDateTime regDt;

	@Column(nullable = false)
	private LocalDateTime updDt;

	@Column(nullable = false, length = 10)
	private Category category;

	@Lob
	private String prefix;

	@Lob
	private String suffix;

	@Lob
	private String example;

	@Column(nullable = false, length = 128)
	private String promptUuid;

}
