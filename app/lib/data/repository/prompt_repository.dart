import "package:zippy_ziggy/data/model/prompt_model.dart";
import "package:zippy_ziggy/services/dio_service.dart";
import "package:dio/dio.dart";

class PromptRepository {
  final DioService _dioService = DioService();

  // GET : 프롬프트 리스트 조회
  Future<Map<String, dynamic>> getPromptListAPI(
      String keyword, String category, String sort, int page, int size) async {
    Map<String, dynamic> params = {
      "keyword": keyword,
      "category": category,
      "sort": sort,
      "page": page,
      "size": size,
    };
    Response response = await _dioService.get("/search/prompts", params);
    final promptsData = response.data["searchPromptList"] as List;
    List<PromptModel> promptList =
        promptsData.map((json) => PromptModel.fromJson(json)).toList();

    final totalPromptsCnt = response.data["totalPromptsCnt"];
    final totalPageCnt = response.data["totalPageCnt"];

    Map<String, dynamic> returnData = {
      "promptList": promptList,
      "totalPageCnt": totalPageCnt,
      "totalPromptsCnt": totalPromptsCnt,
    };
    return returnData;
  }

  // GET : 프롬프트 상세 조회
  Future<Map<String, dynamic>> getPromptDetailAPI(String promptUuid) async {
    Response response = await _dioService.get("/prompts/$promptUuid", null);
    final PromptDetailModel promptDetail =
        PromptDetailModel.fromJson(response.data);
    Map<String, dynamic> returnData = {
      'result': 'SUCCESS',
      'prompt': promptDetail,
    };
    return returnData;
  }

  // POST : 프롬프트 북마크
  Future<bool> promptBookmarkAPI(String promptUuid) async {
    Response response =
        await _dioService.post("/prompts/$promptUuid/bookmark", null);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // POST : 프롬프트 좋아요
  Future<bool> promptLikeAPI(String promptUuid) async {
    Response response =
        await _dioService.post("/prompts/$promptUuid/like", null);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
