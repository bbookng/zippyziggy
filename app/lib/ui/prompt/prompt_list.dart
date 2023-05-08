import 'package:app/data/providers/prompt_provider.dart';
import 'package:app/ui/prompt/prompt_list_item.dart';
import 'package:app/widgets/dropdown.dart';
import 'package:app/widgets/searchbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PromptList extends StatefulWidget {
  String keyword;
  String category;
  String sort;

  PromptList({
    super.key,
    required this.keyword,
    required this.category,
    required this.sort,
  });

  @override
  State<PromptList> createState() => _PromptListState();
}

class _PromptListState extends State<PromptList> {
  late String _keyword;
  late String _category;
  late String _sort;

  int page = 0;
  int size = 2;

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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (isNew) {
        page = 0;
        Provider.of<PromptProvider>(context, listen: false).initProvider();
      }
      Provider.of<PromptProvider>(context, listen: false)
          .getPromptList(
            keyword: _keyword,
            category: _category,
            sort: _sort,
            page: page.toString(),
            size: size.toString(),
          )
          .then((_) => {
                page = page + 1,
              });
    });
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
    return Scaffold(
      body: Column(
        children: [
          // 윗공간
          const SizedBox(
            height: 20,
          ),

          // 카테고리 드랍다운
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
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

          // 프롬프트 검색 버튼
          // ButtonBar(
          //   children: <Widget>[
          //     IconButton(
          //       onPressed: () {
          //         handleGetPrompt(false);
          //       },
          //       icon: const Icon(
          //         Icons.add,
          //       ),
          //     ),
          //   ],
          // ),

          // 프롬프트 목록들
          Consumer<PromptProvider>(
            builder: (context, provider, widget) {
              {
                if (provider.promptList.isNotEmpty) {
                  return promptListView(provider.promptList);
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
                      Text('프롬프트가 없습니다.'),
                    ],
                  ),
                );
              }
            },
          )
        ],
      ),
    );
  }

  // 프롬프트 목록들
  Expanded promptListView(promptList) {
    return Expanded(
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        itemCount: promptList.length,
        itemBuilder: (context, index) {
          var prompt = promptList[index];
          return PromptListItem(prompt: prompt);
        },
        separatorBuilder: (context, index) => const Divider(
          height: 5,
        ),
      ),
    );
  }
}
