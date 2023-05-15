import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:flutter/material.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';

class BookmarkedListItem extends StatefulWidget {
  const BookmarkedListItem({
    super.key,
    required this.prompt,
  });

  final PromptModel prompt;

  @override
  State<BookmarkedListItem> createState() => _BookmarkedListItemState();
}

class _BookmarkedListItemState extends State<BookmarkedListItem> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ChatProvider>(context);
    final navigator = Navigator.of(context);

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
              onTap: () async {
                await provider.getPrompt(widget.prompt.promptUuid!);
              },
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
            ),
          ),
        ],
      ),
    );
  }
}
