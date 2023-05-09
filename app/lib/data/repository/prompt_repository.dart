import "dart:convert";

import "package:app/data/model/prompt_model.dart";
import "package:app/services/api_service.dart";
import "package:http/http.dart" as http;

class PromptRepository {
  final APIService _apiService = APIService();

  // GET : 프롬프트 리스트 조회
  Future<Map<String, dynamic>> getPromptListAPI(String keyword, String category,
      String sort, String page, String size) async {
    Map<String, dynamic> params = {
      "keyword": keyword,
      "category": category,
      "sort": sort,
      "page": page,
      "size": size,
    };
    http.Response response = await _apiService.get("/search/prompts", params);
    dynamic responseJson = jsonDecode(utf8.decode(response.bodyBytes));
    final promptsData = responseJson["searchPromptList"] as List;
    List<PromptModel> promptList =
        promptsData.map((json) => PromptModel.fromJson(json)).toList();

    final totalPromptsCnt = responseJson["totalPromptsCnt"];
    final totalPageCnt = responseJson["totalPageCnt"];

    Map<String, dynamic> returnData = {
      "promptList": promptList,
      "totalPageCnt": totalPageCnt,
      "totalPromptsCnt": totalPromptsCnt,
    };
    return returnData;
  }

  // GET : 프롬프트 상세 조회
  Future<Map<String, dynamic>> getPromptDetailAPI(String promptUuid) async {
    http.Response response =
        await _apiService.get("/prompts/$promptUuid", null);
    dynamic responseJson = jsonDecode(utf8.decode(response.bodyBytes));
    final PromptDetailModel promptDetail =
        PromptDetailModel.fromJson(responseJson);
    Map<String, dynamic> returnData = {
      'result': 'SUCCESS',
      'prompt': promptDetail,
    };
    return returnData;
  }

  // 프롬프트 북마크
  Future<bool> promptBookmarkAPI(String promptUuid) async {
    http.Response response =
        await _apiService.post("/prompts/$promptUuid/bookmark", null);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // 프롬프트 좋아요
  Future<bool> promptLikeAPI(String promptUuid) async {
    http.Response response =
        await _apiService.post("/prompts/$promptUuid/like", null);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
