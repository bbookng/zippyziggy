// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const getCommentList = (page) => {
  const CommentList = [];
  // eslint-disable-next-line no-plusplus
  if (page >= 4) return CommentList;
  // eslint-disable-next-line no-plusplus
  for (let i = (page - 1) * 5; i < (page - 1) * 5 + 5; i++) {
    CommentList.push({
      member: {
        memberImg: '/images/noProfile.png',
        memberNickname: '김희제',
      },
      regDt: new Date().getTime() - i * 100000000,
      content: `${i}번째 댓글이다!!`,
    });
  }
  return CommentList;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  const { content } = req.body;
  if (req.method === 'GET') {
    const comments = getCommentList(page);
    res.status(200).json({
      comments,
      commentCnt: comments.length,
    });
  } else if (req.method === 'POST') {
    res.status(200).json({
      comments: [
        {
          member: {
            memberImg: '/images/noProfile.png',
            memberNickname: '김희제',
          },
          regDt: new Date().getTime() - 100000000,
          content,
        },
      ],
      commentCnt: 44,
    });
  }
}
