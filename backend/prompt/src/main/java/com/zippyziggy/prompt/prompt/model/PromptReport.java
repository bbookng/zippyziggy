package com.zippyziggy.prompt.prompt.model;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Getter
public class PromptReport {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID memberUuid;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "prompt_uuid", nullable = false)
	private Prompt prompt;

	@Column(nullable = false)
	private String content;

	@Column(nullable = false)
	private LocalDateTime regDt;

	public static PromptReport from(UUID memberUuid, Prompt prompt, String content) {
		LocalDateTime regDt = LocalDateTime.now();
		return PromptReport.builder()
				.memberUuid(memberUuid)
				.prompt(prompt)
				.content(content)
				.regDt(regDt).build();
	}
}
