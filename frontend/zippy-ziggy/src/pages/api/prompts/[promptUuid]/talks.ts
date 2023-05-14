// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const getTalks = (page) => {
  const talks = [];
  // eslint-disable-next-line no-plusplus
  for (let i = (page - 1) * 2; i < (page - 1) * 2 + 2; i++) {
    talks.push({
      member: {
        memberImg: '/images/noProfile.png',
        memberNickname: '김희제',
      },
      title: `${i}번째 Talk!!`,
      regDt: new Date(),
      likeCnt: i * 2,
      commentCnt: i,
    });
  }
  return talks;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  if (req.method === 'GET') {
    const talks = getTalks(page);
    res.status(200).json({
      talks,
      talkCnt: talks.length,
    });
  }
}
