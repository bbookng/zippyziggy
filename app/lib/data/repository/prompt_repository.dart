import "dart:convert";

import "package:app/data/model/prompt_model.dart";
import "package:app/services/api_service.dart";
import "package:http/http.dart" as http;

class PromptRepository {
  final APIService _apiService = APIService();

  // GET : 프롬프트 리스트 데이터
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

  Future<bool> promptBookmarkAPI(String promptUuid) async {
    http.Response response =
        await _apiService.post("/prompts/$promptUuid/bookmark", null);
    dynamic responseJson = jsonDecode(utf8.decode(response.bodyBytes));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
