package com.zippyziggy.prompt.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zippyziggy.prompt.prompt.model.PromptBookmark;
import com.zippyziggy.prompt.prompt.model.PromptComment;
import com.zippyziggy.prompt.prompt.model.PromptLike;
import com.zippyziggy.prompt.prompt.repository.PromptBookmarkRepository;
import com.zippyziggy.prompt.prompt.repository.PromptCommentRepository;
import com.zippyziggy.prompt.prompt.repository.PromptLikeRepository;
import com.zippyziggy.prompt.talk.model.Talk;
import com.zippyziggy.prompt.talk.model.TalkComment;
import com.zippyziggy.prompt.talk.model.TalkLike;
import com.zippyziggy.prompt.talk.repository.TalkCommentRepository;
import com.zippyziggy.prompt.talk.repository.TalkLikeRepository;
import com.zippyziggy.prompt.talk.repository.TalkRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class KafkaConsumer {

    private final PromptLikeRepository promptLikeRepository;
    private final PromptCommentRepository promptCommentRepository;
    private final PromptBookmarkRepository promptBookmarkRepository;
    private final TalkRepository talkRepository;
    private final TalkLikeRepository talkLikeRepository;
    private final TalkCommentRepository talkCommentRepository;

    public KafkaConsumer(PromptLikeRepository promptLikeRepository, PromptCommentRepository promptCommentRepository,
        PromptBookmarkRepository promptBookmarkRepository, TalkRepository talkRepository,
        TalkLikeRepository talkLikeRepository, TalkCommentRepository talkCommentRepository) {
        this.promptLikeRepository = promptLikeRepository;
        this.promptCommentRepository = promptCommentRepository;
        this.promptBookmarkRepository = promptBookmarkRepository;
        this.talkRepository = talkRepository;
        this.talkLikeRepository = talkLikeRepository;
        this.talkCommentRepository = talkCommentRepository;
    }

    @SuppressWarnings("ResultOfMethodCallIgnored")
    @KafkaListener(topics = "delete-member-topic")
    public void deleteMember(String kafkaMessage) {
        log.info("Kafka Message: ->" + kafkaMessage);

        Map<Object, Object> map = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try {
            map = mapper.readValue(kafkaMessage, new TypeReference<Map<Object, Object>>() {
            });
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
        }
        UUID memberUuid = (UUID)map.get("memberUuid");

        List<PromptLike> promptLikes = promptLikeRepository.findAllByMemberUuid(memberUuid);
        List<PromptComment> promptComments = promptCommentRepository.findAllByMemberUuid(memberUuid);
        List<PromptBookmark> promptBookmarks = promptBookmarkRepository.findAllByMemberUuid(memberUuid);
        List<Talk> talkList = talkRepository.findAllByMemberUuid(memberUuid);
        List<TalkComment> talkComments = talkCommentRepository.findAllByMemberUuid(memberUuid);
        List<TalkLike> talkLikes = talkLikeRepository.findAllByMemberUuid(memberUuid);

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

    }
}
