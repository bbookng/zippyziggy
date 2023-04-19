package com.zippyziggy.search.model;

import java.time.LocalDateTime;
import javax.persistence.Id;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "test")
public class EsPrompt {

    @Id
    private Long id;

    @Field(type = FieldType.Long)
    private Long userId;

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Integer)
    private Integer hit;

    @Field(type = FieldType.Date_Nanos)
    private LocalDateTime regDt;

    @Field(type = FieldType.Date_Nanos)
    private LocalDateTime updDt;

    @Field(type = FieldType.Keyword)
    private Category category;

    @Field(type = FieldType.Text)
    private String prefix;

    @Field(type = FieldType.Text)
    private String suffix;

    @Field(type = FieldType.Text)
    private String example;

    @Field(type = FieldType.Binary)
    private String promptUuid;

    @Field(type = FieldType.Integer)
    private Long likeCnt;

}
