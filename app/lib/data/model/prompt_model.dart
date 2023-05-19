class PromptModel {
  final String? promptUuid;
  final String? title;
  final String? description;
  final String? category;
  final String? originalPromptUuid;
  final String? thumbnail;
  final int? hit;
  final int? regDt;
  final int? updDt;
  final int? talkCnt;
  final int? commentCnt;
  final int? likeCnt;
  final bool? isLiked;
  final bool? isBookmarked;
  final Writer? writer;

  PromptModel({
    this.promptUuid,
    this.title,
    this.description,
    this.category,
    this.originalPromptUuid,
    this.thumbnail,
    this.hit,
    this.regDt,
    this.updDt,
    this.talkCnt,
    this.commentCnt,
    this.likeCnt,
    this.isLiked,
    this.isBookmarked,
    this.writer,
  });

  factory PromptModel.fromJson(Map<String, dynamic> json) {
    return PromptModel(
      promptUuid: json['promptUuid'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      originalPromptUuid: json['originalPromptUuid'],
      thumbnail: json['thumbnail'],
      hit: json['hit'],
      regDt: json['regDt'],
      updDt: json['updDt'],
      talkCnt: json['talkCnt'],
      commentCnt: json['commentCnt'],
      likeCnt: json['likeCnt'],
      isLiked: json['isLiked'],
      isBookmarked: json['isBookmarked'],
      writer: Writer.fromJson(json['writer']),
    );
  }
}

class PromptDetailModel {
  final String? promptUuid;
  final String? title;
  final String? description;
  final String? category;
  final String? originalPromptUuid;
  final String? thumbnail;
  final int? hit;
  final int? regDt;
  final int? updDt;
  final int? talkCnt;
  final int? commentCnt;
  final int? likeCnt;
  final bool? isLiked;
  final bool? isBookmarked;
  final Writer? writer;
  final Originer? originer;
  final MessageResponse? messageResponse;

  PromptDetailModel({
    this.promptUuid,
    this.title,
    this.description,
    this.category,
    this.originalPromptUuid,
    this.thumbnail,
    this.hit,
    this.regDt,
    this.updDt,
    this.talkCnt,
    this.commentCnt,
    this.likeCnt,
    this.isLiked,
    this.isBookmarked,
    this.writer,
    this.originer,
    this.messageResponse,
  });

  factory PromptDetailModel.fromJson(Map<String, dynamic> json) {
    return PromptDetailModel(
      promptUuid: json['promptUuid'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      originalPromptUuid: json['originalPromptUuid'],
      thumbnail: json['thumbnail'],
      hit: json['hit'],
      regDt: json['regDt'],
      updDt: json['updDt'],
      talkCnt: json['talkCnt'],
      commentCnt: json['commentCnt'],
      likeCnt: json['likeCnt'],
      isLiked: json['isLiked'],
      isBookmarked: json['isBookmarked'],
      writer: json['writer'] != null ? Writer.fromJson(json['writer']) : null,
      originer:
          json['originer'] != null ? Originer.fromJson(json['originer']) : null,
      messageResponse: MessageResponse.fromJson(json['messageResponse']),
    );
  }
}

class Writer {
  final String? writerUuid;
  final String? writerImg;
  final String? writerNickname;

  Writer({
    this.writerUuid,
    this.writerImg,
    this.writerNickname,
  });

  factory Writer.fromJson(Map<String, dynamic>? json) {
    return Writer(
      writerUuid: json?['writerUuid'],
      writerImg: json?['writerImg'],
      writerNickname: json?['writerNickname'],
    );
  }
}

class Originer {
  final String? originerUuid;
  final String? originerImg;
  final String? originerNickname;

  Originer({
    this.originerUuid,
    this.originerImg,
    this.originerNickname,
  });

  factory Originer.fromJson(Map<String, dynamic>? json) {
    return Originer(
      originerUuid: json?['originerUuid'],
      originerImg: json?['originerImg'],
      originerNickname: json?['originerNickname'],
    );
  }
}

class MessageResponse {
  final String? prefix;
  final String? example;
  final String? suffix;

  MessageResponse({
    this.prefix,
    this.example,
    this.suffix,
  });

  factory MessageResponse.fromJson(Map<String, dynamic> json) {
    return MessageResponse(
      prefix: json['prefix'],
      example: json['example'],
      suffix: json['suffix'],
    );
  }
}
