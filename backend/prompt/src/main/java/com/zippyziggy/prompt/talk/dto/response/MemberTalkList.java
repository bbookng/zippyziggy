package com.zippyziggy.prompt.talk.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberTalkList {
    private Long totalTalksCnt;
    private Integer totalPageCnt;
    private List<MemberTalk> memberTalkList;

}
