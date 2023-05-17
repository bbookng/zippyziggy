package com.zippyziggy.prompt.prompt.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.QPrompt;
import com.zippyziggy.prompt.prompt.model.QPromptBookmark;
import com.zippyziggy.prompt.prompt.model.StatusCode;
import java.util.stream.Collectors;
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

        long totalCount = query.fetchCount();

        OrderSpecifier orderSpecifier = new OrderSpecifier<>(Order.DESC, qPrompt.likeCnt);
        String property = pageable.getSort().stream().collect(Collectors.toList()).get(0).getProperty();
        switch (property) {
            case "likeCnt":
                orderSpecifier = new OrderSpecifier<>(Order.DESC, qPrompt.likeCnt);
                break;
            case "hit":
                orderSpecifier = new OrderSpecifier<>(Order.DESC, qPrompt.hit);
                break;
            case "regDt":
                orderSpecifier = new OrderSpecifier<>(Order.DESC, qPrompt.regDt);
                break;
        }

        List<Prompt> promptList = query
                .orderBy(orderSpecifier)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(promptList, pageable, totalCount);

    }


}
