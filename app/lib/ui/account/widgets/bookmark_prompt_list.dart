import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_list_item.dart';

class BookmarkedPromptList extends StatefulWidget {
  const BookmarkedPromptList({super.key});

  @override
  State<BookmarkedPromptList> createState() => _BookmarkedPromptListState();
}

class _BookmarkedPromptListState extends State<BookmarkedPromptList> {
  int page = 0;
  int size = 6;
  late var scrollController = ScrollController();

  // 북마크 프롬프트 목록 가져오기
  handleGetBookmarkedPromptList(bool isNew) async {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<UserProvider>(context, listen: false);
      if (isNew) {
        page = 0;

        provider.initProvider();
      }
      provider
          .getBookmarkedPromptList(
            userUuid: provider.userUuid,
            page: page,
            size: size,
          )
          .then(
            (_) => page = page + 1,
          );
    });
  }

  @override
  void initState() {
    super.initState();
    scrollController = ScrollController();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      Provider.of<UserProvider>(context, listen: false).initProvider();
      scrollController.addListener(pagination);
    });
    handleGetBookmarkedPromptList(true);
  }

  // 페이지네이션
  void pagination() {
    if ((scrollController.position.pixels ==
            scrollController.position.maxScrollExtent) &&
        page < Provider.of<UserProvider>(context, listen: false).totalPageCnt) {
      handleGetBookmarkedPromptList(false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, provider, widget) {
        {
          if (provider.promptList.isNotEmpty) {
            return promptListView(provider.promptList, scrollController);
          } else if (provider.isLoading) {
            return const Center(
              child: Column(
                children: [
                  SizedBox(
                    height: 20,
                  ),
                  CircularProgressIndicator(),
                ],
              ),
            );
          }
          return const Center(
            child: Column(
              children: [
                SizedBox(
                  height: 20,
                ),
                Text('북마크한 프롬프트가 없습니다.'),
              ],
            ),
          );
        }
      },
    );
  }

  // 프롬프트 목록들
  Expanded promptListView(promptList, scrollController) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        child: ListView.separated(
          controller: scrollController,
          itemCount: promptList.length,
          itemBuilder: (context, index) {
            var prompt = promptList[index];
            return PromptListItem(prompt: prompt);
          },
          separatorBuilder: (context, index) => const Divider(
            height: 5,
          ),
        ),
      ),
    );
  }
}
