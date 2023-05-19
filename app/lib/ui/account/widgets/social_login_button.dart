import 'package:zippy_ziggy/app_theme.dart';
import 'package:flutter/cupertino.dart';

Widget SocialLoginButton(
  String path,
  Function onTap,
  String content,
  Color color,
) {
  return Builder(
    builder: (context) {
      return SizedBox(
        width: MediaQuery.of(context).size.width,
        child: CupertinoButton(
          padding: const EdgeInsets.all(12),
          borderRadius: BorderRadius.circular(30),
          onPressed: () => onTap(),
          color: color,
          child: Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Image.asset(
                'assets/images/$path',
                width: 30,
                height: 30,
              ),
              Text(
                content,
                style: AppTheme.title.copyWith(
                  color: const Color.fromARGB(216, 0, 0, 0),
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(
                width: 30,
              ),
            ],
          ),
        ),
      );
    },
  );
}
