import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
const ENDPOINT_CONVERSATION =
  "https://chat.openai.com/backend-api/conversation";

window.ZIPPYZIGGY = {
  fetch: (window._fetch = window._fetch || window.fetch),

  init() {
    console.log(
      "######################################################################지피지기 실행#########################################################"
    );
    this.replaceFetch();
  },

  replaceFetch() {
    window.fetch = async (...t: Parameters<typeof fetch>) => {
      const [requestInfo, requestInit] = t;

      if (requestInfo !== ENDPOINT_CONVERSATION)
        return this.fetch(requestInfo, requestInit);

      try {
        const options = requestInit!;
        const body = JSON.parse(options.body as string);

        const prompt = body.messages[0].content.parts[0];
        body.messages[0].content.parts[0] = `Translate ${prompt} to English`;

        options.body = JSON.stringify(body);

        return await this.fetch(requestInfo, options);
      } catch (err) {
        console.error("Error modifying request body", err);

        // Error handling can be improved.
        // For example, you can display an error message to the user or do other processing.
        return this.fetch(requestInfo, requestInit);
      }
    };
  },
};

window.ZIPPYZIGGY.init();
refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.getElementsByTagName("form")[0].childNodes[0].appendChild(root);
createRoot(root).render(<App />);
