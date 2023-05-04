package com.zippyziggy.prompt.prompt.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.QPrompt;
import com.zippyziggy.prompt.prompt.model.QPromptBookmark;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PromptBookmarkRepositoryImpl implements PromptBookmarkCustomRepository {

    private final JPAQueryFactory queryFactory;


    @Override
    public Page<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable) {

        QPrompt qPrompt = QPrompt.prompt;
        QPromptBookmark qPromptBookmark = QPromptBookmark.promptBookmark;

        JPQLQuery<Prompt> query = queryFactory.selectFrom(qPrompt)
                .leftJoin(qPromptBookmark)
                .on(qPromptBookmark.prompt.id.eq(qPrompt.id))
                .distinct()
                .where(qPromptBookmark.memberUuid.eq((memberUuid))
                        .and(qPrompt.statusCode.eq(StatusCode.OPEN)));
        System.out.println("query = 뭐지??? 이게 안 받아지나???" + query);
        long totalCount = query.fetchCount();
        System.out.println("totalCount = 이건/" + totalCount);
        List<Prompt> promptList = query.orderBy(qPromptBookmark.regDt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        System.out.println("promptList = 설마 이것도???" + promptList);

        return new PageImpl<>(promptList, pageable, totalCount);

    }
}
