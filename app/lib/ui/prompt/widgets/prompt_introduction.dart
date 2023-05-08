import 'package:app/data/model/prompt_model.dart';
import 'package:flutter/material.dart';

class PromptIntroduction extends StatelessWidget {
  final PromptModel prompt;
  const PromptIntroduction({
    super.key,
    required this.prompt,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Image.network(
          prompt.thumbnail!,
          width: MediaQuery.of(context).size.width,
          height: 150,
          fit: BoxFit.cover,
        )
      ],
    );
  }
}
