import 'package:zippy_ziggy/data/model/user_model.dart';
import 'package:zippy_ziggy/ui/account/login_page.dart';
import 'package:zippy_ziggy/ui/account/my_page.dart';
import 'package:zippy_ziggy/ui/account/signup_page.dart';
import 'package:zippy_ziggy/ui/account/update_page.dart';
import 'package:zippy_ziggy/ui/main_page.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_detail_page.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_page.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:flutter/material.dart';

class Routes {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RoutesName.main:
        return MaterialPageRoute(
            builder: (BuildContext context) => const MainPage());
      case RoutesName.login:
        return MaterialPageRoute(
            builder: (BuildContext context) => const LoginPage());
      case RoutesName.signup:
        var data = settings.arguments;
        return MaterialPageRoute(
          builder: (BuildContext context) => SignUpPage(
            data: data as SocialSignUpModel,
          ),
        );
      case RoutesName.update:
        return MaterialPageRoute(
            builder: (BuildContext context) => const UpdatePage());
      case RoutesName.my:
        return MaterialPageRoute(
            builder: (BuildContext context) => const MyPage());
      case RoutesName.prompt:
        return MaterialPageRoute(
            builder: (BuildContext context) => const PromptPage());
      case RoutesName.promptDetail:
        // var promptUuid = settings.arguments;
        var data = settings.arguments as DetailArguments;
        return MaterialPageRoute(
          builder: (BuildContext context) => PromptDetail(
            // promptUuid: promptUuid as String,
            data: data,
          ),
        );
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

class DetailArguments {
  final String promptUuid;
  final Function handleBookmark;

  DetailArguments(this.promptUuid, this.handleBookmark);
}
