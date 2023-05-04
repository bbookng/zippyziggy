import { useAppSelector } from '@/hooks/reduxHook';
import { TalksBalloonsProps, StyledTalksContainer, StyledTalksWrap } from './TalksBalloonsStyle';
import 'highlight.js/styles/atom-one-dark.css';
import ProfileImage from '../Image/ProfileImage';
import Paragraph from '../Typography/Paragraph';

// const strToDom = (str: string) => {
//   const parser = new DOMParser();

//   // dom 으로 파싱
//   const doc = parser.parseFromString(str, 'text/html');
//   console.log('doc', doc);

//   // 첫번째 이미지 태그의 src 값 get
//   const urlPath = doc.getElementsByTagName('img')[0].src;

//   // fileServer문자로 split
//   const strArr = urlPath.split('fileServer');
//   console.log('urlPath', strArr.toString());

//   // 파일의 경로만 get
//   const imgPath = strArr[1].toString();

//   // DOM 노드값을 문자열로 가져오기
//   const makeHtmlStr = doc.body.outerHTML;
//   return doc;
// };

const TalksBalloons = ({ writerImg, messages, ...rest }: TalksBalloonsProps) => {
  return (
    <div>
      <StyledTalksWrap>
        {messages.map((message, index) => (
          <div className={message.role === 'ASSISTANT' ? 'yours' : 'mine'} key={index}>
            <div className="messagesContainer">
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 0px' }}>
                <div style={{ width: 'fit-content' }}>
                  <ProfileImage
                    src={message.role === 'ASSISTANT' ? '\\images\\ChatGPT_logo.png' : writerImg}
                    alt="안녕"
                    size={36}
                  />
                </div>
                <div className="message">
                  <div
                    className="Container"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            </div>
            {/* <div className="message last">{strToDom(message.content)}</div> */}
          </div>
        ))}
      </StyledTalksWrap>
    </div>
  );
};

export default TalksBalloons;
