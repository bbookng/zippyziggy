package com.zippyziggy.prompt.common.kafka;

import com.zippyziggy.prompt.prompt.model.PromptBookmark;
import com.zippyziggy.prompt.prompt.model.PromptClick;
import com.zippyziggy.prompt.prompt.model.PromptComment;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptClickRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.model.TalkComment;
import com.zippyziggy.prompt.talk.model.TalkLike;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
import com.zippyziggy.prompt.talk.repository.TalkLikeRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Transactional
@RequiredArgsConstructor
@Service
@Slf4j
public class KafkaConsumer {

    private final PromptLikeRepository promptLikeRepository;
    private final PromptCommentRepository promptCommentRepository;
    private final PromptBookmarkRepository promptBookmarkRepository;
    private final TalkRepository talkRepository;
    private final TalkLikeRepository talkLikeRepository;
    private final TalkCommentRepository talkCommentRepository;
    private final PromptClickRepository promptClickRepository;

    @SuppressWarnings("ResultOfMethodCallIgnored")
    @KafkaListener(topics = "delete-member-topic")
    public void deleteMember(String kafkaMessage) {
        log.info("Kafka ChatGptMessage: ->" + kafkaMessage);

        UUID memberUuid = UUID.fromString(kafkaMessage);

        List<PromptLike> promptLikes = promptLikeRepository.findAllByMemberUuid(memberUuid);
        List<PromptComment> promptComments = promptCommentRepository.findAllByMemberUuid(memberUuid);
        List<PromptBookmark> promptBookmarks = promptBookmarkRepository.findAllByMemberUuid(memberUuid);
        List<Talk> talkList = talkRepository.findAllByMemberUuid(memberUuid);
        List<TalkComment> talkComments = talkCommentRepository.findAllByMemberUuid(memberUuid);
        List<TalkLike> talkLikes = talkLikeRepository.findAllByMemberUuid(memberUuid);
        List<PromptClick> promptClicks = promptClickRepository.findAllByMemberUuid(memberUuid);


        if (promptLikes != null) {
            promptLikes.stream().map(promptLike -> {promptLikeRepository.delete(promptLike);
                return "프롬프트 좋아요 삭제 완료";
            });
        }

        if (promptComments != null) {
            promptComments.stream().map(promptComment -> {promptCommentRepository.delete(promptComment);
                return "프롬프트 댓글 삭제 완료";
            });
        }

        if (promptBookmarks != null) {
            promptBookmarks.stream().map(promptBookmark -> {promptBookmarkRepository.delete(promptBookmark);
                return "프롬프트 북마크 삭제 완료";
            });
        }

        if (talkList != null) {
            talkList.stream().map(talk -> {talkRepository.delete(talk);
                return "톡 삭제 완료";
            });
        }

        if (talkComments != null) {
            talkComments.stream().map(talkComment -> {talkCommentRepository.delete(talkComment);
                return "톡 댓글 삭제 완료";
            });
        }

        if (talkLikes != null) {
            talkLikes.stream().map(talkLike -> {talkLikeRepository.delete(talkLike);
            return "톡 좋아요 삭제 완료";
            });
        }

        if (promptClicks != null) {
            promptClicks.stream().map(promptClick -> {
                promptClickRepository.delete(promptClick);
            return "최근 본 프롬프트 삭제 완료";
            });
        }

    }
}
