import 'package:app/data/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Counter extends StatelessWidget {
  const Counter({super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      context.watch<UserProvider>().count.toString(),
      style: const TextStyle(
        fontSize: 20,
      ),
    );
  }
}
