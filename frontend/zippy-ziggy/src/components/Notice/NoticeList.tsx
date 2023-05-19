import Router from 'next/router';
import { HTMLAttributes } from 'react';
import Link from 'next/link';
import Paragraph from '../Typography/Paragraph';

type NoticeItemType = {
  content: string | undefined;
  id: number;
  memberUuid: string;
  read: boolean;
  url: string;
};

interface NoticeItemPropsType extends HTMLAttributes<HTMLLIElement> {
  noticeItem: NoticeItemType;
  handleItemReadClick: (e) => void;
  handleItemDeleteClick: (e) => void;
}

interface NoticeListPropsType {
  noticeList: NoticeItemType[];
  handleItemReadClick: (e) => void;
  handleItemDeleteClick: (e) => void;
}

function NoticeItem({
  noticeItem,
  handleItemReadClick,
  handleItemDeleteClick,
}: NoticeItemPropsType) {
  const handleItemMoveBtn = () => {
    Router.push(`${noticeItem.url}`);
  };

  return (
    <li
      className={noticeItem.read ? 'read' : 'unread'}
      onClick={() => {
        handleItemReadClick(noticeItem.id);
      }}
    >
      <Link href={noticeItem.url}>{noticeItem.content}</Link>
      <div className="buttonContainer">
        <button
          type="button"
          onClick={() => {
            handleItemDeleteClick(noticeItem.id);
          }}
        >
          삭제
        </button>
        <button type="button" onClick={handleItemMoveBtn}>
          바로가기
        </button>
      </div>
    </li>
  );
}

const NoticesList = ({
  noticeList,
  handleItemReadClick,
  handleItemDeleteClick,
}: NoticeListPropsType) => {
  return (
    <ul>
      {noticeList.map((notice) => {
        return (
          <NoticeItem
            noticeItem={notice}
            key={notice.id}
            handleItemReadClick={handleItemReadClick}
            handleItemDeleteClick={handleItemDeleteClick}
          />
        );
      })}
    </ul>
  );
};

export default NoticesList;
