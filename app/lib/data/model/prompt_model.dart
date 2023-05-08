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

class Writer {
  final String? writerUuid;
  final String? writerImg;
  final String? writerNickname;

  Writer({
    this.writerUuid,
    this.writerImg,
    this.writerNickname,
  });

  factory Writer.fromJson(Map<String, dynamic> json) {
    return Writer(
      writerUuid: json['writerUuid'],
      writerImg: json['writerImg'],
      writerNickname: json['writerNickname'],
    );
  }
}
