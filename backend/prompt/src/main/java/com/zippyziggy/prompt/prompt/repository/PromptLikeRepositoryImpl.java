package com.zippyziggy.prompt.prompt.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.QPrompt;
import com.zippyziggy.prompt.prompt.model.QPromptLike;
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
public class PromptLikeRepositoryImpl implements PromptLikeCustomRepository {

    private final JPAQueryFactory queryFactory;


    @Override
    public Page<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable) {

        QPrompt qPrompt = QPrompt.prompt;
        QPromptLike qPromptLike = QPromptLike.promptLike;

        JPQLQuery<Prompt> query = queryFactory.selectFrom(qPrompt)
                .leftJoin(qPromptLike)
                .on(qPromptLike.prompt.id.eq(qPrompt.id))
                .distinct()
                .where(qPromptLike.memberUuid.eq(memberUuid)
                        .and(qPrompt.statusCode.eq(StatusCode.OPEN)));

        long totalCount = query.fetchCount();

        List<Prompt> promptList = query.orderBy(qPromptLike.regDt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(promptList, pageable, totalCount);
    }
}
