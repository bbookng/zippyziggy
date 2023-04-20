import '../../style.scss';

const PromptContainer = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  if (isNewChatPage)
    return (
      <div className="inner-container">
        <h1>프롬프트 카드가 렌더링 될 영역</h1>
      </div>
    );
  return null;
};

export default PromptContainer;
