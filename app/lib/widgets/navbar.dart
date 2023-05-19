import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/navigation_model.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class BurgerNavigator extends StatelessWidget {
  const BurgerNavigator({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<UserProvider>(context);

    return Drawer(
      child: Container(
        color: Colors.black45,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            if (provider.nickname == null)
              DrawerHeader(
                child: ListTile(
                  title: const Center(
                    child: Text(
                      '로그인을 해주세요',
                      style: AppTheme.title,
                    ),
                  ),
                  onTap: () {
                    Navigator.pushNamed(context, RoutesName.login);
                  },
                ),
              ),
            if (provider.nickname != null)
              DrawerHeader(
                // decoration: const BoxDecoration(
                //   color: AppTheme.darkGrey,
                //   borderRadius: BorderRadius.only(
                //     bottomLeft: Radius.circular(40),
                //     bottomRight: Radius.circular(40),
                //   ),
                // ),
                child: Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(100),
                        child: Image.network(
                          provider.profileImg!,
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${provider.nickname}님',
                            style: AppTheme.title.copyWith(
                              fontSize: 18,
                            ),
                          ),
                          const SizedBox(
                            height: 5,
                          ),
                          Text(
                            '안녕하세요',
                            style: AppTheme.title.copyWith(),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            // buildMenuItem(context, item: NavigationItem.main, text: '메인페이지'),
            buildMenuItem(context, item: NavigationItem.prompt, text: '프롬프트'),
            buildMenuItem(context, item: NavigationItem.my, text: '마이페이지'),
            buildMenuItem(context, item: NavigationItem.chat, text: '채팅'),
          ],
        ),
      ),
    );
  }
}

class MenuItem extends StatelessWidget {
  final NavigationItem item;
  final String text;

  const MenuItem({
    Key? key,
    required this.item,
    required this.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<NavigationProvider>(context);
    final currentItem = provider.navigationItem;
    final isSelected = item == currentItem;

    return Material(
      color: Colors.transparent,
      child: ListTile(
        selected: isSelected,
        selectedTileColor: Colors.white24,
        title: Center(
          child: Text(
            text,
            style: AppTheme.title.copyWith(),
          ),
        ),
        onTap: () => selectItem(context, item),
      ),
    );
  }
}

Widget buildMenuItem(
  BuildContext context, {
  required NavigationItem item,
  required String text,
}) {
  return MenuItem(item: item, text: text);
}

void selectItem(BuildContext context, NavigationItem item) {
  final provider = Provider.of<NavigationProvider>(context, listen: false);
  final current = provider.navigationItem;
  provider.setNavigationItem(item);
  provider.setNavigationItem(provider.navigationItem);
  Navigator.pop(context);
  if (current != item) {
    Navigator.pushNamed(context, '${item.name}_page').then((_) {
      provider.setNavigationItem(current);
    });
  }
}
