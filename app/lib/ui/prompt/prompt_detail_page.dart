import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/ui/prompt/widgets/prompt_introduction.dart';
import 'package:zippy_ziggy/ui/prompt/widgets/prompt_title.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
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
          Stack(children: [
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
            ),
            AnimatedPositioned(
              bottom: 20,
              right: 20,
              duration: const Duration(
                milliseconds: 500,
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  final chatProvider =
                      Provider.of<ChatProvider>(context, listen: false);
                  chatProvider.initProvider();
                  final navigator = Navigator.of(context);
                  navigator.pushNamed(RoutesName.chat,
                      arguments: widget.data.promptUuid);
                },
                icon: const Icon(
                  Icons.play_circle_outline_outlined,
                  color: Colors.white,
                  size: 16,
                ),
                label: Text(
                  '사용하기',
                  style: AppTheme.caption.copyWith(
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                ),
              ),
            ),
          ])
        ],
      ),
    );
  }
}
