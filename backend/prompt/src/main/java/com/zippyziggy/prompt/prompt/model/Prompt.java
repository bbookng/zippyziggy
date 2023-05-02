package com.zippyziggy.prompt.prompt.model;

import com.zippyziggy.prompt.prompt.dto.request.EsPromptRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptCntRequest;
import com.zippyziggy.prompt.prompt.dto.request.PromptRequest;
import com.zippyziggy.prompt.prompt.dto.response.PromptMessageResponse;
import com.zippyziggy.prompt.prompt.dto.response.PromptDetailResponse;
import com.zippyziggy.prompt.talk.model.Talk;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter @Setter
public class Prompt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID memberUuid;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false)
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
	@Column(nullable = false)
	private String example;

	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	@Column(nullable = false, columnDefinition = "BINARY(16)")
	private UUID promptUuid;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<PromptComment> promptComments;

	private Long likeCnt;

	@OneToMany(mappedBy = "prompt", cascade = CascadeType.ALL)
	private List<Talk> talks;

	@Column(columnDefinition = "BINARY(16)")
	private UUID originPromptUuid;

	@Column(nullable = false, length = 10)
	private Languages languages;

	public static Prompt from(PromptRequest data, UUID memberUuid, String thumbnailUrl) {

		return Prompt.builder()
				.title(data.getTitle())
				.category(data.getCategory())
				.memberUuid(memberUuid)
				.description(data.getDescription())
				.regDt(LocalDateTime.now())
				.updDt(LocalDateTime.now())
				.prefix(data.getMessage().getPrefix())
				.example(data.getMessage().getExample())
				.suffix(data.getMessage().getSuffix())
				.promptUuid(UUID.randomUUID())
				.languages(Languages.KOREAN)
				.hit(0)
				.likeCnt(0L)
				.thumbnail(thumbnailUrl)
				.build();

	}

	public PromptDetailResponse toDetailResponse(boolean isLiked, boolean isBookmarked) {
		PromptMessageResponse message = new PromptMessageResponse(this.getPrefix(), this.getExample(), this.getSuffix());
		long regDt = this.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();
		long updDt = this.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond();

		return PromptDetailResponse.builder()
				.messageResponse(message)
				.title(this.getTitle())
				.description(this.getDescription())
				.thumbnail(this.getThumbnail())
				.category(this.getCategory().getDescription().toUpperCase())
				.isBookmarked(isBookmarked)
				.isLiked(isLiked)
				.isForked(this.isForked())
				.likeCnt(this.getLikeCnt())
				.regDt(regDt)
				.updDt(updDt)
				.hit(this.getHit())
				.build();
	}

	public EsPromptRequest toEsPromptRequest() {
		return EsPromptRequest.builder()
			.promptId(this.id)
			.userId(this.memberUuid)
			.title(this.title)
			.description(this.description)
			.hit(this.hit)
			.likeCnt(this.likeCnt.intValue())
			.regDt(this.regDt.atZone(ZoneId.systemDefault()).toEpochSecond())
			.updDt(this.updDt.atZone(ZoneId.systemDefault()).toEpochSecond())
			.category(this.category.getDescription().toUpperCase())
			.prefix(this.prefix)
			.suffix(this.suffix)
			.example(this.example)
			.promptUuid(this.promptUuid)
			.originalPromptUuid(this.originPromptUuid)
			.build();
	}

	public boolean isForked() {
		return (this.originPromptUuid != null);
	}

	public PromptCntRequest toPromptHitRequest() {
		return PromptCntRequest.builder()
				.promptUuid(this.promptUuid.toString())
				.cnt(this.hit)
				.build();
	}

	public PromptCntRequest toPromptLikeCntRequest() {
		return PromptCntRequest.builder()
				.promptUuid(this.promptUuid.toString())
				.cnt(this.likeCnt.intValue())
				.build();
	}

}
