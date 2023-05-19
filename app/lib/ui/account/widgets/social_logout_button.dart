import 'package:flutter/material.dart';

Widget _logoutButton() {
  return ElevatedButton(
    onPressed: () {},
    style: ButtonStyle(
      backgroundColor: MaterialStateProperty.all(
        const Color(0xff0165E1),
      ),
    ),
    child: const Text('로그아웃'),
  );
}
