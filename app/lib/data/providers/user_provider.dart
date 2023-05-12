import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/model/user_model.dart';
import 'package:zippy_ziggy/data/repository/user_repository.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProvider extends ChangeNotifier {
  static const storage = FlutterSecureStorage();
  final UserRepository _userRepository = UserRepository();
  SocialSignUpModel? user;
  String? code;
  String error = "";
  dynamic tmp;
  String? nickname;
  String? profileImg;
  String? userUuid;

  // 프롬프트 목록들
  List<PromptModel> _promptList = [];
  List<PromptModel> get promptList => _promptList;
  int totalPageCnt = 0;
  int totalPromptsCnt = 0;
  bool isLoading = false;
  int page = 0;

  // 카카오로그인API요청
  Future kakaoLogin() async {
    try {
      final data = await _userRepository.kakaoLoginAPI();
      code = data["data"];
      if (data["result"]) {
        try {
          Map<String, dynamic> res = await _userRepository.kakaoLogin(code!);
          if (res["isSignUp"] != null) {
            return {"result": "SIGNUP", "data": res["user"]};
          }
          user = res["user"];
          storage.write(key: "accessToken", value: res["accessToken"]);
          storage.write(key: "refreshToken", value: res["refreshToken"]);
          nickname = user!.nickname;
          profileImg = user!.profileImg;
          userUuid = user!.userUuid;

          return {"result": "LOGIN", "data": res["user"]};
        } catch (e) {
          return {"result": "FAIL", "data": e};
        }
      }
    } catch (err) {
      return {"result": "FAIL", "data": err};
    }
  }

  // 닉네임 중복검사
  Future<bool> getNickname(String nickname) async {
    try {
      final data = await _userRepository.getNicknameAPI(nickname);
      if (data['result'] == "SUCCESS") {
        print('중복검사 성공');
        return true;
      }
      print('중복검사 실패');
      return false;
    } catch (err) {
      print('중복검사 에러 $err');
      return false;
    }
  }

  // 회원가입 요청
  Future<bool> postSignUp(FormData formData) async {
    try {
      final data = await _userRepository.postSignUpAPI(formData);
      if (data['result'] == 'SUCCESS') {
        print('회원가입 성공');
        print(data);
        user = data['user'];
        storage.write(key: "accessToken", value: data["accessToken"]);
        storage.write(key: "refreshToken", value: data["refreshToken"]);
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        print('회원가입 실패');
        return false;
      }
    } catch (err) {
      print('회원가입 실패 $err');
      return false;
    }
  }

  // 회원정보수정 요청
  Future<bool> postUpdate(FormData formData) async {
    try {
      final data = await _userRepository.putUpdateAPI(formData);
      if (data['result'] == 'SUCCESS') {
        print('회원정보수정 성공');
        print(data);
        user = data['user'];
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        print('회원정보수정 실패');
        return false;
      }
    } catch (err) {
      print('회원정보수정 실패 $err');
      return false;
    }
  }

  // 로그아웃 요청
  Future<bool> postLogout() async {
    try {
      final data = await _userRepository.postLogoutAPI();
      print('로그아웃 응답 데이터 $data');
      if (data['result'] == 'SUCCESS') {
        print('로그아웃 성공');
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.remove('nickname');
        await prefs.remove('profileImg');
        await prefs.remove('userUuid');
        storage.delete(key: "accessToken");
        storage.delete(key: "refreshToken");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      print('로그아웃 실패 $err');
      return false;
    }
  }

  // 북마크 프롬프트 목록 조회
  Future<bool> getBookmarkedPromptList({userUuid, size}) async {
    isLoading = true;
    print('북마크 로딩시작 $isLoading 페이지 $page');
    print('북마크으으으으으으으으');
    notifyListeners();
    try {
      Map<String, dynamic> data = await _userRepository
          .getBookmarkedPromptListAPI(userUuid, page, size);

      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
      page += 1;
      print('다가져옴');
      return true;
    } catch (e) {
      print('북마크 프롬프트 목록 조회 실패 $e');
      return false;
    } finally {
      isLoading = false;
      print('로딩끝 $isLoading');
      notifyListeners();
    }
  }

  // 내 프롬프트 목록 조회
  Future<bool> getMyPromptList({userUuid, size}) async {
    isLoading = true;
    print('내 로딩시작 $isLoading, 페이지 $page');
    print('내애애애애애애');
    notifyListeners();
    try {
      Map<String, dynamic> data =
          await _userRepository.getMyPromptListAPI(userUuid, page, size);
      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
      page += 1;
      return true;
    } catch (e) {
      print('내 프롬프트 목록 조회 실패 $e');
      return false;
    } finally {
      isLoading = false;
      print('로딩끝 $isLoading');
      notifyListeners();
    }
  }

  // AccessToken으로 내 정보 가져오기
  Future<bool> getMyInfo() async {
    try {
      Map<String, dynamic> data = await _userRepository.getMyInfoAPI();
      if (data['result'] == 'SUCCESS') {
        user = data['user'];
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        print('유저 정보 조회 실패');
        return false;
      }
    } catch (err) {
      print('유저 정보 조회 실패 $err');
      return false;
    }
  }

  void initProvider() async {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    isLoading = false;
    page = 0;

    nickname = null;
    profileImg = null;
    userUuid = null;

    notifyListeners();
  }

  void resetPrompt() async {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    isLoading = false;
    page = 0;
    print('리셋');
    notifyListeners();
  }
}
