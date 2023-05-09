import 'package:app/data/model/prompt_model.dart';
import 'package:app/data/providers/prompt_provider.dart';
import 'package:app/ui/prompt/widgets/prompt_introduction.dart';
import 'package:app/ui/prompt/widgets/prompt_title.dart';
import 'package:app/widgets/my_appbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptDetail extends StatefulWidget {
  String promptUuid;

  PromptDetail({
    super.key,
    required this.promptUuid,
  });

  @override
  State<PromptDetail> createState() => _PromptDetailState();
}

class _PromptDetailState extends State<PromptDetail> {
  bool isLoading = true;

  handleGetPromptDe() async {
    // WidgetsBinding.instance.addPostFrameCallback(
    //   (_) {
    await Provider.of<PromptProvider>(context, listen: false).getPromptDetail(
      promptUuid: widget.promptUuid,
    );
    isLoading = false;
    // },
    // );
  }

  @override
  void initState() {
    super.initState();
    handleGetPromptDe();
  }

  @override
  Widget build(BuildContext context) {
    PromptDetailModel prompt = Provider.of<PromptProvider>(context).prompt;

    if (isLoading) {
      return const Scaffold(
        appBar: MyAppbar(),
      );
    }
    return Scaffold(
      appBar: const MyAppbar(),
      // drawer: const BurgerNavigator(),
      body: PageView(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  PromptTitle(
                    prompt: prompt,
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  PromptIntroduction(
                    prompt: prompt,
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
