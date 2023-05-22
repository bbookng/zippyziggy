// import 'package:animated_text_kit/animated_text_kit.dart';
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:zippy_ziggy/app_theme.dart';
// import 'package:zippy_ziggy/data/providers/chat_provider.dart';

// class creating_message extends StatelessWidget {
//   const creating_message({
//     super.key,
//   });

//   @override
//   Widget build(BuildContext context) {
//     final chatProvider = Provider.of<ChatProvider>(context);
//     return Padding(
//         padding: const EdgeInsets.all(4),
//         child: chatProvider.isLoadingGPT
//             ? AnimatedTextKit(
//                 animatedTexts: [
//                   TypewriterAnimatedText(
//                     'ChatGPT가 답변을 생성중입니다.',
//                     textStyle: AppTheme.caption,
//                   ),
//                   TypewriterAnimatedText(
//                     '최대 1분 이상 소요될 수 있습니다.',
//                     textStyle: AppTheme.caption,
//                   ),
//                 ],
//                 totalRepeatCount: 100,
//                 pause: const Duration(seconds: 3),
//                 displayFullTextOnTap: true,
//                 stopPauseOnTap: true,
//               )
//             : null);
//   }
// }
