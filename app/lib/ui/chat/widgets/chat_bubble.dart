import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';

class ChatBubble extends StatelessWidget {
  const ChatBubble({
    super.key,
    required this.isMe,
    required this.message,
    this.prompt,
  });

  final bool isMe;
  final String message;
  final PromptDetailModel? prompt;

  @override
  Widget build(BuildContext context) {
    final myStyleSheet =
        MarkdownStyleSheet.fromTheme(Theme.of(context)).copyWith(
      p: AppTheme.body1.copyWith(
        fontSize: 14,
        color: Colors.white,
      ),
    );
    return Row(
      mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Container(
          decoration: BoxDecoration(
            color: isMe ? Colors.green : AppTheme.darkGrey,
            borderRadius: BorderRadius.circular(12),
          ),
          constraints:
              BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          child: Column(
            children: [
              MarkdownBody(
                data: message,
                styleSheet: myStyleSheet,
                onTapLink: (text, url, title) {
                  launchUrl(Uri.parse(url!));
                },
              ),
              // Text(
              //   message,
              //   style: const TextStyle(
              //     color: Colors.white,
              //   ),
              // ),
              // if (prompt != null)
              //   Text(
              //     '${prompt!.title}',
              //     style: AppTheme.caption.copyWith(fontSize: 10),
              //   )
            ],
          ),
        ),
      ],
    );
  }
}
