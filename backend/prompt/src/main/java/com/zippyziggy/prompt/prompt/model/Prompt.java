package com.zippyziggy.prompt.prompt.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.zippyziggy.prompt.talk.model.Talk;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter @Setter
public class Prompt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long memberId;

	@Column(nullable = false, length = 255)
	private String title;

	@Column(nullable = false, length = 255)
	private String description;

	@Column(nullable = false)
	private Integer hit;

	@Column(nullable = false)
	private LocalDateTime regDt;

	@Column(nullable = false)
	private LocalDateTime updDt;

	@Column(nullable = false, length = 10)
	private Category category;

	private String thumbnail;

	@Lob
	private String prefix;

	@Lob
	private String suffix;

	@Lob
	private String example;

	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	// @Column(nullable = false, columnDefinition = "BINARY(16)")
	@Type(type = "uuid-char")
	private UUID promptUuid;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<PromptComment> promptComments;

	private Long likeCnt;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<Talk> talks;

	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	// @Column(columnDefinition = "BINARY(16)")
	@Type(type = "uuid-char")
	private UUID originPromptUuid;

	@Column(nullable = false, length = 10)
	private Languages languages;

	public void setOriginPromptUuid(UUID originPromptUuid) {

		this.originPromptUuid = originPromptUuid;
	}

}
