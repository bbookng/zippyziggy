import 'package:app/data/model/navigation_model.dart';
import 'package:app/data/providers/navigation_provider.dart';
import 'package:app/widgets/my_appbar.dart';
import 'package:app/widgets/navbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MainPage extends StatelessWidget {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      body: PageView(
        onPageChanged: (_) {
          Provider.of<NavigationProvider>(
            context,
            listen: false,
          ).setNavigationItem(NavigationItem.main);
        },
        children: const [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("메인페이지입니당"),
              ],
            ),
          ),
        ],
      ),
      drawer: const BurgerNavigator(),
    );
  }
}
