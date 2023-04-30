package com.zippyziggy.prompt.talk.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Getter
public class TalkLike {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID memberUuid;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "talk_id", nullable = false)
	private Talk talk;

	@Column(nullable = false)
	private LocalDateTime regDt;

	public static TalkLike from(Talk talk, UUID memberUuid) {
		return TalkLike.builder()
				.memberUuid(memberUuid)
				.talk(talk)
				.regDt(LocalDateTime.now())
				.build();
	}
}
