import 'package:app/ui/account/login_page.dart';
import 'package:app/ui/main_page.dart';
import 'package:app/ui/prompt/prompt_page.dart';
import 'package:app/utils/routes/route_name.dart';
import 'package:flutter/material.dart';

class Routes {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RoutesName.main:
        return MaterialPageRoute(
            builder: (BuildContext context) => const MainPage());
      case RoutesName.login:
        return MaterialPageRoute(
            builder: (BuildContext context) => const LogInPage());
      case RoutesName.prompt:
        return MaterialPageRoute(
            builder: (BuildContext context) => const PromptPage());
      default:
        return MaterialPageRoute(
          builder: (_) {
            return const Scaffold(
              body: Center(
                child: Text("No Route Defined!"),
              ),
            );
          },
        );
    }
  }
}
