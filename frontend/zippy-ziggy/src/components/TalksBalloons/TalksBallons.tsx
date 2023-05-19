import { TalksBalloonsProps, StyledTalksWrap } from './TalksBalloonsStyle';
import 'highlight.js/styles/atom-one-dark.css';
import ProfileImage from '../Image/ProfileImage';

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
