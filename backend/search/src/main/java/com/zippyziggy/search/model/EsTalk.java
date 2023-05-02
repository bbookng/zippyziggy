package com.zippyziggy.search.model;

import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Document(indexName = "talk")
public class EsTalk {

	@Id
	private Long id;

	@Field(type = FieldType.Text, name = "prompt_uuid")
	private String promptUuid;

	@Field(type = FieldType.Text, name = "member_uuid")
	private String memberUUid;

	@Field(type = FieldType.Text, name = "title")
	private String title;

	@Field(type = FieldType.Long, name = "reg_dt")
	private LocalDateTime regDt;

	@Field(type = FieldType.Long, name = "like_cnt")
	private Long likeCnt;

	private List<EsMessage> esMessages;

//	public static EsTalk of (TalkRequest data, UUID crntMemberUuid) {
//		return EsTalk.builder()
//			.memberUUid(crntMemberUuid)
//			.title(data.getTitle())
//			.regDt(LocalDateTime.now())
//			.likeCnt(0L)
//			.build();
//	}

	private class EsMessage {
		private String role;
		private String content;
	}

}
