package com.zippyziggy.search.model;

import com.zippyziggy.search.dto.request.server.SyncEsPrompt;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Document(indexName = "prompt")
public class EsPrompt {

    @Id
    private String Id;        // Elasticsearch doc id

    @Field(type = FieldType.Long, name = "prompt_id")
    private Long promptId;    // Auto Increment id

    @Field(type = FieldType.Text, name = "user_id")
    private String userId;

    @Field(type = FieldType.Text, name = "title")
    private String title;

    @Field(type = FieldType.Text, name = "description")
    private String description;

    @Field(type = FieldType.Integer, name = "hit")
    private Integer hit;

    @Field(type = FieldType.Integer, name = "like_cnt")
    private Integer likeCnt;

    @Field(type = FieldType.Long, name = "reg_dt")
    private Long regDt;

    @Field(type = FieldType.Long, name = "upd_dt")
    private Long updDt;

    @Field(type = FieldType.Text, name = "category")
    private String category;

    @Field(type = FieldType.Text, name = "prefix")
    private String prefix;

    @Field(type = FieldType.Text, name = "suffix")
    private String suffix;

    @Field(type = FieldType.Text, name = "example")
    private String example;

    @Field(type = FieldType.Text, name = "prompt_uuid")
    private String promptUuid;

    @Field(type = FieldType.Text, name = "original_prompt_uuid")
    private String originalPromptUuid;

    public void setHit(Integer hit) { this.hit = hit; }

    public void setLikeCnt(Integer likeCnt) { this.likeCnt = likeCnt; }

    public static EsPrompt of (SyncEsPrompt esPrompt) {

        final String originalPromptUuid = (null != esPrompt.getOriginalPromptUuid())
            ? esPrompt.getOriginalPromptUuid().toString()
            : null;

        return EsPrompt.builder()
            .promptId(esPrompt.getPromptId())
            .userId(String.valueOf(esPrompt.getUserId()))
            .title(esPrompt.getTitle())
            .description(esPrompt.getDescription())
            .hit(esPrompt.getHit())
            .likeCnt(esPrompt.getHit())
            .regDt(esPrompt.getRegDt())
            .updDt(esPrompt.getUpdDt())
            .category(esPrompt.getCategory())
            .prefix(esPrompt.getPrefix())
            .suffix(esPrompt.getSuffix())
            .example(esPrompt.getExample())
            .promptUuid(esPrompt.getPromptUuid().toString())
            .originalPromptUuid(originalPromptUuid)
            .build();
    }
}
