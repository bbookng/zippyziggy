class SocialSignUpModel {
  final String? name;
  final String? platform;
  final String? platformId;
  final String? profileImg;
  final String? userUuid;
  final String? nickname;

  SocialSignUpModel({
    this.name,
    this.platform,
    this.platformId,
    this.profileImg,
    this.userUuid,
    this.nickname,
  });

  factory SocialSignUpModel.fromJson(Map<String, dynamic> json) {
    return SocialSignUpModel(
      name: json['name'],
      platform: json['platform'],
      platformId: json['platformId'],
      profileImg: json['profileImg'],
      userUuid: json['userUuid'],
      nickname: json['nickname'],
    );
  }
}

class SignUpResponse {
  bool? isSignUp;
  SocialSignUpModel memberInformResponseDto;

  SignUpResponse(
      {required this.isSignUp, required this.memberInformResponseDto});

  factory SignUpResponse.fromJson(Map<String, dynamic> json) {
    return SignUpResponse(
      isSignUp: json['isSignUp'],
      memberInformResponseDto:
          SocialSignUpModel.fromJson(json['memberInformResponseDto']),
    );
  }
}
