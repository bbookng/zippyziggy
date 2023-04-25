// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      writer: {
        writerId: '1',
        writerImg: '/images/noProfile.png',
        writerNickname: '이승기',
      },
      originer: {
        originerId: '2',
        originerImg: '/images/noProfile.png',
        originerNickname: '강호동',
      },
      title: '삼행시 프롬프트',
      description: '개그맨 느낌으로 말을 해주는 프롬프트입니다.',
      thumbnail: '/images/ChatGPT_logo.png',
      isLiked: false,
      isBookmarked: true,
      likeCnt: 12,
      message: {
        prefix: '당신은 개그맨입니다. 웃긴 말투로 말해주세요.',
        example: '계란으로 바위치기를 웃기게 말해주세요.',
        suffix: '저를 웃겨주세요.',
      },
    });
  } else if (req.method === 'DELETE') {
    res.status(200).json({});
  }
}
