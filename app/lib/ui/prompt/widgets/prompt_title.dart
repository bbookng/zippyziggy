import 'package:app/app_theme.dart';
import 'package:app/data/model/prompt_model.dart';
import 'package:app/data/providers/prompt_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class PromptTitle extends StatelessWidget {
  final PromptModel prompt;
  const PromptTitle({
    super.key,
    required this.prompt,
  });

  @override
  Widget build(BuildContext context) {
    int likeCnt = prompt.likeCnt!;
    bool isLiked = prompt.isLiked!;
    bool isBookmarked = prompt.isBookmarked!;
    Map<String, String> categoryMap = {
      'STUDY': '학업',
      'FUN': '오락',
      'BUSINESS': '비즈니스',
      'PROGRAMMING': '프로그래밍',
      'ETC': '기타',
    };
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                categoryMap[prompt.category]!,
                style: AppTheme.body2.copyWith(),
              ),
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      Provider.of<PromptProvider>(context, listen: false)
                          .promptLike(promptUuid: prompt.promptUuid)
                          .then(
                            (value) => {
                              if (value)
                                {isLiked = true, likeCnt += 1}
                              else
                                {isLiked = false, likeCnt -= 1}
                            },
                          );
                    },
                    icon: Icon(
                      isLiked ? Icons.favorite : Icons.favorite_border_outlined,
                      color: Colors.red,
                      size: 16,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    constraints: const BoxConstraints(),
                  ),
                  Text(
                    '$likeCnt',
                    style: AppTheme.body1.copyWith(fontSize: 16),
                  ),
                  IconButton(
                    onPressed: () {
                      Provider.of<PromptProvider>(context, listen: false)
                          .promptBookmark(promptUuid: prompt.promptUuid)
                          .then(
                            (value) => {
                              if (value)
                                {isBookmarked = true}
                              else
                                {isBookmarked = false},
                            },
                          );
                    },
                    icon: Icon(
                      isBookmarked
                          ? Icons.bookmark
                          : Icons.bookmark_border_outlined,
                      color: Colors.green,
                      size: 16,
                    ),
                    padding: const EdgeInsets.only(left: 10),
                    constraints: const BoxConstraints(),
                  )
                ],
              ),
            ],
          ),
          Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.75,
                child: Text(
                  prompt.title!,
                  style: AppTheme.headline.copyWith(),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 5,
          ),
          Row(
            children: [
              const Text('마지막 업데이트: '),
              Text(
                DateFormat('yyyy.MM.dd').format(
                  DateTime.fromMillisecondsSinceEpoch(prompt.updDt! * 1000),
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 10,
          ),
          if (prompt.writer?.writerImg != null)
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: Image.network(
                    prompt.writer!.writerImg!,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '작성자',
                        style: AppTheme.caption.copyWith(
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        prompt.writer!.writerNickname!,
                        style: AppTheme.body1.copyWith(
                          color: Colors.white,
                        ),
                      )
                    ],
                  ),
                )
              ],
            ),
        ],
      ),
    );
  }
}
