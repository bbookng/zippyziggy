import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/ui/account/widgets/tabbar.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:zippy_ziggy/widgets/navbar.dart';
import 'package:flutter/material.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  late String nickname;
  late String profileImg;
  late String userUuid;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<UserProvider>(context, listen: false);
    nickname = provider.nickname!;
    profileImg = provider.profileImg!;
    userUuid = provider.userUuid!;
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    return Scaffold(
      appBar: const MyAppbar(),
      drawer: const BurgerNavigator(),
      body: PageView(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: SingleChildScrollView(
              child: Column(
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
                    height: 10,
                  ),

                  // 프로필편집, 로그아웃 버튼
                  Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      SizedBox(
                        width: MediaQuery.of(context).size.width * 0.4,
                        child: CupertinoButton(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 10),
                          borderRadius: BorderRadius.circular(30),
                          color: AppTheme.darkGrey,
                          child: Text(
                            '프로필편집',
                            style: AppTheme.body1.copyWith(fontSize: 16),
                          ),
                          onPressed: () {},
                        ),
                      ),
                      SizedBox(
                        width: MediaQuery.of(context).size.width * 0.4,
                        child: CupertinoButton(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 10),
                          borderRadius: BorderRadius.circular(30),
                          color: AppTheme.darkGrey,
                          child: Text(
                            '로그아웃',
                            style: AppTheme.body1.copyWith(fontSize: 16),
                          ),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  const MyTabBar(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
