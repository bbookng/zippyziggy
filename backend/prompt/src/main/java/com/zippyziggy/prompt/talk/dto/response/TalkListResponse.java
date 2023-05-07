package com.zippyziggy.prompt.talk.dto.response;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.WriterResponse;
import com.zippyziggy.prompt.talk.model.Talk;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TalkListResponse {

	private Long talkId;
	private String title;
	private String question;
	private String answer;
	private WriterResponse writer;
	private Long likeCnt;
	private Long commentCnt;
	private Boolean isLiked;

	public static TalkListResponse from(
			Long talkId,
			String title,
			String question,
			String answer,
			MemberResponse member,
			Long likeCnt,
			Long commentCnt,
			Boolean isLiked
	) {
		return TalkListResponse.builder()
				.talkId(talkId)
				.title(title)
				.question(question)
				.answer(answer)
				.writer(member.toWriterResponse())
				.likeCnt(likeCnt)
				.commentCnt(commentCnt)
				.isLiked(isLiked)
				.build();
	}
}
