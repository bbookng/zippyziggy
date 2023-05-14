package com.zippyziggy.prompt.prompt.dto.response;

import com.zippyziggy.prompt.prompt.model.PromptReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PromptReportResponse {
    private UUID memberUuid;
    private UUID promptUuid;
    private String promptTitle;
    private String promptCategory;
    private String promptLanguages;
    private UUID originMemberUuid;
    private String content;
    private LocalDateTime regDt;

    public static Page<PromptReportResponse> from(Page<PromptReport> list) {
        Page<PromptReportResponse> promptReportResponses = list.map(m ->
                PromptReportResponse.builder()
                        .memberUuid(m.getMemberUuid())
                        .promptUuid(m.getPrompt().getPromptUuid())
                        .promptTitle(m.getPrompt().getTitle())
                        .promptCategory(m.getPrompt().getCategory().getDescription())
                        .promptLanguages(m.getPrompt().getLanguages().getDescription())
                        .originMemberUuid(m.getPrompt().getMemberUuid())
                        .content(m.getContent())
                        .regDt(m.getRegDt()).build());
        return promptReportResponses;
    }

}
