// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';

type Data = {
  prompts: any;
};

const getPrompts = (page) => {
  const prompts = [];
  // eslint-disable-next-line no-plusplus
  for (let i = page * 6; i < page * 6 + 6; i++) {
    prompts.push({
      promptId: String(i),
      title: `${i}번째 프롬프트`,
      member: {
        memberName: `${i}번째 도전`,
        memberImg: '/images/noProfile.png',
      },
      cateory: `${i % 3 ? (i % 3 === 1 ? 'study' : 'programming') : null}`,
      content: `${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ ${i}번째 프롬프트 작성중~~~ `,
      likeCnt: i * 10,
      isBookmarked: false,
      thumbnail: '/images/ChatGPT_logo.png',
      updDt: new Date().getTime() - i * 100000000,
      hitCnt: 3 * i,
      talkCnt: 1 * i,
      commentCnt: 41 * i,
      forkCnt: i,
      forkImg: [{ url: '/images/noProfile.png' }],
    });
  }
  return prompts;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { page } = req.query;
  if (req.method === 'GET') {
    console.log(page);
    res.status(200).json({
      prompts: getPrompts(page),
    });
  }
}
