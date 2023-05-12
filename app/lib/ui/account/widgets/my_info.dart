import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';

class MyInfo extends StatelessWidget {
  const MyInfo({
    super.key,
    required this.userProvider,
  });

  final UserProvider userProvider;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(
          height: 20,
        ),

        // 프로필 사진
        Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: Image.network(
              userProvider.profileImg!,
              width: 120,
              height: 120,
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(
          height: 10,
        ),

        // 닉네임
        Text(
          '${userProvider.nickname}',
          style: AppTheme.title.copyWith(
            fontSize: 24,
          ),
        ),
        const SizedBox(
          height: 20,
        ),

        // 프로필편집, 로그아웃 버튼
        Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.4,
              child: CupertinoButton(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                borderRadius: BorderRadius.circular(30),
                color: AppTheme.darkGrey,
                child: Text(
                  '프로필 편집',
                  style: AppTheme.body1.copyWith(fontSize: 16),
                ),
                onPressed: () {
                  final navigator = Navigator.of(context);
                  navigator.pushNamed(RoutesName.update);
                },
              ),
            ),
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.4,
              child: CupertinoButton(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                borderRadius: BorderRadius.circular(30),
                color: AppTheme.darkGrey,
                child: Text(
                  '로그아웃',
                  style: AppTheme.body1.copyWith(fontSize: 16),
                ),
                onPressed: () async {
                  final navigator = Navigator.of(context);
                  final data =
                      await Provider.of<UserProvider>(context, listen: false)
                          .postLogout();
                  if (data) {
                    navigator.pushNamedAndRemoveUntil(
                        RoutesName.login, (route) => false);
                  }
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
}
