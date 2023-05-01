package com.zippyziggy.prompt.prompt.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Getter
public class PromptClick {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(nullable = false, columnDefinition = "BINARY(16)")
    private UUID memberUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_uuid", nullable = false)
    private Prompt prompt;

    private LocalDateTime regDt;

    public static PromptClick from(Prompt prompt, UUID memberUuid) {
        return PromptClick.builder()
                .memberUuid(memberUuid)
                .prompt(prompt)
                .regDt(LocalDateTime.now()).build();
    }
}
