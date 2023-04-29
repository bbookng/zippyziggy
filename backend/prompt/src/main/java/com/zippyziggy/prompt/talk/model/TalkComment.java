package com.zippyziggy.prompt.talk.model;

import com.zippyziggy.prompt.talk.dto.request.TalkCommentRequest;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

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

	public void setContent(String content) {
		this.content = content;
	}

	public static TalkComment from(TalkCommentRequest data, UUID crntMemberUuid, Talk talk) {
		return TalkComment.builder()
				.memberUUid(crntMemberUuid)
				.talk(talk)
				.regDt(LocalDateTime.now())
				.content(data.getContent())
				.build();
	}
}
