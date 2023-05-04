import 'package:app/data/providers/theme_provider.dart';
import 'package:app/data/providers/user_provider.dart';
import 'package:app/widgets/counter.dart';
import 'package:app/widgets/custom_button.dart';
import 'package:app/widgets/dropdown.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ThemeChangePage extends StatelessWidget {
  const ThemeChangePage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<List<String>> themeList = [
      ['light', '라이트모드'],
      ['dark', '다크모드'],
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Zippy_Ziggy"),
      ),
      body: ChangeNotifierProvider(
        create: (BuildContext context) => UserProvider(),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Counter(),
              const CustomButton(),
              Consumer<ThemeProvider>(
                builder: (context, provider, child) {
                  return CustomDropdown(
                    title: '테마바꾸기',
                    itemList: themeList,
                    selectedValue:
                        Provider.of<ThemeProvider>(context).currentTheme,
                    onSelected: (String value) {
                      provider.changeTheme(value);
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
