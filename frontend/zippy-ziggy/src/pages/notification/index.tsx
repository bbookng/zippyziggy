import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/404.json';
import Paragraph from '@/components/Typography/Paragraph';
import styled from 'styled-components';
import { http, serverUrl } from '@/lib/http';
import { useEffect, useState } from 'react';
import { EventListener, EventSourcePolyfill } from 'event-source-polyfill';
import { useAppSelector } from '@/hooks/reduxHook';
import Button from '@/components/Button/Button';

const Styled404Container = styled.div`
  width: 100%;
`;

const Styled404Wrap = styled.div`
  margin: auto;
  padding: 24px;
  display: flex;
  max-width: 480px;
  flex-direction: column;
  .link {
    cursor: pointer;
    text-decoration: underline;
  }
`;

type EventListType = {
  url: string;
  content: string;
  alarmId: number;
  userEmail: string;
};

function Index() {
  let eventSource: EventSourcePolyfill | undefined;
  const token = localStorage.getItem('accessToken');
  const [listening, setListening] = useState(false);
  const [sseData, setSseData] = useState({});
  const [respon, setRespon] = useState(false);
  const userState = useAppSelector((state) => state.user); // 유저정보
  const [eventList, setEventList] = useState<EventListType[]>([]);
  const [eventListsize, setEventListsize] = useState(0);

  // sse
  const requestGetAlarms = async () => {
    setEventList([]);
    try {
      const response = await http.post('/notice/dispatchEvent', {
        memberUuid: userState.userUuid,
        content: 'test',
        urlValue: 'test',
      });
      console.log(response);
      setEventList(response.data);
      setEventListsize(response.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // requestGetAlarms();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!listening && token && !eventSource) {
      // sse 연결
      // http://localhost:8080/api/v1/subscribe
      // https://i8e204.p.ssafy.io/api/v1/subscribe
      eventSource = new EventSourcePolyfill(
        `${serverUrl}/api/notice/subscribe/${userState.userUuid}`,
        {
          headers: {
            'Content-Type': 'text/event-stream',
            // 'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${token}`,
            // 'Cache-Control': 'no-cache',
          },
          heartbeatTimeout: 86400000,
          withCredentials: true,
        }
      );

      // 최초 연결
      eventSource.onopen = (event) => {
        console.log('onopen');
        setListening(true);
      };

      // 서버에서 메시지 날릴 때
      eventSource.onmessage = (event) => {
        setSseData(event.data);
        setRespon(true);
        console.log('onmessage');
        if (event.data !== undefined) alert(event.data);
      };

      eventSource.addEventListener('sse', ((event: MessageEvent) => {
        if (!event.data.includes('EventStream')) {
          // requestGetAlarms();
        }
      }) as EventListener);
    } else {
      console.log('logout');
      eventSource?.close();
    }

    return () => {
      if (!token && eventSource !== undefined) {
        eventSource.close();
        setListening(false);
      }
    };
  }, []);

  return (
    <Styled404Container>
      <Styled404Wrap>
        <Lottie loop animationData={lottieJson} play />
        <Paragraph sizeType="lg" textAlign="center">
          페이지를 개발중입니다!
        </Paragraph>

        <Paragraph
          margin="12px 0 0 0"
          className="link"
          sizeType="lg"
          color="linkColor"
          textAlign="center"
        >
          <Button
            onClick={() => {
              requestGetAlarms();
            }}
          >
            dasf
          </Button>
          <a href="https://forms.gle/Lk4aTW94MNmam2my7">고객센터로 문의하기</a>
        </Paragraph>
      </Styled404Wrap>
    </Styled404Container>
  );
}

export default Index;
