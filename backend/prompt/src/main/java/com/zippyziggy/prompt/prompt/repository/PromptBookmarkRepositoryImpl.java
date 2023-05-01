package com.zippyziggy.prompt.prompt.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.QPrompt;
import com.zippyziggy.prompt.prompt.model.QPromptBookmark;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PromptBookmarkRepositoryImpl implements PromptBookmarkCustomRepository {

    private final JPAQueryFactory queryFactory;


    @Override
    public List<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable) {

        QPrompt qPrompt = QPrompt.prompt;
        QPromptBookmark qPromptBookmark = QPromptBookmark.promptBookmark;

        return queryFactory
                .selectFrom(qPrompt)
                .leftJoin(qPromptBookmark)
                .on(qPromptBookmark.prompt.id.eq(qPrompt.id))
                .orderBy(
                        qPromptBookmark.regDt.desc()
                )
                .distinct()
                .where(qPromptBookmark.memberUuid.eq(memberUuid))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
