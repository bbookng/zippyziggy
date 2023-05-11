import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/model/user_model.dart';
import 'package:zippy_ziggy/services/dio_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/services.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';

class UserRepository {
  final DioService _dioService = DioService();

  // 카카오 로그인 API 요청
  Future<Map<String, dynamic>> kakaoLoginAPI() async {
    // 카카오톡 실행 가능 여부 확인
    if (await isKakaoTalkInstalled()) {
      // 카카오톡 실행이 가능하면 카카오톡으로 로그인, 아니면 카카오계정으로 로그인
      try {
        OAuthToken code = await UserApi.instance.loginWithKakaoTalk();
        print('카카오톡으로 로그인 성공 ${code.accessToken}');
        // String code = await AuthCodeClient.instance.authorizeWithTalk();
        // print('카카오톡으로 로그인 성공 $code');
        return {'result': true, 'data': code.accessToken};
      } catch (err) {
        print('카카오톡으로 로그인 실패 $err');

        // 사용자가 카카오톡 설치 후 디바이스 권한 요청 화면에서 로그인을 취소한 경우,
        // 의도적인 로그인 취소로 보고 카카오계정으로 로그인 시도 없이 로그인 취소로 처리 (예 : 뒤로가기)
        if (err is PlatformException && err.code == 'CANCELED') {
          return {'result': false, 'data': err};
        }

        // 카카오톡에 연결된 카카오계정이 없는 경우, 카카오계정으로 로그인
        try {
          OAuthToken code = await UserApi.instance.loginWithKakaoAccount();
          print('카카오계정으로 로그인 성공 ${code.accessToken}');
          // String code = await AuthCodeClient.instance.authorize();
          // print('카카오계정으로 로그인 성공 $code');
          return {'result': true, 'data': code.accessToken};
        } catch (err) {
          print('카카오계정으로 로그인 실패 $err');
          return {'result': false, 'data': err};
        }
      }
    } else {
      try {
        OAuthToken code = await UserApi.instance.loginWithKakaoAccount();
        print('카카오계정으로 로그인 성공 ${code.accessToken}');
        // String code = await AuthCodeClient.instance.authorize();
        // print('카카오계정으로 로그인 성공 $code');
        return {'result': true, 'data': code.accessToken};
      } catch (err) {
        print('카카오계정으로 로그인 실패 $err');
        return {'result': false, 'data': err};
      }
    }
  }

  // GET : 카카오 로그인 요청
  Future<Map<String, dynamic>> kakaoLogin(String code) async {
    Map<String, dynamic> params = {
      "code": code,
    };
    Response response =
        await _dioService.get("/members/auth/kakao/callback", params);

    // 회원가입 해야 되는 상황
    if (response.data["isSignUp"] != null) {
      final bool? isSignUp = response.data["isSignUp"];
      final String? nickname = response.data["nickname"];
      final String? profileImg = response.data["profileImg"];
      final String? userUuid = response.data["userUuid"];
      final SocialSignUpModel user = SocialSignUpModel.fromJson(
          response.data["socialSignUpDataResponseDto"]);
      return {
        "result": "SUCCESS",
        "isSignUp": isSignUp,
        "nickname": nickname,
        "profileImg": profileImg,
        "userUuid": userUuid,
        "user": user,
      };
    }

    // 로그인 성공시 토큰 반환
    final SocialSignUpModel user =
        SocialSignUpModel.fromJson(response.data['memberInformResponseDto']);
    final String accessToken = response.data['jwtToken']['accessToken'];
    final String refreshToken = response.data['jwtToken']['refreshToken'];
    return {
      "result": "SUCCESS",
      "user": user,
      "accessToken": accessToken,
      "refreshToken": refreshToken,
    };
  }

  // GET : 닉네임 중복 검사
  Future<Map<String, dynamic>> getNicknameAPI(String nickname) async {
    Response response =
        await _dioService.dio.get("/members/nickname/$nickname");
    if (response.data) {
      return {"result": "FAIL"};
    }
    return {"result": "SUCCESS"};
  }

  // POST : 회원가입 요청
  Future<Map<String, dynamic>> postSignUpAPI(FormData formData) async {
    Response response = await _dioService.dio.post(
      "/members/signup/app",
      data: formData,
      options: Options(
        headers: {'Content-Type': 'multipart/form-data'},
      ),
    );
    final SocialSignUpModel user =
        SocialSignUpModel.fromJson(response.data['memberInformResponseDto']);
    final String accessToken = response.data['jwtToken']['accessToken'];
    final String refreshToken = response.data['jwtToken']['refreshToken'];
    // set-cookie: refreshToken
    // authorization: accessToken

    return {
      "result": "SUCCESS",
      "user": user,
      "accessToken": accessToken,
      "refreshToken": refreshToken,
    };
  }

  // POST : 로그아웃 요청
  Future<Map<String, dynamic>> postLogoutAPI() async {
    Response response = await _dioService.post("/members/logout", null);
    if (response.statusCode == 200) {
      return {"result": "SUCCESS"};
    }
    return {"result": "FAIL"};
  }

  // GET : 유저의 북마크 프롬프트 조회
  Future<Map<String, dynamic>> getBookmarkedPromptListAPI(
      String userUuid, int page, int size) async {
    final params = {"page": page, "size": size};
    Response response =
        await _dioService.get("/members/prompts/bookmark/$userUuid", params);
    final promptsData = response.data["promptCardResponseList"] as List;
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
}
