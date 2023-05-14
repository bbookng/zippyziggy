import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:flutter/material.dart';

class PromptIntroduction extends StatelessWidget {
  final PromptDetailModel prompt;
  const PromptIntroduction({
    super.key,
    required this.prompt,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        prompt.thumbnail != null
            ? Image.network(
                prompt.thumbnail!,
                width: MediaQuery.of(context).size.width,
                height: 150,
                fit: BoxFit.cover,
              )
            : const SizedBox(
                height: 150,
                child: CircularProgressIndicator(
                  backgroundColor: AppTheme.darkGrey,
                ),
              ),
        const SizedBox(
          height: 20,
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Text(
                '프롬프트 설명',
                style: AppTheme.headline.copyWith(fontSize: 20),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(children: [
            Flexible(
              fit: FlexFit.tight,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                color: Colors.grey.withOpacity(0.2),
                child: Text(
                  prompt.description!,
                  style: AppTheme.body1.copyWith(
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ]),
        ),
        const SizedBox(
          height: 20,
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Text(
                '프롬프트 정보',
                style: AppTheme.headline.copyWith(fontSize: 20),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              Flexible(
                fit: FlexFit.tight,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                      color: AppTheme.primary.withOpacity(1),
                      border: Border(
                        left: BorderSide(
                          color: AppTheme.primaryText.withOpacity(1),
                          width: 4,
                        ),
                      )),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '질문 예시',
                        style: AppTheme.title.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      if (prompt.messageResponse?.example != null)
                        Text(
                          prompt.messageResponse!.example!,
                          style: AppTheme.body1.copyWith(
                            color: AppTheme.primaryText.withOpacity(1),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(
          height: 10,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              Flexible(
                fit: FlexFit.tight,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(1),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (prompt.messageResponse?.prefix != null)
                        Text(
                          prompt.messageResponse!.prefix!,
                          style: AppTheme.body1.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      if (prompt.messageResponse?.example != null)
                        Text(
                          prompt.messageResponse!.example!,
                          style: AppTheme.body1.copyWith(
                            color: AppTheme.primaryText.withOpacity(1),
                          ),
                        ),
                      if (prompt.messageResponse?.suffix != null)
                        Text(
                          prompt.messageResponse!.suffix!,
                          style: AppTheme.body1.copyWith(
                            color: Colors.white,
                          ),
                        ),
                    ],
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
