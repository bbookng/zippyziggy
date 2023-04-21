import '../../style.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PromptContainer = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  const [test, setTest] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:3003/data').then((data) => setTest(data.data));
    setIsLoading(false);
  }, []);

  if (isNewChatPage) {
    return (
      <div className="inner-container">
        {isLoading ||
          test.map((data) => (
            <div
              key={data.id}
              style={{ width: '200px', height: '200px', overflow: 'hidden' }}
              onClick={() => {
                window.postMessage({ type: 'test', selected: data });
              }}
            >
              <h1>{data.id}</h1>
              <h1>{data.title}</h1>
              <h1>{data.prompt}</h1>
            </div>
          ))}
      </div>
    );
  }
  return null;
};

export default PromptContainer;
