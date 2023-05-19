import { serverUrl } from '@/lib/http';
import { useEffect, useState } from 'react';
import { EventListener, EventSourcePolyfill } from 'event-source-polyfill';
import { useAppSelector } from '@/hooks/reduxHook';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import { getNoticeUnreadCountAPI } from '@/core/notice/noticeAPI';

type EventListType = {
  url: string;
  content: string;
  alarmId: number;
  userEmail: string;
};

function UserSSE() {
  let eventSource: EventSourcePolyfill | undefined;
  let token = localStorage.getItem('accessToken');
  const [listening, setListening] = useState(false);
  const [noticeListSize, setNoticeListSize] = useState(0);
  const userState = useAppSelector((state) => state.user); // 유저정보

  // 알림 리스트 사이즈 받아오기
  const getNoticeListSize = async () => {
    const result = await getNoticeUnreadCountAPI();
    if (result.result === 'SUCCESS') {
      setNoticeListSize(result.data);
    }
  };

  const connectSSE = () => {
    token = localStorage.getItem('accessToken');
    if (!listening && token && !eventSource) {
      // sse 연결
      eventSource = new EventSourcePolyfill(`${serverUrl}/api/notice/subscribe`, {
        headers: {
          'Content-Type': 'text/event-stream',
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 86400000,
        withCredentials: true,
      });

      // 최초 연결
      eventSource.onopen = (event) => {
        event;
        // console.log('onopen');
        setListening(true);
      };

      // 서버에서 메시지 날릴 때
      eventSource.onmessage = (event) => {
        event;
      };

      eventSource.addEventListener('sse', ((event: MessageEvent) => {
        if (!event.data.includes('EventStream')) {
          const eventData: EventListType = JSON.parse(event.data);
          // console.log(eventData);
          getNoticeListSize();
          toast.success(`${eventData.content}`, {
            onClick: () => {
              Router.push(`/notification`);
            },
            icon: '🚀',
            position: 'bottom-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }) as EventListener);
    } else {
      // console.log('logout');
      eventSource?.close();
    }
  };

  useEffect(() => {
    connectSSE();

    return () => {
      if (!token && eventSource !== undefined) {
        eventSource.close();
        setListening(false);
      }
    };
  }, [token]);

  return <div>{noticeListSize}</div>;
}

export default UserSSE;
