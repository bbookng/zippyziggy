import '../../style.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PromptContainer = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  const [test, setTest] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isNewChatPage) {
      setIsLoading(true);
      axios.get('http://localhost:3003/data').then((data) => setTest(data.data));
      setIsLoading(false);
    }
  }, [isNewChatPage]);

  if (isNewChatPage) {
    return (
      <div className="inner-container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>로고?</div>
          <div>대분류</div>
          <div>유저이름?</div>
        </div>
        <div>검색바</div>

        <div>
          <div>필터</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>v
          </div>
        </div>
      </div>
    );
  }
  return <div>123123</div>;
};

export default PromptContainer;
