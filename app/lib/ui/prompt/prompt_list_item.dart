import 'package:app/app_theme.dart';
import 'package:app/data/model/prompt_model.dart';
import 'package:app/data/providers/prompt_provider.dart';
import 'package:app/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptListItem extends StatelessWidget {
  const PromptListItem({
    super.key,
    required this.prompt,
  });

  final PromptModel prompt;

  @override
  Widget build(BuildContext context) {
    bool isBookmarked = prompt.isBookmarked!;
    return Card(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              // gradient: LinearGradient(
              //   colors: [
              //     Colors.black.withOpacity(0.3),
              //     Colors.black.withOpacity(0.2),
              //   ],
              //   // transform: const GradientRotation(0),
              //   begin: Alignment.topLeft,
              //   end: Alignment.bottomRight,
              // ),
              color: Colors.black.withOpacity(0.2),
            ),
            child: ListTile(
              onTap: () {
                Navigator.pushNamed(context, RoutesName.promptDetail,
                    arguments: prompt);
              },
              // leading: const Icon(
              //   Icons.ads_click,
              //   color: Colors.blue,
              // ),
              title: Text(
                '${prompt.title}',
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: AppTheme.title.copyWith(
                  color: Colors.white,
                ),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(
                  'by ${prompt.writer?.writerNickname ?? ""}',
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
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
