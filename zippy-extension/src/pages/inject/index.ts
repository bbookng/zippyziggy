/* eslint-disable */
const ENDPOINT_CONVERSATION = 'https://chat.openai.com/backend-api/conversation';

const ZIPPY = (window.ZIPPYZIGGY = {
  init() {
    console.log('ZP init');
    const nav = document.querySelector("nav");
    nav.querySelector("a").id = "new-chat-button";
    this.replaceFetch();
  },
  fetch: (window._fetch = window._fetch || window.fetch),
  selectedPrompt: "",
  targetLanguage: '영어',
  replaceFetch() {
    console.log('replace 실행');
    window.fetch = async (...t: Parameters<typeof fetch>) => {
      const [requestInfo, requestInit] = t;

      if (requestInfo !== ENDPOINT_CONVERSATION) return this.fetch(requestInfo, requestInit);

      try {
        const options = requestInit!;
        const body = JSON.parse(options.body as string);

        const prompt = body.messages[0].content.parts[0];
        body.messages[0].content.parts[0] = `Translate ${prompt} to ${this.targetLanguage}`;

        options.body = JSON.stringify(body);

        return await this.fetch(requestInfo, options);
      } catch (err) {
        console.error('Error modifying request body', err);

        // Error handling can be improved.
        // For example, you can display an error message to the user or do other processing.
        return this.fetch(requestInfo, requestInit);
      }
    };
  }
});

ZIPPY.init();

window.addEventListener('message', function(event) {
  switch (event.data.type){
    case "test":
      ZIPPY.targetLanguage = event.data.selected.targetLanguage;
      console.log(ZIPPY.targetLanguage);
        break;
    default:
      break;
  }
});



export default ZIPPY;
