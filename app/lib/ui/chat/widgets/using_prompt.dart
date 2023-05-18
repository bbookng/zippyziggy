import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:flutter/material.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';

class PromptInfo extends StatefulWidget {
  const PromptInfo({
    super.key,
    required this.prompt,
  });

  final PromptDetailModel prompt;

  @override
  State<PromptInfo> createState() => _PromptInfoState();
}

class _PromptInfoState extends State<PromptInfo> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ChatProvider>(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.green,
          ),
          width: MediaQuery.of(context).size.width * 0.75,
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                ),
                child: ListTile(
                  title: const Text(
                    '사용중인 프롬프트',
                    style: AppTheme.subtitle,
                  ),
                  subtitle: Text(
                    '${widget.prompt.title}',
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                    style: AppTheme.caption,
                  ),
                  trailing: IconButton(
                    onPressed: () {
                      provider.removePrompt();
                    },
                    icon: const Icon(Icons.cancel),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(0),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
