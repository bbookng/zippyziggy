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

import com.zippyziggy.prompt.talk.dto.request.EsTalkRequest;
import com.zippyziggy.prompt.talk.dto.response.TalkResponse;

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
	private UUID memberUuid;

	@Column(nullable = false, length = 255)
	private String title;

	@Column(nullable = false)
	private LocalDateTime regDt;

	private Long likeCnt;

	private Long hit;

	@OneToMany(mappedBy = "talk", cascade = CascadeType.ALL)
	private List<Message> messages;

	public void setPrompt(Prompt prompt) {
		this.prompt = prompt;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public void setLikeCnt(Long likeCnt) {
		this.likeCnt = likeCnt;
	}

	public static Talk from(TalkRequest data, UUID crntMemberUuid) {
		return Talk.builder()
			.memberUuid(crntMemberUuid)
			.title(data.getTitle())
			.regDt(LocalDateTime.now())
			.likeCnt(0L)
			.hit(0L)
			.build();
	}

	public TalkResponse toTalkResponse() {
		List<MessageResponse> messageResponses = this.messages.stream()
				.map(m -> m.toMessageResponse()).collect(Collectors.toList());
		return TalkResponse.builder()
				.title(this.title)
				.regDt(this.regDt)
				.memberUuid(this.memberUuid)
				.messages(messageResponses)
				.build();
	}

	public TalkDetailResponse toDetailResponse(boolean isLiked, Long likeCnt, MemberResponse memberResponse) {

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
			.writer(memberResponse.toWriterResponse())
			.build();
	}

	public EsTalkRequest toEsTalkRequest() {

		List<MessageResponse> messageResponses = this.getMessages()
				.stream()
				.map(message -> message.toMessageResponse())
				.collect(Collectors.toList());

		return EsTalkRequest.builder()
				.talkId(this.id)
				.promptUuid(this.getPrompt().getPromptUuid().toString())
				.memberUuid(this.getMemberUuid().toString())
				.title(this.getTitle())
				.regDt(this.regDt.atZone(ZoneId.systemDefault()).toInstant().getEpochSecond())
				.likeCnt(this.likeCnt)
				.hit(this.hit)
				.esMessages(messageResponses)
				.build();
	}
}
