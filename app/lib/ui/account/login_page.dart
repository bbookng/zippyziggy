import 'package:zippy_ziggy/data/model/navigation_model.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/account/widgets/social_login_button.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<UserProvider>(context, listen: false);
    final navProvider = Provider.of<NavigationProvider>(context, listen: false);
    final navigator = Navigator.of(context);

    handleKakaoLogin() async {
      final res = await provider.kakaoLogin();
      if (res["result"] == "SIGNUP") {
        navigator.pushNamed(RoutesName.signup, arguments: res["data"]);
        return;
      }
      if (res["result"] == "LOGIN") {
        navigator.pushNamedAndRemoveUntil(
          RoutesName.prompt,
          (route) => false,
        );
        navProvider.setNavigationItem(NavigationItem.prompt);
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
                  SizedBox(
                    child: Image.asset(
                      'assets/images/Logo_dark.png',
                      width: MediaQuery.of(context).size.width * 0.616666,
                      height: MediaQuery.of(context).size.height * 0.0859375,
                    ),
                  ),
                  const SizedBox(
                    height: 50,
                  ),
                  SocialLoginButton(
                    'Kakao_Logo_Yellow.png',
                    handleKakaoLogin,
                    '카카오로 시작하기',
                    Colors.yellow,
                  ),
                  // const SizedBox(
                  //   height: 20,
                  // ),
                  // SocialLoginButton(
                  //   'Google_Logo.png',
                  //   () {},
                  //   '구글로 시작하기',
                  //   Colors.white,
                  // ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
