import 'package:flutter/material.dart';

class MyAppbar extends StatelessWidget implements PreferredSizeWidget {
  const MyAppbar({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      // toolbarHeight: MediaQuery.of(context).size.height * 0.15,
      title: FractionallySizedBox(
        widthFactor: 0.5,
        child: Image.asset(
          'assets/images/Logo_dark.png',
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
