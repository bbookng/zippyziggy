const Test = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  if (isNewChatPage) return <div style={{ position: 'absolute' }}>123123123</div>;
  return null;
};

export default Test;
