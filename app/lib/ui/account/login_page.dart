import 'package:zippy_ziggy/data/model/navigation_model.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/account/widgets/social_login_button.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<UserProvider>(context, listen: false);
    final navigator = Navigator.of(context);

    handleKakaoLogin() async {
      final res = await provider.kakaoLogin();
      if (res["result"] == "SIGNUP") {
        navigator.pushNamed(RoutesName.signup, arguments: res["data"]);
        return;
      }
      if (res["result"] == "LOGIN") {
        navigator.pushNamedAndRemoveUntil(
          RoutesName.main,
          (route) => false,
        );
        Provider.of<NavigationProvider>(context, listen: false)
            .setNavigationItem(NavigationItem.main);
        return;
      }
    }

    return Scaffold(
      body: PageView(
        children: [
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SocialLoginButton(
                    'Kakao_Logo_Yellow.png',
                    handleKakaoLogin,
                    '카카오로 시작하기',
                    const Color.fromRGBO(255, 255, 22, 1),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  SocialLoginButton(
                    'Google_Logo.png',
                    () {},
                    '구글로 시작하기',
                    Colors.white,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
