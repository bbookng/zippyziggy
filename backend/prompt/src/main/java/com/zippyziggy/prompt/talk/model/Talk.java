package com.zippyziggy.prompt.talk.model;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.hibernate.annotations.ColumnDefault;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.talk.dto.request.TalkRequest;
import com.zippyziggy.prompt.talk.dto.response.MessageResponse;
import com.zippyziggy.prompt.talk.dto.response.TalkDetailResponse;

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
public class Talk {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "prompt_uuid", nullable = true)
	private Prompt prompt;

	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID memberUUid;

	@Column(nullable = false, length = 255)
	private String title;

	@Column(nullable = false)
	private LocalDateTime regDt;

	private Long likeCnt;

	@OneToMany(mappedBy = "talk", cascade = CascadeType.ALL)
	private List<Message> messages;

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public static Talk from(TalkRequest data, UUID crntMemberUuid) {
		return Talk.builder()
			.memberUUid(crntMemberUuid)
			.title(data.getTitle())
			.regDt(LocalDateTime.now())
			.likeCnt(0L)
			.build();
	}

	public TalkDetailResponse toDetailResponse(boolean isLiked, Long likeCnt, MemberResponse writerInfo) {

		long regDt = this.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
		long updDt = this.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

		List<MessageResponse> messageResponses = this.getMessages()
			.stream()
			.map(message -> message.toMessageResponse())
			.collect(Collectors.toList());

		return TalkDetailResponse.builder()
			.title(this.getTitle())
			.isLiked(isLiked)
			.likeCnt(likeCnt)
			.regDt(regDt)
			.updDt(updDt)
			.messages(messageResponses)
			.writerMember(writerInfo)
			.build();
	}
}
