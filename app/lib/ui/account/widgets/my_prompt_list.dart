import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_list_item.dart';

class MyPromptList extends StatefulWidget {
  const MyPromptList({super.key});

  @override
  State<MyPromptList> createState() => _MyPromptListState();
}

class _MyPromptListState extends State<MyPromptList> {
  int page = 0;
  int size = 10;

  // 내 프롬프트 목록 가져오기
  handleGetMyPromptList(bool isNew) {
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final provider = Provider.of<UserProvider>(context, listen: false);
        if (isNew) {
          page = 0;
          provider.resetPrompt();
        }
        provider.getMyPromptList(
          userUuid: provider.userUuid,
          size: size,
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    page = 0;
    size = 10;
    print('내 프롬프트 렌더링 시작');

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<UserProvider>(context, listen: false).resetPrompt();
      handleGetMyPromptList(true);
    });
  }

  @override
  Widget build(BuildContext context) {
    print('내 프롬프트 렌더링');
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
      return const Column(
        children: [
          SizedBox(
            height: 200,
          ),
          Text('내 프롬프트가 없습니다.'),
        ],
      );
    }

    return SizedBox(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 36),
        child: ListView.separated(
          itemCount: promptList.length + 1,
          itemBuilder: (context, index) {
            if (index < promptList.length) {
              var prompt = promptList[index];
              return PromptListItem(prompt: prompt);
            }

            print(
                '마이 - 페이지 ${provider.page}, 토탈페이지 ${provider.totalPageCnt}, 인덱스 $index');
            if (!provider.isLoading && provider.page < provider.totalPageCnt) {
              handleGetMyPromptList(false);
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
          separatorBuilder: (context, index) => const Divider(
            height: 5,
          ),
        ),
      ),
    );
  }
}
