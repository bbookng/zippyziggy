import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import replaceFetch from "@pages/content/components/utils/replaceFetch";

refreshOnUpdate("pages/content");

replaceFetch.init();
const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.getElementsByTagName("form")[0].childNodes[0].appendChild(root);
createRoot(root).render(<App />);
