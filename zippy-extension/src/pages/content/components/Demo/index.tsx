import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import injectScript from "@pages/content/components/utils/injectScript";

refreshOnUpdate("pages/content");

// Define a function to append a button to the body
const addRoot = () => {
  if (document.querySelector("#zp-root")) return;
  const root = document.createElement("div");
  root.id = "zp-root";
  document.querySelector("form").appendChild(root);
  createRoot(root).render(<App />);
};
addRoot();
// Use MutationObserver to detect changes to the DOM
const observer = new MutationObserver((mutations) => {
  // Check each mutation for changes to the app's root element
  mutations.forEach((mutation: any) => {
    if (mutation.target.id === "__next") {
      // If the root element has changed, the app has been re-rendered
      addRoot();
    }
  });
});

// Start observing changes to the DOM
observer.observe(document.body, { subtree: true, childList: true });

injectScript();
