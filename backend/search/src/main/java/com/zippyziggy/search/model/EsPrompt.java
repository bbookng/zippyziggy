package com.zippyziggy.search.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.Entity;
import lombok.Data;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(indexName = "test")
public class EsPrompt {

//    @Id
//    private String id;        // ES doc create 시 자동 생성되는 id

    @Field(type = FieldType.Long, name = "prompt_id")
    private Long promptId;   // 내부 로직에서 사용하는 Auto Increment id

    @Field(type = FieldType.Long, name = "user_nickname")
    private Long userNickname;      // 더미에 필드명을 닉네임으루 해둠 .. 나중에 userId로 변경

    @Field(type = FieldType.Text, name = "title")
    private String title;

    @Field(type = FieldType.Text, name = "description")
    private String description;

    @Field(type = FieldType.Integer, name = "hit")
    private Integer hit;

    @Field(type = FieldType.Integer, name = "like_cnt")
    private Integer likeCnt;

    @Field(type = FieldType.Text, name = "reg_dt")  // 스트링아니게저장
    private String regDt;

    @Field(type = FieldType.Text, name = "upd_dt")
    private String updDt;

    @Field(type = FieldType.Long, name = "category")
    private Long category;

    @Field(type = FieldType.Text, name = "prefix")
    private String prefix;

    @Field(type = FieldType.Text, name = "suffix")
    private String suffix;

    @Field(type = FieldType.Text, name = "example")
    private String example;

    @Field(type = FieldType.Text, name = "prompt_uuid")
    @JsonProperty("promptUuid")
    private String promptUuid;

}
