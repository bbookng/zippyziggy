import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/chat/widgets/bookmarked_list_item.dart';

class BookmarkedList extends StatefulWidget {
  const BookmarkedList({super.key});

  @override
  State<BookmarkedList> createState() => _BookmarkedListState();
}

class _BookmarkedListState extends State<BookmarkedList> {
  int size = 10;

  // 북마크 프롬프트 목록 가져오기
  handleGetBookmarkedList(bool isNew) {
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final provider = Provider.of<UserProvider>(context, listen: false);
        if (isNew) {
          provider.resetPrompt();
        }
        provider.getBookmarkedPromptList(
          userUuid: provider.userUuid,
          size: size,
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    size = 10;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<UserProvider>(context, listen: false).resetPrompt();
      handleGetBookmarkedList(true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return _promptListView();
  }

  // 프롬프트 목록들
  _promptListView() {
    final provider = Provider.of<UserProvider>(context);

    final promptList = provider.promptList;

    final isLoading = provider.isLoading;

    // 로딩중이면서 캐시에 아무것도 없음
    if (isLoading && promptList.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(
          color: Colors.green,
        ),
      );
    }

    // 로딩중이 아닌데 캐시에 아무것도 없음
    // 아무것도 가져올 아이템이 없을때
    if (provider.page > 0 && !isLoading && promptList.isEmpty) {
      return const Center(
        child: Text('북마크한 프롬프트가 없습니다.'),
      );
    }

    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 8,
        ),
        child: ListView.separated(
          itemCount: promptList.length + 1,
          itemBuilder: (context, index) {
            if (index < promptList.length) {
              var prompt = promptList[index];
              return BookmarkedListItem(prompt: prompt);
            }

            if (!provider.isLoading && provider.page < provider.totalPageCnt) {
              handleGetBookmarkedList(false);
            }

            if (provider.page < provider.totalPageCnt) {
              return const Center(
                child: CircularProgressIndicator(
                  color: Colors.green,
                ),
              );
            } else {
              return null;
            }
          },
          separatorBuilder: (context, index) => const SizedBox(
            height: 5,
          ),
        ),
      ),
    );
  }
}
