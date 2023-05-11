import 'package:zippy_ziggy/ui/prompt/prompt_list.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:zippy_ziggy/widgets/navbar.dart';
import 'package:flutter/material.dart';

class PromptPage extends StatelessWidget {
  const PromptPage({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      drawer: const BurgerNavigator(),
      body: PageView(
        children: [
          Center(
            child: PromptList(),
          )
        ],
      ),
    );
  }
}
