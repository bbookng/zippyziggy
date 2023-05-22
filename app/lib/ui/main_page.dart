import 'package:zippy_ziggy/data/model/navigation_model.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:zippy_ziggy/widgets/navbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

class MainPage extends StatelessWidget {
  const MainPage({super.key});
  static const storage = FlutterSecureStorage();

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
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
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
