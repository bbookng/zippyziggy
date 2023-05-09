import 'package:flutter/material.dart';

Widget SocialLoginButton(String path, VoidCallback onTap) {
  return Card(
    elevation: 18.0,
    shape: const CircleBorder(),
    clipBehavior: Clip.antiAlias,
    child: Ink.image(
      image: AssetImage('assets/images/$path.png'),
      width: 60,
      height: 60,
      child: InkWell(
        borderRadius: const BorderRadius.all(
          Radius.circular(35.0),
        ),
        onTap: onTap,
      ),
    ),
  );
}
