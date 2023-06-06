import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_list_item.dart';
import 'package:zippy_ziggy/widgets/dropdown.dart';
import 'package:zippy_ziggy/widgets/searchbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptList extends StatefulWidget {
  String? keyword;
  String? category;
  String? sort;

  PromptList({
    super.key,
    this.keyword,
    this.category,
    this.sort,
  });

  @override
  State<PromptList> createState() => _PromptListState();
}

class _PromptListState extends State<PromptList> {
  late String _keyword;
  late String _category;
  late String _sort;

  int page = 0;
  int size = 8;

  // 카테고리 리스트
  List<List<String>> categoryList = [
    ['ALL', '전체'],
    ['STUDY', '학업'],
    ['FUN', '오락'],
    ['BUSINESS', '비즈니스'],
    ['PROGRAMMING', '프로그래밍'],
    ['ETC', '기타'],
  ];

  // 정렬 리스트
  List<List<String>> sortList = [
    ['likeCnt', '좋아요'],
    ['hit', '조회수'],
    ['regDt', '최신순'],
  ];

  // 카테고리 바꾸기
  handleChangeCategory(String newCategory) {
    _category = newCategory;
    handleGetPrompt(true);
  }

  // 정렬 바꾸기
  handleChangeSort(String newSort) {
    _sort = newSort;
    handleGetPrompt(true);
  }

  // 프롬프트 목록 가져오기
  handleGetPrompt(bool isNew) {
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final provider = Provider.of<PromptProvider>(context, listen: false);
        if (isNew) {
          page = 0;
          provider.initProvider();
        }
        provider.getPromptList(
          keyword: _keyword,
          category: _category,
          sort: _sort,
          size: size,
        );
        FocusScope.of(context).nextFocus();
      },
    );
  }

  // 초기 설정
  @override
  void initState() {
    super.initState();
    _keyword = '';
    _category = 'ALL';
    _sort = 'likeCnt';
    // build가 다 되고 나서 콜백함수 실행
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<PromptProvider>(context, listen: false).initProvider();
    });
    handleGetPrompt(true);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        body: Column(
          children: [
            // 윗공간
            const SizedBox(
              height: 20,
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // 카테고리 드랍다운
                Container(
                  width: MediaQuery.of(context).size.width * 0.5,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: CustomDropdown(
                    title: '카테고리',
                    itemList: categoryList,
                    selectedValue: 'ALL',
                    onSelected: (String value) {
                      handleChangeCategory(value);
                    },
                  ),
                ),

                // 정렬 드랍다운
                Container(
                  width: MediaQuery.of(context).size.width * 0.5,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: CustomDropdown(
                    title: '정렬',
                    itemList: sortList,
                    selectedValue: 'likeCnt',
                    onSelected: (String value) {
                      handleChangeSort(value);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 10,
            ),

            // 검색창
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: DebouncedSearchBar(
                content: _keyword,
                onChangeContent: (value) {
                  setState(() {
                    _keyword = value;
                  });
                },
                handleSearch: handleGetPrompt,
              ),
            ),

            // 프롬프트 목록들
            Expanded(
              child: _promptListView(),
            )
          ],
        ),
      ),
    );
  }

  _promptListView() {
    final provider = Provider.of<PromptProvider>(context);

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

    // 로딩중이 아닌데 캐시에 아무것도 업슴
    // 아무것도 가져올 아이템이 없을때
    if (provider.page > 0 && !isLoading && promptList.isEmpty) {
      return Column(
        children: const [
          SizedBox(
            height: 200,
          ),
          Text('조회된 프롬프트가 없습니다.'),
        ],
      );
    }

    return SizedBox(
        child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      child: ListView.separated(
        itemCount: promptList.length + 1,
        itemBuilder: (context, index) {
          if (index < promptList.length) {
            var prompt = promptList[index];
            return PromptListItem(prompt: prompt);
          }

          if (!provider.isLoading && provider.page < provider.totalPageCnt) {
            handleGetPrompt(false);
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
    ));
  }
}
