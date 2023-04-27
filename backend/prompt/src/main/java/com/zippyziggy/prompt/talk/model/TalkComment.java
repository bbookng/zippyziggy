package com.zippyziggy.prompt.talk.model;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ColumnDefault;

import com.zippyziggy.prompt.prompt.model.Prompt;

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
public class TalkComment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID memberUUid;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "talk_id", nullable = false)
	private Talk talk;

	@Lob
	@Column(nullable = false)
	private String content;

	@Column(nullable = false)
	private LocalDateTime regDt;

}
