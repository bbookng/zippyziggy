import styled from 'styled-components';
import { serverUrl } from '@/lib/http';
import { useEffect, useState } from 'react';
import { EventListener, EventSourcePolyfill } from 'event-source-polyfill';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHook';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Title from '@/components/Typography/Title';
import {
  deleteNoticeItemAPI,
  deleteNoticeListAPI,
  getNoticeListAPI,
  getNoticeUnreadCountAPI,
  putNoticeItemAPI,
  putNoticeListAPI,
} from '@/core/notice/noticeAPI';
import Router from 'next/router';
import NoticesList from '@/components/Notice/NoticeList';
// userSlice에서 유저 정보 변경
import { setNoticeCount } from '@/core/user/userSlice';

const Container = styled.div`
  width: 100%;
`;

const Wrap = styled.div`
  padding: 48px 24px 48px 24px;
  margin: auto;
  display: flex;
  max-width: 480px;
  flex-direction: column;
  button {
    :hover {
      background-color: ${({ theme }) => theme.colors.linkColor};
      transform: translate(0px, -2px);
    }
  }
  .allButtonsContainer {
    button {
      margin: 8px 8px 8px 0px;
      background-color: ${({ theme }) => theme.colors.whiteColor70};
    }
  }

  ul {
    border-radius: 8px;
    cursor: pointer;
    li {
      border-top: 1px solid ${({ theme }) => theme.colors.blackColor05};
      border-left: 1px solid ${({ theme }) => theme.colors.blackColor05};
      border-right: 1px solid ${({ theme }) => theme.colors.blackColor05};
      padding: 16px;
      &.read {
        color: ${({ theme }) => theme.colors.blackColor30};
      }
      &.unread {
        background-color: ${({ theme }) => theme.colors.linkColor};
        color: ${({ theme }) => theme.colors.whiteColor};
        font-weight: 600;
      }
      .buttonContainer {
        margin-top: 8px;
        display: flex;
        justify-content: flex-end;
        button {
          margin-left: 8px;
          background-color: ${({ theme }) => theme.colors.whiteColor10};
        }
      }
    }
  }
  .moreBtn {
    border-radius: 0 0 8px 8px;
  }
`;

type EventListType = {
  url: string;
  content: string;
  alarmId: number;
  userEmail: string;
};

function Index() {
  // let eventSource: EventSourcePolyfill | undefined;
  const token = localStorage.getItem('accessToken');
  const userState = useAppSelector((state) => state.user); // 유저정보
  const [noticeList, setNoticeList] = useState([]);
  const [noticeListSize, setNoticeListSize] = useState(0);
  const [countNoticeList, setCountNoticeList] = useState(10);
  const dispatch = useAppDispatch();

  // 알림 리스트 전체 받아오기
  const getNoticeList = async (size = countNoticeList) => {
    const result = await getNoticeListAPI({ page: 0, size });
    if (result.result === 'SUCCESS') {
      setNoticeList(result.data);
    }
  };

  // 알림 리스트 사이즈 받아오기
  const getNoticeListSize = async () => {
    const result = await getNoticeUnreadCountAPI();
    if (result.result === 'SUCCESS') {
      setNoticeListSize(result.data);
      dispatch(setNoticeCount(result.data));
    }
  };

  useEffect(() => {
    getNoticeList();
    getNoticeListSize();
  }, [token]);

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (!listening && token && !eventSource) {
  //     // sse 연결
  //     eventSource = new EventSourcePolyfill(`${serverUrl}/api/notice/subscribe`, {
  //       headers: {
  //         'Content-Type': 'text/event-stream',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       heartbeatTimeout: 86400000,
  //       withCredentials: true,
  //     });

  //     // 최초 연결
  //     eventSource.onopen = (event) => {
  //       console.log('onopen');
  //       setListening(true);
  //     };

  //     // 서버에서 메시지 날릴 때
  //     eventSource.onmessage = (event) => {
  //       // setSseData(event.data);
  //       // setRespon(true);
  //       // console.log('onmessage');
  //       // if (event.data !== undefined) alert(event.data);
  //     };

  //     eventSource.addEventListener('sse', ((event: MessageEvent) => {
  //       if (!event.data.includes('EventStream')) {
  //         const eventData: EventListType = JSON.parse(event.data);
  //         // console.log(eventData);
  //         toast.success(`${eventData.content}`, {
  //           onClick: () => {
  //             Router.push(`/notification`);
  //           },
  //           icon: '🚀',
  //           position: 'bottom-right',
  //           autoClose: 1000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         });
  //       }
  //     }) as EventListener);
  //   } else {
  //     console.log('logout');
  //     eventSource?.close();
  //   }

  //   return () => {
  //     if (!token && eventSource !== undefined) {
  //       eventSource.close();
  //       setListening(false);
  //     }
  //   };
  // }, [userState.nickname]);

  // 모두 삭제 클릭
  const handleNoticeDelete = async () => {
    const result = await deleteNoticeListAPI();
    if (result.result === 'SUCCESS') {
      getNoticeList();
      getNoticeListSize();
    }
  };

  // 모두 조회 클릭
  const handleNoticeRead = async () => {
    const result = await putNoticeListAPI();
    if (result.result === 'SUCCESS') {
      getNoticeList();
      getNoticeListSize();
    }
  };

  // 아이템 조회 클릭
  const handleItemReadClick = async (alarmId: number) => {
    const result = await putNoticeItemAPI({ alarmId });
    if (result.result === 'SUCCESS') {
      getNoticeList();
      getNoticeListSize();
    }
  };

  // 아이템 삭제 클릭
  const handleItemDeleteClick = async (alarmId: number) => {
    const result = await deleteNoticeItemAPI({ alarmId });
    if (result.result === 'SUCCESS') {
      getNoticeList();
      getNoticeListSize();
    }
  };

  // 더보기 버튼 클릭
  const handleMoreBtn = async () => {
    await getNoticeList(countNoticeList + 10);
    await getNoticeListSize();
    await setCountNoticeList(countNoticeList + 10);
  };

  return (
    <Container>
      <Wrap>
        <Title textAlign="left">알림{`(${noticeListSize})`}</Title>
        <div className="allButtonsContainer">
          <button type="button" onClick={handleNoticeDelete}>
            전체 삭제
          </button>
          <button type="button" onClick={handleNoticeRead}>
            전체 읽음
          </button>
        </div>
        <NoticesList
          noticeList={noticeList}
          handleItemDeleteClick={handleItemDeleteClick}
          handleItemReadClick={handleItemReadClick}
        />
        <button className="moreBtn" type="button" onClick={handleMoreBtn}>
          더보기
        </button>
      </Wrap>
    </Container>
  );
}

export default Index;
