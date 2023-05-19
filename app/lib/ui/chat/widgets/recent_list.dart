import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/chat/widgets/bookmarked_list_item.dart';

class RecentList extends StatefulWidget {
  const RecentList({super.key});

  @override
  State<RecentList> createState() => _RecentListState();
}

class _RecentListState extends State<RecentList> {
  int size = 10;

  // 북마크 프롬프트 목록 가져오기
  handleGetRecentList(bool isNew) {
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final provider = Provider.of<UserProvider>(context, listen: false);
        if (isNew) {
          provider.resetPrompt();
        }
        provider.getRecentPromptList(
          userUuid: provider.userUuid,
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<UserProvider>(context, listen: false).resetPrompt();
      handleGetRecentList(true);
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
        child: Text('최근 조회한 프롬프트가 없습니다.'),
      );
    }

    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.only(
          right: 8,
          left: 8,
          bottom: 50,
        ),
        child: ListView.separated(
          itemCount: promptList.length,
          itemBuilder: (context, index) {
            if (index < promptList.length) {
              var prompt = promptList[index];
              return BookmarkedListItem(prompt: prompt);
            }
            return null;
          },
          separatorBuilder: (context, index) => const SizedBox(
            height: 5,
          ),
        ),
      ),
    );
  }
}
