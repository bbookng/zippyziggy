package com.zippyziggy.search.model;

import javax.persistence.Id;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "test")
public class EsPrompt {

    @Id
    private String id;        // ES doc create 시 자동 생성되는 id

    @Field(type = FieldType.Long, name = "prompt_id")
    private Long promptId;    // 내부 로직에서 사용하는 Auto Increment id

    @Field(type = FieldType.Long, name = "user_id")
    private Long userId;

    @Field(type = FieldType.Text, name = "title")
    private String title;

    @Field(type = FieldType.Text, name = "description")
    private String description;

    @Field(type = FieldType.Integer, name = "hit")
    private Integer hit;

    @Field(type = FieldType.Integer, name = "like_cnt")
    private Integer likeCnt;

    @Field(type = FieldType.Date, name = "reg_dt")
    private String regDt;

    @Field(type = FieldType.Date, name = "upd_dt")
    private String updDt;

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
}
