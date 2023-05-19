import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class PromptTitle extends StatefulWidget {
  final PromptDetailModel prompt;
  final String promptUuid;
  final Function handleBookmark;
  const PromptTitle({
    super.key,
    required this.prompt,
    required this.promptUuid,
    required this.handleBookmark,
  });

  @override
  State<PromptTitle> createState() => _PromptTitleState();
}

class _PromptTitleState extends State<PromptTitle> {
  late int likeCnt;
  late bool isLiked;
  late bool isBookmarked;

  @override
  void initState() {
    super.initState();
    if (widget.prompt.likeCnt != null) {
      likeCnt = widget.prompt.likeCnt!;
    } else {
      likeCnt = 0;
    }
    isLiked = widget.prompt.isLiked!;
    isBookmarked = widget.prompt.isBookmarked!;
  }

  @override
  Widget build(BuildContext context) {
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
          // 카테고리, 좋아요, 북마크
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (widget.prompt.category != null)
                Text(
                  categoryMap[widget.prompt.category]!,
                  style: AppTheme.body2.copyWith(fontSize: 18),
                ),
              Row(
                children: [
                  IconButton(
                    onPressed: () async {
                      final data = await Provider.of<PromptProvider>(context,
                              listen: false)
                          .promptLike(promptUuid: widget.promptUuid);
                      if (data['result'] == 'SUCCESS') {
                        if (isLiked == true) {
                          isLiked = false;
                          likeCnt -= 1;
                        } else {
                          isLiked = true;
                          likeCnt += 1;
                        }
                        setState(() {});
                      }
                    },
                    icon: Icon(
                      isLiked ? Icons.favorite : Icons.favorite_border_outlined,
                      color: Colors.red,
                      size: 18,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    constraints: const BoxConstraints(),
                  ),
                  Text(
                    '$likeCnt',
                    style: AppTheme.body1.copyWith(fontSize: 18),
                  ),
                  IconButton(
                    onPressed: () async {
                      final data = await Provider.of<PromptProvider>(context,
                              listen: false)
                          .promptBookmark(promptUuid: widget.promptUuid);
                      if (data['result'] == 'SUCCESS') {
                        isBookmarked = !isBookmarked;
                        widget.handleBookmark();
                        setState(() {});
                      }
                    },
                    icon: Icon(
                      isBookmarked
                          ? Icons.bookmark
                          : Icons.bookmark_border_outlined,
                      color: Colors.green,
                      size: 18,
                    ),
                    padding: const EdgeInsets.only(left: 10),
                    constraints: const BoxConstraints(),
                  )
                ],
              ),
            ],
          ),

          // 제목
          Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (widget.prompt.title != null)
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.75,
                  child: Text(
                    widget.prompt.title!,
                    style: AppTheme.headline.copyWith(),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                  ),
                ),
            ],
          ),
          const SizedBox(
            height: 5,
          ),

          // 마지막 업데이트
          if (widget.prompt.updDt != null)
            Row(
              children: [
                const Text(
                  '마지막 업데이트: ',
                  style: AppTheme.caption,
                ),
                Text(
                  DateFormat('yyyy.MM.dd').format(
                    DateTime.fromMillisecondsSinceEpoch(
                        widget.prompt.updDt! * 1000),
                  ),
                  style: AppTheme.caption,
                ),
              ],
            ),
          const SizedBox(
            height: 20,
          ),

          // 작성자 정보
          if (widget.prompt.writer?.writerImg != null)
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: widget.prompt.writer?.writerImg != null
                      ? Image.network(
                          widget.prompt.writer!.writerImg!,
                          width: 40,
                          height: 40,
                          fit: BoxFit.cover,
                        )
                      : const SizedBox(
                          height: 40,
                          width: 40,
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
                        widget.prompt.writer!.writerNickname!,
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
