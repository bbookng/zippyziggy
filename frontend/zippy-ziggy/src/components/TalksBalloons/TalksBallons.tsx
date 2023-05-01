import { TalksBalloonsProps, StyledTalksContainer, StyledTalksWrap } from './TalksBalloonsStyle';
import 'highlight.js/styles/atom-one-dark.css';

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

const TalksBalloons = ({ messages, ...rest }: TalksBalloonsProps) => {
  return (
    <StyledTalksContainer>
      <StyledTalksWrap>
        {messages.map((message, index) => (
          <div
            className={message.role === 'yours' ? 'yours messages' : 'mine messages'}
            key={index}
          >
            <div className="message last">
              <div className="Container" dangerouslySetInnerHTML={{ __html: message.content }} />
            </div>

            {/* <div className="message last">{strToDom(message.content)}</div> */}
          </div>
        ))}
      </StyledTalksWrap>
    </StyledTalksContainer>
  );
};

export default TalksBalloons;
