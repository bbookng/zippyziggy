package com.zippyziggy.prompt.prompt.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import org.hibernate.annotations.ColumnDefault;

import com.zippyziggy.prompt.talk.model.Talk;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
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
	@ColumnDefault("0")
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

	@Column(nullable = false, length = 128)
	private String promptUuid;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<PromptComment> promptComments;

	private Long likeCnt;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<Talk> talks;

}
