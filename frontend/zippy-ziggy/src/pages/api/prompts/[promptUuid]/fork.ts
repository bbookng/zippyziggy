// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const getForks = (page) => {
  const forks = [];
  // eslint-disable-next-line no-plusplus
  for (let i = (page - 1) * 4; i < (page - 1) * 4 + 4; i++) {
    forks.push({
      title: `${i}번째 포크한 프롬프트`,
      nickname: '김희제',
      likeCnt: i,
    });
  }
  return forks;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  if (req.method === 'GET') {
    const forks = getForks(page);
    res.status(200).json({
      forks,
      forkCnt: forks.length,
    });
  }
}
