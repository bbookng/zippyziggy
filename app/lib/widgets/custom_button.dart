import 'package:app/data/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton(
          onPressed: () {
            context.read<UserProvider>().increment();
          },
          child: const Icon(Icons.add),
        ),
        const SizedBox(
          width: 40,
        ),
        ElevatedButton(
          onPressed: () {
            context.read<UserProvider>().decrement();
          },
          child: const Icon(Icons.remove),
        ),
      ],
    );
  }
}
