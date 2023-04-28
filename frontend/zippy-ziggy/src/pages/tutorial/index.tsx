import Button from '@/components/Button/Button';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
  hight: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
  justify-content: center;
  flex-wrap: wrap;
`;

const Wrap = styled.div`
  body {
    font-family: helvetica;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chat {
    width: 300px;
    border: solid 1px #eee;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .messages {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
  }

  .message {
    border-radius: 20px;
    padding: 8px 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    white-space: pre-line;
    display: inline-block;
  }

  .yours {
    align-items: flex-start;
  }

  .yours .message {
    margin-right: 25%;
    background-color: #eee;
    position: relative;
  }

  .yours .message.last:before {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: -7px;
    height: 20px;
    width: 20px;
    background: #eee;
    border-bottom-right-radius: 15px;
  }
  .yours .message.last:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: -10px;
    width: 10px;
    height: 20px;
    background: white;
    border-bottom-right-radius: 10px;
  }

  .mine {
    align-items: flex-end;
  }

  .mine .message {
    color: white;
    margin-left: 25%;
    background: linear-gradient(to bottom, #00d0ea 0%, #0085d1 100%);
    background-attachment: fixed;
    position: relative;
  }

  .mine .message.last:before {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: 0;
    right: -8px;
    height: 20px;
    width: 20px;
    background: linear-gradient(to bottom, #00d0ea 0%, #0085d1 100%);
    background-attachment: fixed;
    border-bottom-left-radius: 15px;
  }

  .mine .message.last:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: -10px;
    width: 10px;
    height: 20px;
    background: white;
    border-bottom-left-radius: 10px;
  }
`;

export default function Tutorial() {
  const [nickname, setBeforeNickname] = useState('');

  const conversation = {
    L1: '안녕~ \n 저희 사이트가 뭐하는 곳인지 궁금해요?',
    R1: '질문에 대답해주세요',
    R1B1: '네 궁금해요! 알려주세요!',
    A: '지피지기는 프롬프트 엔지니어링을 ',
    L2: ' 프롬프트는 GPT에게 원하는 대답을 이끌어내는 방법입니다',
    L3: '만약 자세히 알고싶으면 이 링크에 들어가세요',
    L3LINK: 'https://modulabs.co.kr/blog/chatgpt-with-promptengineering/',
    R2: 'GPT에게 물어보세요',
    R2PLACEHOLDER: '질문을 입력하세요',
  };

  return (
    <Container>
      <Wrap>
        <Title>튜토리얼</Title>
        <Paragraph>튜토리얼이 뭔지 알아보자</Paragraph>
        <div className="chat">
          <div className="yours messages">
            <div className="message last">{conversation.L1}</div>
          </div>

          <div className="mine messages">
            <div className="message last">
              <p>{conversation.R1}</p>

              <div>
                <Button
                  display="block"
                  color="blackColor50"
                  height="fit-content"
                  width="100%"
                  padding="4px 16px"
                  margin="4px 0px"
                >
                  {conversation.R1B1}
                </Button>
              </div>
            </div>
          </div>

          <div className="yours messages">
            <div className="message last">{conversation.R1}</div>
          </div>

          <div className="mine messages">
            <div className="message last">
              <p>{conversation.R1}</p>
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <textarea
                    className="nickNameInput"
                    id="nickname"
                    placeholder={conversation.R1}
                    value={nickname}
                    onChange={(e) => setBeforeNickname(e.target.value)}
                    required
                  />
                </form>
              </div>
            </div>
          </div>
          {/* <div className="yours messages">
            <div className="message">Hey!</div>
            <div className="message">You there?</div>
            <div className="message last">Hello, how's it going?</div>
          </div>
          <div className="mine messages">
            <div className="message">Great thanks!</div>
            <div className="message last">How about you?</div>
          </div> */}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            className="nickNameInput"
            id="nickname"
            placeholder="질문을 입력하세요"
            value={nickname}
            onChange={(e) => setBeforeNickname(e.target.value)}
            required
          />
        </form>
      </Wrap>
    </Container>
  );
}
