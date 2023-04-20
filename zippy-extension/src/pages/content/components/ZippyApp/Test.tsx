import { useState } from "react";
import { createPortal } from "react-dom";
import { ZP_PROMPT_CONTAINER_ID } from "@pages/constants";

const Test = () => {
  const [currentURL, setCurrentURL] = useState(window.location.href);
  const isNewChatPage = !currentURL.includes("/c/");

  console.log("렌더");
  if (isNewChatPage) {
    return (
      <>
        {createPortal(
          <div style={{ position: "absolute" }}>123123123</div>,
          document.querySelector(`#${ZP_PROMPT_CONTAINER_ID}`)
        )}
      </>
    );
  }
  return null;
};

export default Test;
