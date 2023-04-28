package com.zippyziggy.search.model;

import com.zippyziggy.search.dto.request.SyncEsPrompt;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Builder
@Document(indexName = "test")
public class EsPrompt {

    @Id
    private String Id;        // Elasticsearch doc id

    @Field(type = FieldType.Long, name = "prompt_id")
    private Long promptId;    // 내부 로직에서 사용하는 Auto Increment id

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

    public static EsPrompt of(SyncEsPrompt esPrompt) {
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
            .promptUuid(String.valueOf(esPrompt.getPromptUuid()))
            .originalPromptUuid(String.valueOf(esPrompt.getOriginalPromptUuid()))
            .build();
    }
}
