package com.zippyziggy.prompt.talk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import com.zippyziggy.prompt.prompt.dto.request.PromptMessageRequest;
import com.zippyziggy.prompt.talk.dto.request.MessageRequest;
import com.zippyziggy.prompt.talk.dto.response.MessageResponse;

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
public class Message {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "talk_id", nullable = false)
	private Talk talk;

	@Column(nullable = false)
	private Role role;

	@Lob
	@Column(nullable = false)
	private String content;

	public static Message from(MessageRequest data, Talk talk) {
		return  Message.builder()
			.talk(talk)
			.role(data.getRole())
			.content(data.getContent())
			.build();
	}

	public MessageResponse toMessageResponse() {
		return new MessageResponse(this.getRole().getDescription().toUpperCase(), this.getContent());
	}

}
