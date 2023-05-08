import 'package:app/app_theme.dart';
import 'package:app/data/model/navigation_model.dart';
import 'package:app/data/providers/navigation_provider.dart';
import 'package:app/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class BurgerNavigator extends StatelessWidget {
  const BurgerNavigator({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Container(
        color: Colors.black45,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
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
            buildMenuItem(context, item: NavigationItem.main, text: '메인페이지'),
            buildMenuItem(context, item: NavigationItem.prompt, text: '프롬프트'),
            buildMenuItem(context, item: NavigationItem.login, text: '마이페이지'),
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
