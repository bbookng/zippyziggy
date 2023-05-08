import 'package:app/data/model/prompt_model.dart';
import 'package:app/ui/prompt/widgets/prompt_introduction.dart';
import 'package:app/ui/prompt/widgets/prompt_title.dart';
import 'package:app/widgets/my_appbar.dart';
import 'package:flutter/material.dart';

class PromptDetail extends StatelessWidget {
  PromptModel prompt = PromptModel();

  PromptDetail({
    super.key,
    required this.prompt,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      // drawer: const BurgerNavigator(),
      body: PageView(
        children: [
          Center(
            child: Column(
              children: [
                PromptTitle(
                  prompt: prompt,
                ),
                const SizedBox(
                  height: 20,
                ),
                PromptIntroduction(
                  prompt: prompt,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
