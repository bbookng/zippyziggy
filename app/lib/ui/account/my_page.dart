import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/account/widgets/bookmark_prompt_list.dart';
import 'package:zippy_ziggy/ui/account/widgets/my_info.dart';
import 'package:zippy_ziggy/ui/account/widgets/my_prompt_list.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:zippy_ziggy/widgets/navbar.dart';
import 'package:flutter/material.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> with TickerProviderStateMixin {
  late String nickname;
  late String profileImg;
  late String userUuid;
  late TabController _tabController;

  final List<Tab> myTabs = <Tab>[
    const Tab(
      text: '북마크',
    ),
    const Tab(
      text: '내 프롬프트',
    ),
  ];

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<UserProvider>(context, listen: false);
    nickname = provider.nickname!;
    profileImg = provider.profileImg!;
    userUuid = provider.userUuid!;
    _tabController = TabController(length: myTabs.length, vsync: this);
  }

  @override
  void dispose() {
    super.dispose();
    _tabController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      drawer: const BurgerNavigator(),
      body: PageView(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  floating: true,
                  toolbarHeight: 54,
                  expandedHeight: 320,
                  pinned: true,
                  leading: const SizedBox(),
                  flexibleSpace: FlexibleSpaceBar(
                    expandedTitleScale: 1,
                    titlePadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 12,
                    ),
                    title: TabBar(
                      controller: _tabController,
                      indicatorColor: Colors.green,
                      labelStyle: AppTheme.body1.copyWith(
                        fontSize: 16,
                      ),
                      tabs: myTabs,
                    ),
                    background: const MyInfo(),
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    [
                      SizedBox(
                        height: MediaQuery.of(context).size.height - 175,
                        child: TabBarView(
                          controller: _tabController,
                          children: const [
                            BookmarkedPromptList(),
                            MyPromptList(),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
