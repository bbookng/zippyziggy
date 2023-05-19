import 'package:fluttertoast/fluttertoast.dart';
import 'package:zippy_ziggy/ui/prompt/prompt_list.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:zippy_ziggy/widgets/navbar.dart';
import 'package:flutter/material.dart';

class PromptPage extends StatefulWidget {
  const PromptPage({
    super.key,
  });

  @override
  State<PromptPage> createState() => _PromptPageState();
}

class _PromptPageState extends State<PromptPage> {
  DateTime? backbuttonpressedTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      drawer: const BurgerNavigator(),
      body: WillPopScope(
        onWillPop: onWillPop,
        child: PageView(
          children: [
            Center(
              child: PromptList(),
            )
          ],
        ),
      ),
    );
  }

  Future<bool> onWillPop() async {
    DateTime currentTime = DateTime.now();

    if (backbuttonpressedTime == null ||
        currentTime.difference(backbuttonpressedTime!) >
            const Duration(seconds: 1)) {
      backbuttonpressedTime = currentTime;
      Fluttertoast.showToast(
        msg: "뒤로가기 버튼을 한번 더 누르면 앱이 종료됩니다.",
        backgroundColor: Colors.green,
        textColor: Colors.white,
      );
      return false;
    }
    return true;
  }
}
