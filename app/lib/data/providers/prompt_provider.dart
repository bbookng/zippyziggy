import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/repository/prompt_repository.dart';
import 'package:flutter/material.dart';

class PromptProvider extends ChangeNotifier {
  final PromptRepository _promptRepository = PromptRepository();
  List<PromptModel> _promptList = [];
  List<PromptModel> get promptList => _promptList;
  PromptDetailModel prompt = PromptDetailModel();
  int totalPageCnt = 0;
  int totalPromptsCnt = 0;
  int page = 0;
  String error = "";
  bool isLoading = false;

  // 프롬프트 목록 조회
  Future<void> getPromptList({keyword, category, sort, size}) async {
    isLoading = true;
    notifyListeners();
    try {
      Map<String, dynamic> data = await _promptRepository.getPromptListAPI(
          keyword, category, sort, page, size);
      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
      page += 1;
    } catch (e) {
      error = "error";
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // 프롬프트 상세 조회
  Future<void> getPromptDetail({promptUuid}) async {
    try {
      Map<String, dynamic> data =
          await _promptRepository.getPromptDetailAPI(promptUuid);
      prompt = data['prompt'];
      notifyListeners();
    } catch (e) {
      error = "error";
    }
  }

  // 프롬프트 북마크
  Future<Map<String, dynamic>> promptBookmark({promptUuid}) async {
    try {
      await _promptRepository.promptBookmarkAPI(promptUuid);
      return {'result': 'SUCCESS'};
    } catch (e) {
      return {'result': 'FAIL'};
    }
  }

  // 프롬프트 좋아요
  Future<Map<String, dynamic>> promptLike({promptUuid}) async {
    try {
      await _promptRepository.promptLikeAPI(promptUuid);
      return {'result': 'SUCCESS'};
    } catch (e) {
      return {'result': 'FAIL'};
    }
  }

  void initProvider() {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    page = 0;
    isLoading = false;
    error = "";
    prompt = PromptDetailModel();
    notifyListeners();
  }
}
