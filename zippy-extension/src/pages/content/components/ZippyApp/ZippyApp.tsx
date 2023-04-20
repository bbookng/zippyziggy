import Test from "@pages/content/components/ZippyApp/Test";
import { useState } from "react";

export default function App() {
  const [showComponent, setShowComponent] = useState(false);

  // DOM 변경 감지를 위한 observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(async (mutation: any) => {
      if (
        mutation.target.className ===
        "px-2 py-10 relative w-full flex flex-col h-full"
      ) {
        setShowComponent(true);
      }
    });
  });

  observer.observe(document.querySelector("#__next"), {
    subtree: true,
    childList: true,
  });

  return (
    <>
      <button
        className="content-view"
        onClick={() => {
          console.log(1);
        }}
      >
        공유하기
      </button>
      {showComponent && <Test />}
    </>
  );
}
