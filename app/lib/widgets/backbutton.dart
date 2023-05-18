import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';

class BackButton extends StatefulWidget {
  const BackButton({super.key});

  @override
  State<BackButton> createState() => _BackButtonState();
}

class _BackButtonState extends State<BackButton> {
  late DateTime backbuttonpressedTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WillPopScope(
        onWillPop: onWillPop,
        child: const Center(
          child: Text('뒤로가기 두번 클릭시 앱이 종료됩니다.'),
        ),
      ),
    );
  }

  Future<bool> onWillPop() async {
    DateTime currentTime = DateTime.now();

    bool backButton = currentTime.difference(backbuttonpressedTime) >
        const Duration(seconds: 3);

    if (backButton) {
      backbuttonpressedTime = currentTime;
      Fluttertoast.showToast(
        msg: "뒤로가기 버튼을 한번 더 누르면 앱이 종료됩니다.",
        backgroundColor: const Color.fromARGB(255, 56, 212, 61),
        textColor: Colors.white,
      );
      return false;
    }
    SystemNavigator.pop();
    return true;
  }
}
