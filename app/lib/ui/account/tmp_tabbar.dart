import 'package:flutter/material.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/ui/account/widgets/bookmark_prompt_list.dart';

class MyTabBar extends StatefulWidget {
  const MyTabBar({super.key});

  @override
  State<MyTabBar> createState() => _MyTabBarState();
}

class _MyTabBarState extends State<MyTabBar> with TickerProviderStateMixin {
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

    _tabController = TabController(length: myTabs.length, vsync: this);
  }

  @override
  void dispose() {
    super.dispose();
    _tabController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        TabBar(
          controller: _tabController,
          indicatorColor: Colors.green,
          labelStyle: AppTheme.body1,
          tabs: myTabs,
        ),
        SingleChildScrollView(
          child: Container(
            height: screenHeight * 0.8,
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: TabBarView(
              controller: _tabController,
              children: [
                const BookmarkedPromptList(),
                Container(
                  decoration: const BoxDecoration(
                    color: Colors.yellowAccent,
                  ),
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
