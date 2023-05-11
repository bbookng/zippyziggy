import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/ui/prompt/widgets/prompt_introduction.dart';
import 'package:zippy_ziggy/ui/prompt/widgets/prompt_title.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptDetail extends StatefulWidget {
  // String promptUuid;
  dynamic data;

  PromptDetail({
    super.key,
    // required this.promptUuid,
    required this.data,
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
      promptUuid: widget.data.promptUuid,
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
    print(prompt.isLiked);

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
                    promptUuid: widget.data.promptUuid,
                    handleBookmark: widget.data.handleBookmark,
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
