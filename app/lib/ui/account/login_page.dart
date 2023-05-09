import 'package:app/ui/account/widgets/social_login_button.dart';
import 'package:flutter/material.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart';

class LogInPage extends StatelessWidget {
  const LogInPage({super.key});

  handleLonInWithKakao() async {
    print('ㅋㅋㅋ');
    try {
      OAuthToken token = await UserApi.instance.loginWithKakaoAccount();
      print('카카오톡으로 로그인 성공 ${token.accessToken}');
    } catch (err) {
      print('카카오톡으로 로그인 실패 $err');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        children: [
          Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SocialLoginButton('Kakao_Logo', handleLonInWithKakao),
                const Text('구글'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
