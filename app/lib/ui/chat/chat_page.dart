import 'package:chat_gpt_sdk/chat_gpt_sdk.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';
import 'package:zippy_ziggy/ui/chat/widgets/chat_message_list.dart';
import 'package:zippy_ziggy/ui/chat/widgets/end_drawer.dart';
import 'package:zippy_ziggy/ui/chat/widgets/new_message.dart';
import 'package:zippy_ziggy/ui/chat/widgets/using_prompt.dart';

String _chatKey = dotenv.env["GPT_KEY"]!;

final openAI = OpenAI.instance.build(token: _chatKey);

class ChatPage extends StatefulWidget {
  final String? promptUuid;
  const ChatPage({
    super.key,
    this.promptUuid,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) async {
        final provider = Provider.of<ChatProvider>(context, listen: false);
        if (widget.promptUuid != null) {
          await provider.getPrompt(widget.promptUuid!);
        } else {
          provider.initProvider();
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
    final chatProvider = Provider.of<ChatProvider>(context);
    final prompt = chatProvider.prompt;

    void _openEndDrawer() {
      scaffoldKey.currentState!.openEndDrawer();
    }

    void _closeEndDrawer() {
      Navigator.of(context).pop();
    }

    return WillPopScope(
      onWillPop: () async {
        Provider.of<ChatProvider>(context, listen: false).stopChat();
        Navigator.of(context).pop();
        return true;
      },
      child: Scaffold(
        key: scaffoldKey,
        appBar: AppBar(
          title: FractionallySizedBox(
            widthFactor: 0.5,
            child: Image.asset(
              'assets/images/Logo_dark.png',
            ),
          ),
          actions: [
            IconButton(
              onPressed: () {
                _openEndDrawer();
              },
              icon: const Icon(Icons.bookmarks_rounded),
            ),
          ],
        ),
        // drawer: const BurgerNavigator(),
        endDrawer: const EndDrawer(),
        body: Container(
          padding: const EdgeInsets.all(12),
          child: Stack(
            children: [
              const Column(
                children: [
                  Expanded(child: ChatList()),
                  // creating_message(),
                  NewMessage(),
                ],
              ),
              if (prompt != null) PromptInfo(prompt: prompt),
            ],
          ),
        ),
      ),
    );
  }
}
