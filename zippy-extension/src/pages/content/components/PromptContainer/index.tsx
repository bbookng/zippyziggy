import '../../style.scss';

const PromptContainer = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  if (isNewChatPage) return <div className="inner-container">123123123</div>;
  return null;
};

export default PromptContainer;
