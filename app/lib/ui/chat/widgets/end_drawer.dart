import 'package:flutter/material.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/ui/chat/widgets/bookmarked_list.dart';
import 'package:zippy_ziggy/ui/chat/widgets/recent_list.dart';

class EndDrawer extends StatefulWidget {
  const EndDrawer({
    super.key,
  });

  @override
  State<EndDrawer> createState() => _EndDrawerState();
}

class _EndDrawerState extends State<EndDrawer> with TickerProviderStateMixin {
  late TabController _tabController;

  final List<Tab> myTabs = <Tab>[
    const Tab(
      text: '북마크 목록',
    ),
    const Tab(
      text: '최근 사용 목록',
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
    return Drawer(
      child: Column(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.0875,
          ),
          TabBar(
            tabs: myTabs,
            controller: _tabController,
            indicatorColor: Colors.green,
            labelStyle: AppTheme.body1.copyWith(
              fontSize: 16,
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: const [
                BookmarkedList(),
                RecentList(),
              ],
            ),
          )
        ],
      ),
    );
  }
}
