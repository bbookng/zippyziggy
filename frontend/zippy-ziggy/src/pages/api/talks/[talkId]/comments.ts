// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const getCommentList = (page) => {
  const CommentList = [];
  // eslint-disable-next-line no-plusplus
  for (let i = (page - 1) * 2; i < (page - 1) * 2 + 2; i++) {
    CommentList.push({
      member: {
        memberImg: '/images/noProfile.png',
        memberNickname: '김희제',
      },
      regDt: new Date(),
      content: `${i}번째 댓글이다!!`,
    });
  }
  return CommentList;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  if (req.method === 'GET') {
    const comments = getCommentList(page);
    res.status(200).json({
      comments,
      commentCnt: comments.length,
    });
  }
}
