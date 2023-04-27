package com.zippyziggy.prompt.prompt.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zippyziggy.prompt.prompt.model.Prompt;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import com.zippyziggy.prompt.prompt.model.QPrompt;
import com.zippyziggy.prompt.prompt.model.QPromptLike;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PromptLikeRepositoryImpl implements PromptLikeCustomRepository {

    private final JPAQueryFactory queryFactory;


    @Override
    public List<Prompt> findAllPromptsByMemberUuid(UUID memberUuid, Pageable pageable) {

//        QPrompt qPrompt = QPrompt.prompt;
        QPromptLike qPromptLike = QPromptLike.promptLike;
        System.out.println("offset" + pageable.getOffset());
        System.out.println("limit" + pageable.getPageSize());
        System.out.println("memberUuid = " + memberUuid);
//        List<Prompt> prompts = queryFactory
//                .selectFrom(qPrompt)
//                .leftJoin(qPromptLike)
//                .on(qPromptLike.prompt.id.eq(qPrompt.id))
//                .distinct()
//                .where(qPromptLike.memberUuid.eq(memberUuid))
//                .offset(pageable.getOffset())
//                .limit(pageable.getPageSize())
//                .fetch();
        List<PromptLike> prompts = queryFactory
                .selectFrom(qPromptLike)
                .where(qPromptLike.memberUuid.eq(memberUuid))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        System.out.println("prompts = " + prompts);
        return null;
    }
}
