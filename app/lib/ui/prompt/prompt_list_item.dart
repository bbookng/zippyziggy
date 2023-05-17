import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/utils/routes/route.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptListItem extends StatefulWidget {
  const PromptListItem({
    super.key,
    required this.prompt,
  });

  final PromptModel prompt;

  @override
  State<PromptListItem> createState() => _PromptListItemState();
}

class _PromptListItemState extends State<PromptListItem> {
  late bool isBookmarked;

  @override
  void initState() {
    super.initState();
    if (widget.prompt.isBookmarked != null) {
      isBookmarked = widget.prompt.isBookmarked!;
    }
  }

  @override
  Widget build(BuildContext context) {
    // 북마크
    handleBookmark() {
      isBookmarked = !isBookmarked;
      setState(() {});
    }

    return Card(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            height: 90,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.2),
            ),
            child: ListTile(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  RoutesName.promptDetail,
                  arguments: DetailArguments(
                    widget.prompt.promptUuid!,
                    handleBookmark,
                  ),
                );
              },
              // leading: const Icon(
              //   Icons.ads_click,
              //   color: Colors.blue,
              // ),
              title: Text(
                '${widget.prompt.title}',
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: AppTheme.title.copyWith(
                  color: Colors.white,
                ),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(
                  'by ${widget.prompt.writer?.writerNickname ?? ""}',
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                  style: AppTheme.subtitle.copyWith(
                    color: Colors.white,
                  ),
                ),
              ),
              trailing: IconButton(
                constraints: const BoxConstraints(),
                padding: const EdgeInsets.all(0),
                onPressed: () async {
                  final data =
                      await Provider.of<PromptProvider>(context, listen: false)
                          .promptBookmark(promptUuid: widget.prompt.promptUuid);
                  if (data['result'] == 'SUCCESS') {
                    handleBookmark();
                  }
                },
                icon: Icon(
                  isBookmarked
                      ? Icons.bookmark
                      : Icons.bookmark_border_outlined,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
