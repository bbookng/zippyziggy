import { AIPRMClient, Reaction } from "./client.js";

import {
  ActivityFeedURL,
  AppAccountURL,
  AppCommunityForumURL,
  AppName,
  AppURL,
  Config,
  ConfigURL,
  ContinueActionsFeedURL,
  CrawledSourcePlaceholder,
  CrawledTextPlaceholder,
  EndpointConversation,
  ExportFilePrefix,
  ExportHeaderPrefix,
  LanguageFeedURL,
  PromptPlaceholder,
  TargetLanguagePlaceholder,
  VariablePlaceholder,
  VariableDefinition,
  ToneFeedURL,
  TopicFeedURL,
  WritingStyleFeedURL,
} from "./config.js";

/* eslint-disable no-unused-vars */
import {
  ListTypeNo,
  MessageVoteTypeNo,
  NotificationSeverity,
  PromptTemplatesType,
  PromptTypeNo,
  SortModeNo,
  SubPromptTypeNo,
  UsageTypeNo,
  UserLevelNo,
} from "./enums.js";
/* eslint-enable */

import { createReportPromptModal } from "./feedback.js";
import { List, Lists } from "./list.js";
import { showMessage } from "./messages.js";
import { ReactionNo } from "./rxn.js";

import {
  capitalizeWords,
  css,
  formatDateTime,
  formatAgo,
  formatHumanReadableNumber,
  hideModal,
  sanitizeInput,
  svg,
} from "./utils.js";

/**
 * @typedef {Object} PromptVariable
 * @property {number} ID
 * @property {string} Label
 * @property {string} DefaultValue
 * @property {string[]} EnumS
 */

/**
 * @typedef {Object} Prompt
 * @property {string} ID
 * @property {string} Category - Activity of the prompt (e.g. "Writing")
 * @property {string} Community - Topic of the prompt (e.g. "SEO")
 * @property {string} Prompt - The prompt text
 * @property {string} PromptHint - The prompt hint text (placeholder)
 * @property {PromptTypeNo} PromptTypeNo - public, private or paid prompt
 * @property {string} Title
 * @property {string} Help
 * @property {string} Teaser
 * @property {boolean} OwnPrompt - Whether the prompt is owned by the current user
 * @property {string} RevisionTime
 * @property {string} AuthorName
 * @property {string} AuthorURL
 * @property {string} [ForkedFromPromptID]
 * @property {number} Usages
 * @property {number} Views
 * @property {number} Votes
 * @property {boolean} [IsFavorite]
 * @property {boolean} [IsHidden]
 * @property {boolean} [IsVerified]
 * @property {PromptVariable[]} [PromptVariables]
 */

/** @typedef {{langcode: string, languageEnglish: string, languageLabel: string}} Language */

/** @typedef {{ID: string, Label: string}} Topic */

/** @typedef {{ID: string, TopicID: string, Label: string}} Activity */

/** @typedef {{ID: number, Label: string}} Tone */

/** @typedef {{ID: number, Label: string}} WritingStyle */

/** @typedef {{ID: number, Label: string, Prompt: string}} ContinueAction */

const DefaultPromptActivity = "all";
const DefaultPromptTopic = "all";
const DefaultTargetLanguage = "English*";

const lastPromptTopicKey = "lastPromptTopic";
const lastTargetLanguageKey = "lastTargetLanguage";
const lastPageSizeKey = "lastPageSize";
const lastPromptTemplateTypeKey = "lastPromptTemplateType";
const lastListIDKey = "lastListID";

const queryParamPromptID = "AIPRM_PromptID";
const queryParamVariable = "AIPRM_VARIABLE";

// The number of prompts per page in the prompt templates section
const pageSizeOptions = [4, 8, 12, 16, 20];
const pageSizeDefault = 12;

const editPromptTemplateEvent = "editPromptTemplate";

const variableWrapperID = "AIPRM__variable-wrapper";
const variableIDPrefix = "AIPRM__VARIABLE";

window.AIPRM = {
  // Save a reference to the original fetch function
  fetch: (window._fetch = window._fetch || window.fetch),

  CacheBuster: btoa(new Date().toISOString().slice(0, 16).toString()),

  Client: AIPRMClient,

  /** @type {Config} */
  Config: null,

  // Set default TargetLanguage based on last used language or default to English
  TargetLanguage:
    localStorage.getItem(lastTargetLanguageKey) === null
      ? DefaultTargetLanguage
      : localStorage.getItem(lastTargetLanguageKey),

  // Set default Tone
  Tone: null,

  // Set default WritingStyle
  WritingStyle: null,

  // Set default topic
  PromptTopic: localStorage.getItem(lastPromptTopicKey) || DefaultPromptTopic,

  // Set default activity
  PromptActivity: DefaultPromptActivity,

  // Set default sort mode
  /** @type {SortModeNo} */
  PromptSortMode: SortModeNo.TOP_VOTES,

  // Set default search query
  PromptSearch: "",

  // Set default prompt templates type
  /** @type {PromptTemplatesType} */
  PromptTemplatesType: PromptTemplatesType.PUBLIC,

  /**
   * Set default prompt templates list
   *
   * @type {import('./client.js').List['ID']}
   */
  PromptTemplatesList: null,

  /** @type {Prompt[]} */
  PromptTemplates: [],

  /** @type {Prompt[]} */
  OwnPrompts: [],

  /** @type {Language[]} */
  Languages: [],

  /** @type {Tone[]} */
  Tones: [],

  /** @type {WritingStyle[]} */
  WritingStyles: [],

  /** @type {ContinueAction[]} */
  ContinueActions: [],

  /** @type {Lists} */
  Lists: new Lists(),

  /** @type {Topic[]} */
  Topics: [],

  /** @type {Activity[]} */
  Activities: [],

  // true if admin mode is enabled
  AdminMode: false,

  // This object contains properties for the prompt templates section
  PromptTemplateSection: {
    currentPage: 0, // The current page number
    pageSize: +localStorage.getItem(lastPageSizeKey) || pageSizeDefault, // The number of prompts per page
  },

  /** @type {?Prompt} */
  SelectedPromptTemplate: null,

  async init() {
    console.log("AIPRM init");

    // Bind event handler for arrow keys
    this.boundHandleArrowKey = this.handleArrowKey.bind(this);

    await this.Client.init();

    this.replaceFetch();

    this.createObserver();

    if (!this.Client.UserQuota.connectAccountAnnouncement()) {
      this.fetchMessages();
    }

    // Wait for lists, topics and activities
    await Promise.all([
      this.fetchLists(),
      this.fetchTopics(),
      this.fetchActivities(),
    ]);

    this.loadPromptTemplateTypeAndListFromLocalStorage();

    this.fetchPromptTemplates();

    // Wait for languages, tones, writing styles and continue actions
    await Promise.all([
      this.fetchLanguages(),
      this.fetchTones(),
      this.fetchWritingStyles(),
      this.fetchContinueActions(),
    ]);

    this.insertLanguageToneWritingStyleContinueActions();

    this.insertVariablesInputWrapper();

    this.setupSidebar();

    this.fetchPromptFromDeepLink();

    // on state change (e.g. back button) fetch the prompt from the deep link
    window.addEventListener("popstate", () => {
      this.fetchPromptFromDeepLink();
    });

    // listen for AIPRM.tokens event from AIPRM APP
    document.addEventListener("AIPRM.tokens", async (event) => {
      this.handleTokensEvent(event);
    });

    // fetch config from remote JSON file
    await this.fetchConfig();

    this.addWatermark();
  },

  // fetch config from remote JSON file
  async fetchConfig() {
    try {
      const response = await this.fetch(ConfigURL + this.CacheBuster);

      if (!response.ok) {
        throw new Error("Could not fetch config");
      }

      const config = await response.json();

      this.Config = new Config(config);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Replace CRAWLEDTEXT/CRAWLEDSOURCE placeholder with live crawled content
   *
   * @param {string} sourceURL - The prompt text (should be URL)
   * @param {string} message - The prompt message with replacement placeholder
   * @returns {Promise<string>} - The prompt message with injected live crawled content
   */
  async injectLiveCrawlingResult(sourceURL, message) {
    // check if message contains CRAWLEDTEXT/CRAWLEDSOURCE placeholder
    if (
      !message.includes(CrawledTextPlaceholder) &&
      !message.includes(CrawledSourcePlaceholder)
    ) {
      return message;
    }

    // check if live crawling is enabled
    if (!this.Config.isLiveCrawlingEnabled()) {
      this.showNotification(
        NotificationSeverity.WARNING,
        "Live Crawling is currently disabled. Please try again later."
      );

      // remove CRAWLEDTEXT/CRAWLEDSOURCE placeholder from message (let ChatGPT to guess at least using the URL)
      return message
        .replace(CrawledTextPlaceholder, "")
        .replace(CrawledSourcePlaceholder, "");
    }

    // check if user can use live crawling
    if (!this.Client.UserQuota.canUseLiveCrawling()) {
      return;
    }

    // trim the whitespace from the URL
    sourceURL = sourceURL ? sourceURL.trim() : sourceURL;

    const content = await this.fetchContent(sourceURL);

    if (!content) {
      throw new Error("No crawled content found");
    }

    // generate GUID using crypto API used to identify the crawled content in the message and prevent prompt injection
    const GUID = crypto.randomUUID();

    // replace CRAWLEDTEXT placeholder with parsed crawled text
    if (message.includes(CrawledTextPlaceholder)) {
      let crawledText = this.parseCrawledText(content, sourceURL);

      crawledText = this.Config.getLiveCrawlingConfig()
        .CrawledTextPrompt.replaceAll("[GUID]", GUID)
        .replaceAll(CrawledTextPlaceholder, crawledText);

      return message.replaceAll(CrawledTextPlaceholder, crawledText);
    }

    // replace CRAWLEDSOURCE placeholder with crawled source
    if (message.includes(CrawledSourcePlaceholder)) {
      const crawledSource = this.limitTextLength(
        content,
        this.Config.getLiveCrawlingConfig().MaxWords,
        this.Config.getLiveCrawlingConfig().MaxCharacters
      );

      this.showNotification(
        NotificationSeverity.SUCCESS,
        `Live Crawling of "${sanitizeInput(
          sourceURL
        )}" finished - submitting prompt ...`
      );

      return message.replaceAll(
        CrawledSourcePlaceholder,
        this.Config.getLiveCrawlingConfig()
          .CrawledSourcePrompt.replaceAll("[GUID]", GUID)
          .replaceAll(CrawledSourcePlaceholder, crawledSource)
      );
    }

    return message;
  },

  /**
   * Parse the HTML content and return the title, excerpt and text content
   *
   * @param {string} content
   * @param {string} URL
   * @returns string
   */
  parseCrawledText(content, URL) {
    // Parse the HTML content
    let doc = new DOMParser().parseFromString(content, "text/html");

    // Parse the title and excerpt from the HTML content
    let parsed = new window.Readability(doc).parse();

    if (!parsed || !parsed.title || !parsed.excerpt) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Live Crawling of "${sanitizeInput(
          URL
        )}" failed - could not parse content.`
      );

      return;
    }

    // remove excessive new lines and whitespace from textContent and shorten it to max. words & characters with ellipsis
    const textContent =
      this.limitTextLength(
        parsed.textContent,
        this.Config.getLiveCrawlingConfig().MaxWords,
        this.Config.getLiveCrawlingConfig().MaxCharacters
      ) + " ...";

    this.showNotification(
      NotificationSeverity.SUCCESS,
      `Live Crawling of "${sanitizeInput(
        URL
      )}" finished - submitting prompt ...`
    );

    return `
${parsed.title}

${parsed.excerpt}

${textContent}
`;
  },

  // remove excessive new lines/whitespace and limit the number of words and characters in the text
  limitTextLength(text = "", maxWords = 0, maxCharacters = 0) {
    const words = text
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .split(/\s+/);

    const limitedWords = words.slice(0, maxWords);

    return limitedWords.join(" ").slice(0, maxCharacters);
  },

  // try to fetch and parse the title and excerpt from the URL using CORS proxy and Readability library
  async fetchContent(sourceURL) {
    if (!sourceURL) {
      this.showNotification(
        NotificationSeverity.WARNING,
        "No URL was found for Live Crawling."
      );

      return;
    }

    // validate if URL is valid using URL parser
    try {
      new URL(sourceURL);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "No valid URL was found for Live Crawling."
      );

      return;
    }

    // doesn't look like a URL
    if (!sourceURL.match(/^(https?:\/\/)/)) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "No valid URL was found for Live Crawling."
      );

      return;
    }

    let res;

    // Fetch content from the URL
    try {
      this.showNotification(
        NotificationSeverity.INFO,
        `Live Crawling of "${sanitizeInput(sourceURL)}" started ...`,
        false
      );

      res = await fetch(
        this.Config.getLiveCrawlingConfig().APIEndpointURL +
          encodeURIComponent(sourceURL)
      );
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Live Crawling of "${sanitizeInput(
          sourceURL
        )}" failed. Please try again later.`
      );

      return;
    }

    if (!res.ok) {
      console.error("Live Crawling failed", res.status);

      this.showNotification(
        NotificationSeverity.ERROR,
        `Live Crawling of "${sanitizeInput(
          sourceURL
        )}" failed. Please try again later.`
      );

      return;
    }

    this.showNotification(
      NotificationSeverity.INFO,
      `Live Crawling of "${sanitizeInput(
        sourceURL
      )}" finished - parsing content ...`,
      false
    );

    // Get the response text
    return res.text();
  },

  /**
   * Check if the prompt contains placeholders for live crawling
   *
   * @param {Prompt['Prompt']} prompt
   * @returns {boolean}
   */
  promptRequiresLiveCrawling(prompt) {
    return (
      prompt.includes(CrawledTextPlaceholder) ||
      prompt.includes(CrawledSourcePlaceholder)
    );
  },

  // handle AIPRM.tokens event from AIPRM APP
  async handleTokensEvent(event) {
    // store tokens in local storage
    this.Client.storeTokens(event.detail.tokens);

    // link OpenAI user to AIPRM user and account
    try {
      await this.Client.linkUser();
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Could not connect your OpenAI account to AIPRM, please try again later.",
        false
      );

      return;
    }

    try {
      // refresh AIPRM user profile and quota
      await this.Client.checkUserStatus();

      // show notification if connection status is not updated, yet
      if (!this.Client.User.IsLinked) {
        this.showNotification(
          NotificationSeverity.INFO,
          "Connecting your OpenAI account to AIPRM, please wait...",
          false
        );
      }

      // wait for CheckUserStatus to update the connection status, quotas and user profile
      while (!this.Client.User.IsLinked) {
        // poll checkUserStatus every 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await this.Client.checkUserStatus();
      }
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Could not get your AIPRM user profile, please try again later.",
        false
      );

      return;
    }

    // show notification if user is logged in using AIPRM account
    if (this.Client.AppUser) {
      this.showNotification(
        NotificationSeverity.SUCCESS,
        `You are now logged in using AIPRM account "${sanitizeInput(
          this.Client.AppUser.Name
        )} (${sanitizeInput(this.Client.AppUser.Email)})"`,
        false
      );
    }

    // refresh the prompt templates section to show link to AIPRM account
    await this.insertPromptTemplatesSection();
  },

  // get the prompt ID from the URL and select the prompt template
  async fetchPromptFromDeepLink() {
    // Get the prompt ID from the URL (AIPRM_PromptID)
    const params = new URLSearchParams(window.location.search);
    const promptID = params.get(queryParamPromptID);

    if (!promptID) {
      // If there is no prompt ID in the URL - deselect the prompt template
      await this.selectPromptTemplateByIndex(null);

      return;
    }

    // If the prompt is already selected, do nothing
    if (
      this.SelectedPromptTemplate &&
      this.SelectedPromptTemplate.ID === promptID
    ) {
      return;
    }

    let prompt;

    try {
      // Fetch the prompt using the AIPRM API client
      prompt = await this.Client.getPrompt(promptID);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return;
    }

    if (!prompt) {
      return;
    }

    // Select the prompt template
    this.selectPromptTemplate(prompt);

    // Pre-fill the prompt variables from the URL
    if (prompt.PromptVariables) {
      prompt.PromptVariables.forEach((promptVariable) => {
        const param = params.get(queryParamVariable + promptVariable.ID);
        if (param) {
          const variableElement = document.querySelector(
            "#" + variableIDPrefix + promptVariable.ID
          );

          if (variableElement) {
            variableElement.value = param;
          }
        }
      });
    }
  },

  // Fetch the list of messages from the server
  async fetchMessages() {
    showMessage(
      await this.Client.getMessages(
        this.PromptTopic === DefaultPromptTopic ? "" : this.PromptTopic
      ),
      this.confirmMessage.bind(this),
      this.voteForMessage.bind(this)
    );
  },

  /**
   * Confirm a message using the AIPRM API client
   *
   * @param {string} MessageID
   * @returns {Promise<boolean>} Whether the message was confirmed successfully
   */
  async confirmMessage(MessageID) {
    try {
      await this.Client.confirmMessage(MessageID);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return false;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      "Thanks for the confirmation!"
    );

    return true;
  },

  /**
   * Vote for a message using the AIPRM API client
   *
   * @param {string} MessageID
   * @param {MessageVoteTypeNo} VoteTypeNo
   * @returns boolean Whether the message was voted for successfully
   */
  async voteForMessage(MessageID, VoteTypeNo) {
    try {
      await this.Client.voteForMessage(MessageID, VoteTypeNo);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return false;
    }

    return true;
  },

  // This function sets up the chat sidebar by adding an "Export Button" and modifying
  // the "New Chat" buttons to clear the selected prompt template when clicked
  setupSidebar() {
    // Add the "Export Button" to the sidebar
    this.addExportButton();
    // Get the "New Chat" buttons
    const buttons = this.getNewChatButtons();
    // Set the onclick event for each button to clear the selected prompt template
    buttons.forEach((button) => {
      button.onclick = async () => {
        await this.selectPromptTemplateByIndex(null);

        // Hide the "Continue Writing" button (no prompt selected/new chat)
        this.hideContinueActionsButton();
      };
    });
  },

  // Fetch the lists using the AIPRM API client
  async fetchLists() {
    try {
      const lists = await this.Client.getAllListsWithDetails();

      this.Lists = new Lists(
        lists.map((list) => {
          return new List(this.Client, list);
        })
      );
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not load the prompts lists. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }
  },

  // Fetch the list of topics from a remote CSV file
  async fetchTopics() {
    return (
      this.fetch(TopicFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to topic objects with properties 'ID' and 'Label'
        .then((records) => {
          return (
            records
              .map(([ID, Label]) => {
                return { ID, Label };
              })
              // Filter out records that do not have an ID, or it is the header row (with "ID" as its title)
              .filter(({ ID }) => ID && ID !== "ID")
          );
        })
        .then((topics) => {
          // Sort and save the topics
          this.Topics = topics.sort((a, b) => a.Label.localeCompare(b.Label));
        })
    );
  },

  // Fetch the list of activities from a remote CSV file
  async fetchActivities() {
    return (
      this.fetch(ActivityFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to activity objects with properties 'TopicID', 'ID', and 'Label'
        .then((records) => {
          return (
            records
              .map(([TopicID, ID, Label]) => {
                return { TopicID, ID, Label };
              })
              // Filter out records that do not have an ID, or it is the header row (with "ID" as its title)
              .filter(({ ID }) => ID && ID !== "ID")
          );
        })
        .then((activities) => {
          // Sort and save the array of activities
          this.Activities = activities.sort((a, b) =>
            a.Label.localeCompare(b.Label)
          );
        })
    );
  },

  fetchLanguages() {
    // Fetch the list of languages from a remote CSV file
    return (
      this.fetch(LanguageFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to language objects with properties 'langcode', 'languageEnglish' and 'languageLabel'
        .then((records) => {
          return (
            records
              .map(([langcode, languageEnglish, languageLabel]) => {
                return { langcode, languageEnglish, languageLabel };
              })
              // Filter out records that do not have a language code, or it is the header row (with "langcode" as its title)
              .filter(({ langcode }) => langcode && langcode !== "langcode")
          );
        })
        .then((languages) => {
          // Save the array of languages to a global variable
          this.Languages = languages;
        })
    );
  },

  // Fetch list of tones from a remote CSV file
  fetchTones() {
    // use custom tones from AccountSubPrompts
    /** @type {Tone[]} */
    const customTones = this.Client.AccountSubPrompts
      // filter out prompts that are not custom tones
      .filter((prompt) => prompt.TypeNo === SubPromptTypeNo.CustomTones)
      // map the prompts to tones
      .map((prompt) => {
        return {
          ID: parseInt(prompt.PromptID),
          Label: prompt.Label,
        };
      });

    // if there are custom tones, combine them with the default tones
    if (customTones.length > 0) {
      this.Tones = customTones;
    }

    return (
      this.fetch(ToneFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to tone objects with properties 'ID' and 'Label'
        .then((records) => {
          return (
            records
              .map(([ID, Label]) => {
                return { ID: parseInt(ID), Label };
              })
              // Filter out records that do not have an ID, or it is the header row (with "ID" as its title)
              .filter(({ ID }) => ID && ID !== "ID")
          );
        })
        .then((tones) => {
          // Append the default tones to the custom tones and sort the tones by Label
          this.Tones = [...this.Tones, ...tones].sort((a, b) =>
            a.Label.localeCompare(b.Label)
          );
        })
    );
  },

  // Fetch list of writing styles from a remote CSV file
  fetchWritingStyles() {
    // use custom writing styles from AccountSubPrompts
    /** @type {WritingStyle[]} */
    const customWritingStyles = this.Client.AccountSubPrompts
      // filter out prompts that are not custom writing styles
      .filter((prompt) => prompt.TypeNo === SubPromptTypeNo.CustomStyles)
      // map the prompts to writing styles
      .map((prompt) => {
        return {
          ID: parseInt(prompt.PromptID),
          Label: prompt.Label,
        };
      });

    // if there are custom writing styles, combine them with the default writing styles
    if (customWritingStyles.length > 0) {
      this.WritingStyles = customWritingStyles;
    }

    return (
      this.fetch(WritingStyleFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to writing style objects with properties 'ID' and 'Label'
        .then((records) => {
          return (
            records
              .map(([ID, Label]) => {
                return { ID: parseInt(ID), Label };
              })
              // Filter out records that do not have an ID, or it is the header row (with "ID" as its title)
              .filter(({ ID }) => ID && ID !== "ID")
          );
        })
        .then((writingStyles) => {
          // Append the default writing styles to the custom writing styles and sort the writing styles by Label
          this.WritingStyles = [...this.WritingStyles, ...writingStyles].sort(
            (a, b) => a.Label.localeCompare(b.Label)
          );
        })
    );
  },

  // Fetch list of continue actions from a remote CSV file
  fetchContinueActions() {
    // use custom continue actions from AccountSubPrompts
    /** @type {ContinueAction[]} */
    const customContinueActions = this.Client.AccountSubPrompts
      // filter out prompts that are not custom continue actions
      .filter((prompt) => prompt.TypeNo === SubPromptTypeNo.CustomContinue)
      // map the prompts to continue actions
      .map((prompt) => {
        return {
          ID: parseInt(prompt.PromptID),
          Label: prompt.Label,
          Prompt: prompt.Prompt,
        };
      });

    // if there are custom continue actions, combine them with the default continue actions
    if (customContinueActions.length > 0) {
      this.ContinueActions = customContinueActions;
    }

    return (
      this.fetch(ContinueActionsFeedURL + this.CacheBuster)
        // Convert the response to text
        .then((res) => res.text())
        // Convert the CSV text to an array of records
        .then((csv) => this.CSVToArray(csv))
        // Map the records to continue action objects with properties 'ID', 'Label, and 'Prompt'
        .then((records) => {
          return (
            records
              .map(([ID, Label, Prompt]) => {
                return { ID: parseInt(ID), Label, Prompt };
              })
              // Filter out records that do not have an ID, or it is the header row (with "ID" as its title)
              .filter(({ ID }) => ID && ID !== "ID")
          );
        })
        .then((continueActions) => {
          // Append the default continue actions to the custom continue actions and sort the continue actions by Label
          this.ContinueActions = [
            ...this.ContinueActions,
            ...continueActions,
          ].sort((a, b) => a.Label.localeCompare(b.Label));
        })
    );
  },

  // Load Prompt Templates type and list ID from local storage
  loadPromptTemplateTypeAndListFromLocalStorage() {
    const lastPromptTemplateType = localStorage.getItem(
      lastPromptTemplateTypeKey
    );
    const lastListID = localStorage.getItem(lastListIDKey);

    let matched = false;

    switch (lastPromptTemplateType) {
      // Public or Own Prompt Templates
      case PromptTemplatesType.PUBLIC:
      case PromptTemplatesType.OWN:
        matched = true;
        this.PromptTemplatesType = lastPromptTemplateType;
        this.PromptTemplatesList = null;
        break;

      // Custom List Prompt Templates
      case PromptTemplatesType.CUSTOM_LIST:
        // Check if the last list ID is valid, exists and the user can use it
        if (
          lastListID &&
          // Hidden List
          ((lastListID == this.Lists.getHidden()?.ID &&
            this.Client.UserQuota.canUseHiddenOnlyCheck()) ||
            // Favorites List
            (lastListID == this.Lists.getFavorites()?.ID &&
              this.Client.UserQuota.canUseFavoritesOnlyCheck()) ||
            // AIPRM Verified List
            (lastListID == this.Lists.getAIPRMVerified()?.ID &&
              this.Client.UserQuota.canUseAIPRMVerifiedList(false)) ||
            // Custom List
            (this.Lists.withIDAndType(lastListID, ListTypeNo.CUSTOM) &&
              this.Client.UserQuota.canUseCustomListOnlyCheck()))
        ) {
          matched = true;
          this.PromptTemplatesType = PromptTemplatesType.CUSTOM_LIST;
          this.PromptTemplatesList = lastListID;
        }
        break;
    }

    if (!matched) {
      this.PromptTemplatesType = PromptTemplatesType.PUBLIC;
      this.PromptTemplatesList = null;

      localStorage.setItem(lastPromptTemplateTypeKey, this.PromptTemplatesType);
      localStorage.setItem(lastListIDKey, this.PromptTemplatesList);
    }
  },

  async fetchPromptTemplates() {
    /** @type {Prompt[]} */
    const templates = await this.Client.getPrompts(
      this.PromptTopic === DefaultPromptTopic ? "" : this.PromptTopic,
      this.PromptSortMode
    );

    // split templates into public and own
    [this.PromptTemplates, this.OwnPrompts] = templates.reduce(
      (publicPrivatePrompts, template) => {
        // Public template
        if (template.PromptTypeNo === PromptTypeNo.PUBLIC) {
          publicPrivatePrompts[0].push(template);
        }

        // Private or public template owned by current user
        if (template.OwnPrompt) {
          publicPrivatePrompts[1].push(template);
        }

        return publicPrivatePrompts;
      },
      [[], []]
    );

    await this.insertPromptTemplatesSection();
  },

  createObserver() {
    // Create a new observer for the chat sidebar to watch for changes to the document body
    const observer = new MutationObserver((mutations) => {
      // For each mutation (change) to the document body
      mutations.forEach(async (mutation) => {
        // If the mutation is not a change to the list of child nodes, skip it
        if (mutation.type !== "childList")
          if (mutation.addedNodes.length == 0)
            // If no new nodes were added, skip this mutation
            return;
        // Get the first added node
        const node = mutation.addedNodes[0];
        // If the node is not an element or does not have a `querySelector` method, skip it
        if (!node || !node.querySelector) return;
        // Call the `handleElementAdded` function with the added node
        await this.handleElementAdded(node);
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { subtree: true, childList: true });
  },

  replaceFetch() {
    window.fetch = async (...t) => {
      // If the request is not for the chat backend API, just use the original fetch function
      if (t[0] !== EndpointConversation) return this.fetch(...t);

      // If no prompt template, tone, writing style or target language has been selected, use the original fetch function
      if (
        !this.SelectedPromptTemplate &&
        !this.Tone &&
        !this.WritingStyle &&
        !this.TargetLanguage
      ) {
        return this.fetch(...t);
      }

      // Get the selected prompt template
      const template = this.SelectedPromptTemplate;

      if (template) {
        this.Client.usePrompt(template.ID, UsageTypeNo.SEND);
      }

      // Allow the user to use continue actions after sending a prompt
      this.showContinueActionsButton();

      try {
        // Get the options object for the request, which includes the request body
        const options = t[1];
        // Parse the request body from JSON
        const body = JSON.parse(options.body);

        if (template) {
          // Get the prompt from the request body
          const prompt = body.messages[0].content.parts[0];

          // Use the default target language if no target language has been selected
          const targetLanguage = (
            this.TargetLanguage ? this.TargetLanguage : DefaultTargetLanguage
          ).replace("*", "");

          // Replace the prompt in the request body with the selected prompt template,
          // inserting the original prompt into the template and replacing the target language placeholder
          let promptTextUpdated = template.Prompt.replaceAll(
            PromptPlaceholder,
            prompt
          ).replaceAll(TargetLanguagePlaceholder, targetLanguage);

          // Replace variables with values
          if (template.PromptVariables) {
            template.PromptVariables.forEach((promptVariable) => {
              const v = document.querySelector(
                "#" + variableIDPrefix + promptVariable.ID
              );
              if (v) {
                promptTextUpdated = promptTextUpdated.replaceAll(
                  VariablePlaceholder.replace("{idx}", promptVariable.ID),
                  v.value
                );
              }
            });
          }

          // Remove variable definitions from prompt text
          promptTextUpdated = promptTextUpdated.replaceAll(
            VariableDefinition,
            ""
          );

          body.messages[0].content.parts[0] = promptTextUpdated;

          // Replace Live Crawling placeholders with the Live Crawling result
          body.messages[0].content.parts[0] =
            await this.injectLiveCrawlingResult(
              prompt,
              body.messages[0].content.parts[0]
            );
        }

        /** @type {string[]} */
        const toneWritingStyleLanguagePrompt = [];

        // If the user has selected a tone, add it to the request body
        const tone = this.Tone
          ? this.Tones.find((tone) => tone.ID === this.Tone)
          : null;

        if (tone) {
          toneWritingStyleLanguagePrompt.push(
            `${tone.Label.toLowerCase()} tone`
          );

          // Track the tone usage
          this.Client.usePrompt(`${tone.ID}`, UsageTypeNo.SEND);
        }

        // If the user has selected a writing style, add it to the request body
        const writingStyle = this.WritingStyle
          ? this.WritingStyles.find(
              (writingStyle) => writingStyle.ID === this.WritingStyle
            )
          : null;

        if (writingStyle) {
          toneWritingStyleLanguagePrompt.push(
            `${writingStyle.Label.toLowerCase()} writing style`
          );

          // Track the writing style usage
          this.Client.usePrompt(`${writingStyle.ID}`, UsageTypeNo.SEND);
        }

        // If the user has selected a target language, add it to the request body
        if (!template && this.TargetLanguage) {
          toneWritingStyleLanguagePrompt.push(
            `${this.TargetLanguage.replace("*", "")} language`
          );
        }

        // If the user has selected a tone, writing style or target language, add a prompt to the request body
        if (toneWritingStyleLanguagePrompt.length > 0) {
          body.messages[0].content.parts[0] += `\n\nPlease write in ${toneWritingStyleLanguagePrompt.join(
            ", "
          )}.`;
        }

        // Clear the selected prompt template
        await this.selectPromptTemplateByIndex(null);

        // Stringify the modified request body and update the options object
        options.body = JSON.stringify(body);
        // Use the modified fetch function to make the request
        return this.fetch(t[0], options);
      } catch (err) {
        console.error("Error modifying request body", err);

        // If there was an error parsing the request body or modifying the request,
        // just use the original fetch function
        return this.fetch(...t);
      }
    };
  },

  // Add AIPRM watermark to conversation responses
  addWatermark() {
    // no config available or watermark is not enabled
    if (!this.Config || !this.Config.isWatermarkEnabled()) {
      return;
    }

    const watermarkConfig = this.Config.getWatermarkConfig();

    // add watermark class to all configured selectors, if it's not set, yet
    Object.keys(watermarkConfig.Selectors).forEach((watermarkClass) => {
      document
        .querySelectorAll(
          `${
            watermarkConfig.Selectors[watermarkClass]
          }:not(.${watermarkClass.replace(/:/g, "\\:")})`
        )
        .forEach((element) => {
          element.classList.add(watermarkClass);
        });
    });
  },

  // This function is called for each new element added to the document body
  async handleElementAdded(e) {
    // If watermark is enabled, add corresponding classes
    this.addWatermark();

    // If the element added is the root element for the chat sidebar, set up the sidebar
    if (
      e.id === "headlessui-portal-root" ||
      e.id === "language-select-wrapper"
    ) {
      this.setupSidebar();
      return;
    }

    // Disable "Export Button" when no chat were started.
    // Insert "Prompt Templates" section to the main page.
    // Insert language select and continue button above the prompt textarea input
    if (e.querySelector("h1.text-4xl")) {
      await this.insertPromptTemplatesSection();

      const button = document.getElementById("export-button");
      if (button) button.style = "pointer-events: none;opacity: 0.5";

      this.insertLanguageToneWritingStyleContinueActions();
    }

    // Enable "Export Button" when a new chat started.
    // Insert language select and continue button above the prompt textarea input
    if (document.querySelector(".xl\\:max-w-3xl")) {
      const button = document.getElementById("export-button");
      if (button) button.style = "";

      this.insertLanguageToneWritingStyleContinueActions();
    }

    // Add "Save prompt as template" button, if new prompt was added
    if (document.querySelector(".whitespace-pre-wrap")) {
      this.insertSavePromptAsTemplateButton();
    }
  },

  // Add "Save prompt as template" button to the user prompt container next to the "Edit" button
  insertSavePromptAsTemplateButton() {
    // get the first element with selector '.flex.flex-col.items-center .whitespace-pre-wrap' and no children elements
    const firstPrompt = document.querySelector(
      ".flex.flex-col.items-center .whitespace-pre-wrap:not(:has(*))"
    );

    if (!firstPrompt) {
      return;
    }

    // get parent element of the first prompt to find the "Edit" button
    const button =
      firstPrompt.parentElement.parentElement.querySelector("button");

    if (!button) {
      return;
    }

    // Allow user to continue writing from chat history
    this.showContinueActionsButton();

    let saveButton = button.parentElement.querySelector(".save-prompt-button");

    // if button already exists, skip
    if (saveButton) {
      return;
    }

    saveButton = document.createElement("button");
    saveButton.className =
      "save-prompt-button AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400 md:AIPRM__invisible md:group-hover:AIPRM__visible md:group-hover:visible";
    saveButton.title = "Save prompt as template";
    saveButton.addEventListener("click", this.showSavePromptModal.bind(this));
    saveButton.innerHTML = svg("Save");

    // add HTML before children in button.parentElement
    button.parentElement.prepend(saveButton);
  },

  // get all available activities for the selected topic
  getActivities(TopicID = DefaultPromptTopic) {
    const currentActivities = this.Activities.filter(
      (activity) =>
        !TopicID ||
        TopicID === DefaultPromptTopic ||
        activity.TopicID === TopicID
    );

    // keep only unique activity.Label and extract activity.ID and activity.Label
    return [
      ...new Set(currentActivities.map((activity) => activity.Label)),
    ].map((label) => ({
      ID: this.Activities.find((activity) => activity.Label === label).ID,
      Label: label,
    }));
  },

  /**
   * Validate prompt template before saving
   *
   * @param {Prompt} prompt
   * @returns {boolean} true if prompt is valid
   */
  validatePrompt(prompt) {
    const errors = [];

    // find existing prompt based on ID in PromptTemplates or OwnPrompts
    const existingPrompt = [...this.PromptTemplates, ...this.OwnPrompts].find(
      (p) => p.ID === prompt.ID
    );

    // prompt type was changed between public and private
    const promptTypeChanged =
      existingPrompt && existingPrompt.PromptTypeNo !== prompt.PromptTypeNo;

    // current user cannot create any prompt template, but can edit existing prompt
    if (!this.canCreatePromptTemplate() && !existingPrompt) {
      this.Client.UserQuota.promptQuotaExceeded();

      return;
    }

    // current user cannot create public prompt template, but can edit existing public prompt template
    if (
      prompt.PromptTypeNo === PromptTypeNo.PUBLIC &&
      !this.canCreatePublicPromptTemplate() &&
      (!existingPrompt || promptTypeChanged)
    ) {
      this.Client.UserQuota.publicPromptsQuotaExceeded();

      return;
    }

    // current user cannot create private prompt template, but can edit existing private prompt template
    if (
      prompt.PromptTypeNo === PromptTypeNo.PRIVATE &&
      !this.canCreatePrivatePromptTemplate() &&
      (!existingPrompt || promptTypeChanged)
    ) {
      this.Client.UserQuota.privatePromptsQuotaExceeded();

      return;
    }

    // reset prompt variables to extract them based on updated prompt
    prompt.PromptVariables = undefined;

    // check if prompt variables use less than max allowed enum values
    this.extractVariableDefinitions(prompt);

    // max allowed enum values for prompt variables
    const promptVarEnumMaxSize =
      this.Client.UserQuota.promptVariableEnumMaxSize();

    // check if prompt variables use less than max allowed enum values
    if (prompt.PromptVariables) {
      for (var i = 0; i < prompt.PromptVariables.length; i++) {
        if (prompt.PromptVariables[i].EnumS.length > promptVarEnumMaxSize) {
          this.Client.UserQuota.upgradePromptVariableEnumMaxSize();
          prompt.PromptVariables = undefined;
          return;
        }
      }
    }

    // reset prompt variables to undefined to avoid sending them
    prompt.PromptVariables = undefined;

    // require AuthorName and AuthorURL if prompt is public
    if (
      prompt.PromptTypeNo === PromptTypeNo.PUBLIC &&
      (!prompt.AuthorName.trim() || !prompt.AuthorURL.trim())
    ) {
      errors.push(
        "Please identify with Author Name and URL to publish a prompt template as public."
      );
    }

    const missingPlaceholders = [];

    // require usage of target language placeholder if prompt is public
    if (
      prompt.PromptTypeNo === PromptTypeNo.PUBLIC &&
      !prompt.Prompt.includes(TargetLanguagePlaceholder)
    ) {
      missingPlaceholders.push(TargetLanguagePlaceholder);
    }

    // require usage of prompt placeholder in prompt template
    if (!prompt.Prompt.includes(PromptPlaceholder)) {
      missingPlaceholders.push(PromptPlaceholder);
    }

    // there is at least one missing placeholder
    if (missingPlaceholders.length > 0) {
      errors.push(
        `
          Make sure you follow the Prompt Template guidelines. <br>
          You must use ${missingPlaceholders.join(" and ")} correctly. <br><br>
          Learn more <a class="AIPRM__underline" href="https://lrt.li/aiprmpromptguide" target="_blank" rel="noopener noreferrer">here</a>.
        `
      );
    }

    // show error notification if there are any errors
    if (errors.length > 0) {
      const errorMessage = /*html*/ `
        <div>
          <strong>Please fix the following errors:</strong> <br><br>
          ${errors.join("<br><br>")}
        </div>
      `;

      this.showNotification(NotificationSeverity.ERROR, errorMessage, false);
    }

    return errors.length === 0;
  },

  // save prompt template via API and update client state
  async savePromptAsTemplate(e) {
    e.preventDefault();

    /** @type Prompt */
    const prompt = {};
    const formData = new FormData(e.target);

    for (const [key, value] of formData) {
      prompt[key] = value;
    }

    prompt.PromptTypeNo = prompt.Public
      ? PromptTypeNo.PUBLIC
      : PromptTypeNo.PRIVATE;

    // re-check user status
    await this.Client.checkUserStatus();

    if (!this.validatePrompt(prompt)) {
      return;
    }

    try {
      const savedPrompt = await this.Client.savePrompt(prompt);

      // Update revision time to current time
      prompt.RevisionTime = new Date().toISOString();

      // Update existing prompt template
      if (prompt.ID) {
        this.updatePromptsState(prompt);
      }
      // Add new prompt template to client state if it belongs to the current topic
      else if (
        this.PromptTopic === DefaultPromptTopic ||
        prompt.Community === this.PromptTopic
      ) {
        // New prompt template was created, set the ID
        prompt.ID = savedPrompt.ID;

        this.OwnPrompts.push(prompt);

        // Add prompt to public prompt templates if it is public
        if (prompt.Public) {
          this.PromptTemplates.push(prompt);
        }
      }
    } catch (error) {
      // user has reached the limit of public/private prompt templates
      if (
        error instanceof Reaction &&
        error.ReactionNo === ReactionNo.RXN_AIPRM_OVER_LIMIT_PROMPTS
      ) {
        this.Client.UserQuota.promptQuotaExceeded();

        return;
      }

      this.showNotification(
        NotificationSeverity.ERROR,
        error instanceof Reaction
          ? error.message
          : "Something went wrong. Please try again."
      );
      return;
    }

    this.hideSavePromptModal();

    this.showNotification(
      NotificationSeverity.SUCCESS,
      'Prompt template was saved successfully to "Own Prompts".'
    );

    await this.insertPromptTemplatesSection();

    // re-select prompt template if it was selected before to update the UI if prompt variable definitions were changed
    if (
      this.SelectedPromptTemplate != null &&
      prompt.ID == this.SelectedPromptTemplate.ID
    ) {
      this.selectPromptTemplate(prompt);
    }
  },

  /**
   * Update prompt templates in client state
   *
   * @param {Prompt} prompt
   */
  updatePromptsState(prompt) {
    // if topic doesn't match, remove prompt from PromptTemplates and OwnPrompts
    if (
      prompt.Community !== this.PromptTopic &&
      this.PromptTopic !== DefaultPromptTopic
    ) {
      this.PromptTemplates = this.PromptTemplates.filter(
        (template) => template.ID !== prompt.ID
      );

      this.OwnPrompts = this.OwnPrompts.filter(
        (ownPrompt) => ownPrompt.ID !== prompt.ID
      );

      return;
    }

    // find prompt in OwnPrompts by ID and update it
    this.OwnPrompts = this.OwnPrompts.map((ownPrompt) =>
      ownPrompt.ID === prompt.ID ? prompt : ownPrompt
    );

    // find the prompt in PromptTemplates by ID
    const promptTemplate = this.PromptTemplates.find(
      (template) => template.ID === prompt.ID
    );

    const isPublicPrompt = prompt.PromptTypeNo === PromptTypeNo.PUBLIC;

    // if prompt is not public and it is in PromptTemplates, remove it
    if (!isPublicPrompt && promptTemplate) {
      this.PromptTemplates = this.PromptTemplates.filter(
        (template) => template.ID !== prompt.ID
      );

      return;
    }

    // if prompt is public and it is not in PromptTemplates, add it
    if (isPublicPrompt && !promptTemplate) {
      this.PromptTemplates.push(prompt);

      return;
    }

    // if prompt is public and it is in PromptTemplates, update it
    if (isPublicPrompt && promptTemplate) {
      this.PromptTemplates = this.PromptTemplates.map((template) =>
        template.ID === prompt.ID ? prompt : template
      );
    }
  },

  /**
   * Simple notification based on ChatGPT "high demand" notification
   *
   * @param {NotificationSeverity} severity
   * @param {string} message
   * @param {boolean} autoHide
   */
  showNotification(
    severity = NotificationSeverity.SUCCESS,
    message = "",
    autoHide = true
  ) {
    const notificationElementID = "AIPRM-Notification";

    let notificationElement = document.getElementById(notificationElementID);

    // if notification doesn't exist, create it
    if (!notificationElement) {
      notificationElement = document.createElement("div");
      notificationElement.id = notificationElementID;
    }

    const severityClassName = {
      [NotificationSeverity.INFO]: "AIPRM__bg-gray-500",
      [NotificationSeverity.SUCCESS]: "AIPRM__bg-green-500",
      [NotificationSeverity.WARNING]: "AIPRM__bg-orange-500",
      [NotificationSeverity.ERROR]: "AIPRM__bg-red-500",
    };

    notificationElement.innerHTML = /*html*/ `
      <div class="AIPRM__fixed AIPRM__flex AIPRM__justify-center AIPRM__w-full AIPRM__top-2 AIPRM__px-2 AIPRM__z-50 AIPRM__pointer-events-none">
        <div class="${
          severityClassName[severity]
        } AIPRM__flex AIPRM__flex-row AIPRM__inline-flex AIPRM__pointer-events-auto AIPRM__px-6 AIPRM__py-3 AIPRM__rounded-md AIPRM__text-white" role="alert">
          <div class="AIPRM__flex AIPRM__gap-4">
            <p class="AIPRM__max-w-md" style="overflow-wrap: anywhere;">${message}</p>
            <button>${svg("Cross")}</button>
          </div>
        </div>
      </div>
    `;

    // remove notificationElement from DOM on click
    notificationElement
      .querySelector("button")
      .addEventListener("click", () => {
        notificationElement.remove();
      });

    // or remove notificationElement from DOM after 5 seconds
    if (autoHide) {
      setTimeout(() => {
        notificationElement.remove();
      }, 5000);
    }

    document.body.appendChild(notificationElement);
  },

  hideModal,

  hideSavePromptModal() {
    this.hideModal("savePromptModal");
  },

  // show modal to report prompt
  showReportPromptModal(PromptIndex) {
    createReportPromptModal(
      PromptIndex,
      this.PromptTemplates,
      this.reportPrompt.bind(this)
    );
  },

  /**
   * Show modal to save prompt as template
   *
   * @param {Event|null} e
   */
  async showSavePromptModal(e) {
    let promptTemplate = "";

    const isEditPromptEvent = e && e.type === editPromptTemplateEvent;

    // re-check user status in case it's not editing of existing prompt template
    if (!isEditPromptEvent) {
      await this.Client.checkUserStatus();
    }

    // cannot add new prompt template, but still can edit existing one
    if (!this.canCreatePromptTemplate() && !isEditPromptEvent) {
      this.Client.UserQuota.promptQuotaExceeded();

      return;
    }

    // get the prompt template from current chat log if showSavePromptModal was called from "Save prompt as template" button (with event)
    if (e && e.type !== editPromptTemplateEvent) {
      // get the element that triggered this onclick event
      const button = e.target.closest("button");

      // get the parent element of the button (the prompt container)
      const prompt =
        button.parentElement.parentElement.parentElement.querySelector(
          ".whitespace-pre-wrap"
        );

      if (prompt) {
        promptTemplate = prompt.textContent;
      }
    }

    let savePromptModal = document.getElementById("savePromptModal");

    // if modal does not exist, create it, add event listener on submit and append it to body
    if (!savePromptModal) {
      savePromptModal = document.createElement("div");
      savePromptModal.id = "savePromptModal";

      savePromptModal.addEventListener(
        "submit",
        this.savePromptAsTemplate.bind(this)
      );

      document.body.appendChild(savePromptModal);
    }

    savePromptModal.innerHTML = /*html*/ `
      <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__text-center AIPRM__transition-opacity AIPRM__z-50">
        <div class="AIPRM__absolute AIPRM__bg-gray-900 AIPRM__inset-0 AIPRM__opacity-90">
        </div>

        <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__overflow-y-auto">
          <div class="AIPRM__flex AIPRM__items-center AIPRM__justify-center AIPRM__min-h-full">
            <form id="savePromptForm">
              <input type="hidden" name="ID"  />
              <input type="hidden" name="OwnPrompt" value="true" />
              <input type="hidden" name="Views" value="0" />
              <input type="hidden" name="Usages" value="0" />
              <input type="hidden" name="Votes" value="0" />
              <input type="hidden" name="ForkedFromPromptID" />
              
              <div
              class="AIPRM__align-center AIPRM__bg-white dark:AIPRM__bg-gray-800 dark:AIPRM__text-gray-200 AIPRM__inline-block AIPRM__overflow-hidden sm:AIPRM__rounded-lg AIPRM__shadow-xl sm:AIPRM__align-middle sm:AIPRM__max-w-lg sm:AIPRM__my-8 sm:AIPRM__w-full AIPRM__text-left AIPRM__transform AIPRM__transition-all"
              role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          
                <div class="AIPRM__bg-white dark:AIPRM__bg-gray-800 AIPRM__px-4 AIPRM__pt-5 AIPRM__pb-4 sm:AIPRM__p-6 sm:AIPRM__pb-4 AIPRM__overflow-y-auto">
                  <label>Prompt Template</label>
                  <textarea name="Prompt" class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" style="height: 120px;" required
                            placeholder="Prompt text including placeholders [TARGETLANGUAGE], [PROMPT], [VARIABLE1], [VARIABLE2] and [VARIABLE3] replaced automagically by AIPRM.&#10;&#10;[VARIABLE1], [VARIABLE2] and [VARIABLE3] require title with optional default value and available values.&#10;&#10;Example: Example [PROMPT] in [TARGETLANGUAGE] with [VARIABLE1], [VARIABLE2] and [VARIABLE3].&#10;[VARIABLE1:Title] [VARIABLE2:Title:Default Value] [VARIABLE3:Title:Default Value:Available Value 1|Available Value 2|Available Value 3].&#10;&#10;[VARIABLE1], [VARIABLE2] and [VARIABLE3] will be pre-filled using URL parameters AIPRM_VARIABLE1, AIPRM_VARIABLE2 and AIPRM_VARIABLE3."
                            title="Prompt text including placeholders [TARGETLANGUAGE], [PROMPT], [VARIABLE1], [VARIABLE2] and [VARIABLE3] replaced automagically by AIPRM. [VARIABLE1], [VARIABLE2] and [VARIABLE3] require title with optional default value and available values. Example: Example [PROMPT] in [TARGETLANGUAGE] with [VARIABLE1], [VARIABLE2] and [VARIABLE3]. [VARIABLE1:Title] [VARIABLE2:Title:Default Value] [VARIABLE3:Title:Default Value:Available Value 1|Available Value 2|Available Value 3]. [VARIABLE1], [VARIABLE2] and [VARIABLE3] will be pre-filled using URL parameters AIPRM_VARIABLE1, AIPRM_VARIABLE2 and AIPRM_VARIABLE3.">${sanitizeInput(
                              promptTemplate
                            )}</textarea>
            
                  <label>Teaser</label>
                  <textarea name="Teaser" required
                    title="Short teaser for this prompt template, e.g. 'Create a keyword strategy and SEO content plan from 1 [KEYWORD]'"
                    class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" style="height: 71px;"
                    placeholder="Create a keyword strategy and SEO content plan from 1 [KEYWORD]"></textarea>
                    
                  <label>Prompt Hint</label>
                  <input name="PromptHint" required type="text"
                    title="Prompt hint for this prompt template, e.g. '[KEYWORD]' or '[your list of keywords, maximum ca. 8000]"
                    class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" placeholder="[KEYWORD] or [your list of keywords, maximum ca. 8000]" />

                  <label>Title</label>
                  <input name="Title" type="text"
                    title="Short title for this prompt template, e.g. 'Keyword Strategy'" required placeholder="Keyword Strategy" class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2" />
            
                  <div class="AIPRM__flex">
                    <div class="AIPRM__mr-4 AIPRM__w-full">
                      <label>Topic</label>
                      <select name="Community" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full" required>
                        ${this.Topics.map(
                          (topic) => /*html*/ `
                              <option value="${sanitizeInput(topic.ID)}" ${
                            topic.ID === this.PromptTopic ? "selected" : ""
                          }>${sanitizeInput(topic.Label)}</option>`
                        ).join("")}
                      </select>
                    </div>

                    <div class="AIPRM__w-full">
                      <label>Activity</label>
                      <select name="Category" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full" required>
                        ${this.getActivities(
                          this.PromptTopic === DefaultPromptTopic
                            ? this.Topics[0].ID
                            : this.PromptTopic
                        )
                          .map(
                            (activity) => /*html*/ `
                              <option value="${sanitizeInput(
                                activity.ID
                              )}">${sanitizeInput(activity.Label)}</option>`
                          )
                          .join("")}
                      </select>
                    </div>
                  </div>

                  <div class="AIPRM__block AIPRM__mt-4">
                    <label class="AIPRM__text-sm" id="savePromptForm-public-checkbox">
                      <input name="Public" value="true" type="checkbox" class="AIPRM__mr-2 dark:AIPRM__bg-gray-700">
                      Share prompt template publicly
                    </label>
                    
                    <div class="AIPRM__flex AIPRM__justify-between AIPRM__mt-4">
                      <div class="AIPRM__mr-4 AIPRM__w-full"><label>Author Name</label>
                        <input name="AuthorName" type="text" title="Author Name visible for all users"
                              placeholder="Author Name" class="AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2 AIPRM__w-full" />
                      </div>

                      <div class="AIPRM__w-full"><label>Author URL</label>
                        <input name="AuthorURL" type="url" title="Author URL visible for all users"
                              placeholder="https://www.example.com/" class="AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2 AIPRM__w-full" />
                      </div>
                    </div>
                    
                    <a class="AIPRM__mt-4 AIPRM__text-sm AIPRM__underline AIPRM__hidden"
                        id="savePromptForm-forked-from" href="https:/app.aiprm.com/prompt/"
                        rel="noopener noreferrer" target="_blank">
                      Forked From
                    </a>
                  </div>
            
                  <p class="AIPRM__mt-6 AIPRM__text-[10px]" id="savePromptForm-public-disclaimer">Please be mindful of what you share, and do not include any confidential information, as we are not responsible for
                    any actions taken by others with the information you choose to share.</p>
                </div>
            
                <div class="AIPRM__bg-gray-200 dark:AIPRM__bg-gray-700 AIPRM__px-4 AIPRM__py-3 AIPRM__text-right">
                  <button type="button" class="AIPRM__bg-gray-600 hover:AIPRM__bg-gray-800 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white"
                          onclick="AIPRM.hideSavePromptModal()"> Cancel
                  </button>
                  <button id="AIPRM__cloneButton" type="button" class="AIPRM__hidden AIPRM__bg-blue-600 hover:AIPRM__bg-blue-700 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white">Clone
                  </button>
                  <button type="submit" class="AIPRM__bg-green-600 hover:AIPRM__bg-green-700 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white">Save Prompt
                  </button>
                </div>
            
              </div>
            </form>
          </div>
        </div>
        
      </div>
    `;

    // add onchange event listener to select[name="Community"] to update the activities
    savePromptModal.querySelector('select[name="Community"]').onchange = (
      event
    ) => {
      // replace select[name="Category"] with new activities
      savePromptModal.querySelector('select[name="Category"]').innerHTML =
        this.getActivities(event.target.value)
          .map(
            (activity) => /*html*/ `
            <option value="${sanitizeInput(activity.ID)}">${sanitizeInput(
              activity.Label
            )}</option>`
          )
          .join("");
    };

    savePromptModal.style = "display: block;";

    // add event listener to close the modal on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideSavePromptModal();
      }
    });
  },

  // This function adds an "Export Button" to the sidebar
  addExportButton() {
    // Get the nav element in the sidebar
    const nav = document.querySelector("nav");
    // If there is no nav element or the "Export Button" already exists, skip
    if (!nav || nav.querySelector("#export-button")) return;

    // Create the "Export Button" element
    const button = document.createElement("a");
    button.id = "export-button";
    button.className = css`ExportButton`;
    button.innerHTML = /*html*/ `${svg`Export`} Export Chat`;
    button.onclick = this.exportCurrentChat.bind(this);

    // If there is no chat started, disable the button
    if (document.querySelector(".flex-1.overflow-hidden h1")) {
      button.style = "pointer-events: none;opacity: 0.5";
    }

    // Get the Log out button as a reference
    const colorModeButton = [...nav.children].find((child) =>
      child.innerText.includes("Log out")
    );
    // Insert the "Export Button" before the "Color Mode" button
    nav.insertBefore(button, colorModeButton);

    // Create the "Version" element
    const version = document.createElement("a");
    version.id = "AppName";
    version.className = css`VersionInfo`;
    version.innerHTML = /*html*/ `${svg`Rocket`}` + AppName + " powered";
    //version.onclick = exportCurrentChat
    version.href = AppURL;
    version.target = "_blank";

    // Get the Log out button as a reference
    const colorModeButton2 = [...nav.children].find((child) =>
      child.innerText.includes("Log out")
    );
    // Insert the "Export Button" before the "Color Mode" button

    nav.insertBefore(version, colorModeButton2);

    // Create the "AIPRM Community Forum" element
    const forum = document.createElement("a");
    forum.className = css("VersionInfo");
    forum.innerHTML = `${svg("Community")} AIPRM Community Forum`;
    forum.href = AppCommunityForumURL;
    forum.target = "_blank";

    nav.insertBefore(forum, colorModeButton);
  },

  // This function gets the "New Chat" buttons
  getNewChatButtons() {
    // Get the sidebar and topbar elements
    const sidebar = document.querySelector("nav");
    const topbar = document.querySelector(".sticky");
    // Get the "New Chat" button in the sidebar
    const newChatButton = [
      ...(sidebar?.querySelectorAll(".cursor-pointer") ?? []),
    ].find((e) => e.innerText === "New chat");
    // Get the "Plus" button in the topbar
    const AddButton = topbar?.querySelector("button.px-3");
    // Return an array containing the buttons, filtering out any null elements
    return [newChatButton, AddButton].filter((button) => button);
  },

  /**
   * Return current prompt templates based on selected prompt templates type and prompt list
   *
   * @returns {Promise<Prompt[]>}
   */
  async getCurrentPromptTemplates() {
    if (this.PromptTemplatesType !== PromptTemplatesType.CUSTOM_LIST) {
      return this.PromptTemplatesType === PromptTemplatesType.OWN
        ? this.OwnPrompts
        : this.PromptTemplates.filter(
            // filter out forked public prompts from "Public" tab
            (template) => !template.ForkedFromPromptID
          );
    }

    // find all prompts which are in current list
    const list = this.Lists.withID(this.PromptTemplatesList);

    if (!list) {
      console.error(
        "getCurrentPromptTemplates: No list found for ID",
        this.PromptTemplatesList
      );
      return [];
    }

    const listPromptIDS = await list.getPromptIDS();

    if (!listPromptIDS) {
      return [];
    }

    // if list has items, return prompts which are in list
    const templates = [...this.PromptTemplates, ...this.OwnPrompts].filter(
      (prompt) => listPromptIDS.includes(prompt.ID)
    );

    // make sure templates are unique based on ID
    return [...new Map(templates.map((item) => [item.ID, item])).values()];
  },

  /**
   * Filter templates based on selected activity and search query
   *
   * @param {Prompt[]} templates
   * @returns {Promise<Prompt[]>} filtered templates
   */
  async filterPromptTemplates(templates) {
    const hiddenList = this.Lists.getHidden();

    return templates.filter((template) => {
      // If the template is hidden and the user is not in the hidden list, skip it
      if (
        template.IsHidden &&
        (this.PromptTemplatesType !== PromptTemplatesType.CUSTOM_LIST ||
          this.PromptTemplatesList !== hiddenList?.ID)
      ) {
        return false;
      }

      return (
        (this.PromptActivity === DefaultPromptActivity ||
          template.Category === this.PromptActivity) &&
        (!this.PromptSearch ||
          template.Teaser.toLowerCase().includes(
            this.PromptSearch.toLowerCase()
          ) ||
          template.Title.toLowerCase().includes(
            this.PromptSearch.toLowerCase()
          ))
      );
    });
  },

  // This function inserts a section containing a list of prompt templates into the chat interface
  async insertPromptTemplatesSection() {
    // If there are no topics or activities do not insert the section, yet
    if (!this.Topics.length || !this.Activities.length) {
      console.error(
        "insertPromptTemplatesSection: No topics or activities found, skipping prompt templates"
      );
      return;
    }

    // Get the title element (as a reference point and also for some alteration)
    const title = document.querySelector("h1.text-4xl");

    // If there is no title element, return
    if (!title) {
      console.error(
        "insertPromptTemplatesSection: No title element found, skipping prompt templates"
      );
      return;
    }

    // Hide the title element and examples
    title.style = "display: none";

    // Hide the examples if they are present, but do not hide own templates wrapper
    if (title.nextSibling && title.nextSibling.id !== "templates-wrapper") {
      title.nextSibling.style = "display: none;";
    }

    // Get the list of prompt templates
    let templates = this.PromptTemplates;

    // If there are no templates, skip
    if (!templates) {
      console.error(
        "insertPromptTemplatesSection: No prompt templates found, skipping prompt templates"
      );
      return;
    }

    templates = await this.getCurrentPromptTemplates();

    // Use index as ID for each template actions
    templates = await Promise.all(
      templates.map(async (template, index) => ({
        ...template,
        ID: index,
        IsHidden: await this.isHidden(index),
      }))
    );

    // Filter templates based on selected activity and search query
    templates = await this.filterPromptTemplates(templates);

    // Get the parent element of the title element (main page)
    const parent = title.parentElement;

    // If there is no parent element, skip
    if (!parent) {
      console.error(
        "insertPromptTemplatesSection: No parent element found, skipping prompt templates"
      );
      return;
    }

    // Remove 'md:h-full', 'md:max-w-2xl', 'lg:max-w-3xl' classes from the parent element (to make it full width)
    parent.classList.remove("md:h-full", "md:max-w-2xl", "lg:max-w-3xl");

    // Add 'AIPRM__w-full' class to the parent element (to make it full width)
    parent.classList.add("AIPRM__w-full");

    // Get the current page number and page size from the promptTemplateSection object
    const { currentPage, pageSize } = this.PromptTemplateSection;

    // Calculate the start and end indices of the current page of prompt templates
    const start = pageSize * currentPage;
    const end = Math.min(pageSize * (currentPage + 1), templates.length);

    // Get the current page of prompt templates and add "IsFavorite" flag to each of the current templates
    const currentTemplates = await Promise.all(
      templates.slice(start, end).map(async (template) => ({
        ...template,
        IsFavorite: await this.isFavorite(template.ID),
        IsVerified: await this.isVerified(template.ID),
      }))
    );

    const favoritesList = this.Lists.getFavorites();
    const isFavoritesListView = this.PromptTemplatesList === favoritesList?.ID;

    const hiddenList = this.Lists.getHidden();

    const customLists = this.Lists.getCustom();
    const customListIDS = customLists.map((list) => list.ID);

    const AIPRMVerifiedList = this.Lists.getAIPRMVerified();

    const isCustomListView =
      this.PromptTemplatesType === PromptTemplatesType.CUSTOM_LIST &&
      (customListIDS.includes(this.PromptTemplatesList) ||
        (AIPRMVerifiedList?.ID === this.PromptTemplatesList &&
          AIPRMVerifiedList.OwnList));

    // Pagination buttons (conditionally rendered, depending on the number of prompt templates)
    const paginationContainer = /*html*/ `
    <div class="AIPRM__flex AIPRM__flex-1 AIPRM__gap-3.5 AIPRM__justify-between AIPRM__items-center AIPRM__flex-col sm:AIPRM__flex-row AIPRM__mt-6">
      <div class="AIPRM__text-left" style="margin-top: -1rem;">
        <label class="AIPRM__block AIPRM__text-sm AIPRM__font-medium" title="The number of prompt templates per page">Prompts per Page</label>
        <select class="AIPRM__bg-gray-100 AIPRM__border-0 AIPRM__text-sm AIPRM__rounded AIPRM__block AIPRM__w-full dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-600 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200 focus:AIPRM__ring-0 dark:hover:AIPRM__bg-gray-900 pageSizeSelect">
          ${pageSizeOptions
            .map(
              (pageSize) => /*html*/ `
                <option value="${pageSize}" ${
                pageSize === this.PromptTemplateSection.pageSize
                  ? "selected"
                  : ""
              }>${pageSize}</option>`
            )
            .join("")}
        </select>
      </div>
      
      <span class="${css`paginationText`}">
        Showing <span class="${css`paginationNumber`}">${
      start + 1
    }</span> to <span class="${css`paginationNumber`}">${end}</span> of <span class="${css`paginationNumber`}">${
      templates.length
    } Prompts</span>
      </span>
      <div class="${css`paginationButtonGroup`}">
        <button onclick="AIPRM.prevPromptTemplatesPage()" class="${css`paginationButton`}" style="border-radius: 6px 0 0 6px">Prev</button>
        <button onclick="AIPRM.nextPromptTemplatesPage()" class="${css`paginationButton`} AIPRM__border-0 AIPRM__border-l AIPRM__border-gray-500" style="border-radius: 0 6px 6px 0">Next</button>
      </div>
    </div>
  `;

    // Create the HTML for the prompt templates section
    const html = /*html*/ `
    <div class="${css`column`} AIPRM__relative" style="min-width: 0">


      <div class="lg:AIPRM__absolute AIPRM__top-0 AIPRM__right-0 AIPRM__text-right">
        <div class="AIPRM__mb-2">
          ${
            this.Client.AppUser
              ? /*html*/ `
                <div class="AIPRM__mb-2">
                  <div>
                    Hello, <a target="_blank" href="${AppAccountURL}">
                      ${sanitizeInput(this.Client.AppUser.Name)}
                    </a>
                  </div>
                  
                  <div>
                    <a target="_blank" href="${AppAccountURL}">Your Account</a>
                  </div>
                </div>`
              : /*html*/ `<a href="${AppAccountURL}?action=connect" target="blank">Login</a>`
          }
        </div>
        
        ${
          this.isAdmin()
            ? /*html*/ `
              <label class="AIPRM__relative AIPRM__inline-flex AIPRM__items-center AIPRM__mb-5 AIPRM__cursor-pointer AIPRM__flex-col" title="Admin Mode">
                <input type="checkbox" value="" class="AIPRM__sr-only AIPRM__peer" id="adminMode" onchange="AIPRM.toggleAdminMode()" ${
                  this.AdminMode ? " checked" : ""
                }>
                <div class="AIPRM__w-9 AIPRM__h-5 AIPRM__bg-gray-200 peer-focus:AIPRM__outline-none AIPRM__rounded-full AIPRM__peer dark:AIPRM__bg-gray-700 peer-checked:after:AIPRM__translate-x-full peer-checked:after:AIPRM__border-white after:AIPRM__content-[''] after:AIPRM__absolute after:AIPRM__top-[2px] after:AIPRM__left-[2px] after:AIPRM__bg-white after:AIPRM__border-gray-300 after:AIPRM__border after:AIPRM__rounded-full after:AIPRM__h-4 after:AIPRM__w-4 after:AIPRM__transition-all dark:AIPRM__border-gray-600 peer-checked:AIPRM__bg-gray-600"></div>
                <span class="AIPRM__ml-3 AIPRM__text-sm AIPRM__font-medium AIPRM__text-gray-900 dark:AIPRM__text-gray-300"></span>
              </label>
            `
            : ""
        }
      </div>

      ${svg`PromptBubble`}
      
      <h2 class="${css`h2`}"></h2>
      
      <ul class="AIPRM__border-b AIPRM__border-gray-200 dark:AIPRM__border-gray-700 dark:AIPRM__text-gray-400 md:AIPRM__flex AIPRM__flex-wrap AIPRM__font-medium AIPRM__text-center AIPRM__text-gray-500 AIPRM__text-sm AIPRM__whitespace-nowrap">
  
        <li class="AIPRM__flex-1 AIPRM__mr-2">
          <a href="#" id="favoritePromptsTab" title="Your &quot;Favorites&quot; List"
            onclick="${
              favoritesList
                ? `AIPRM.changePromptTemplatesType('${PromptTemplatesType.CUSTOM_LIST}', '${favoritesList.ID}')`
                : "AIPRM.Client.UserQuota.canUseFavorites(AIPRM.Lists) ? AIPRM.howToUseFavoriteList() : null"
            }"
            class="${
              favoritesList &&
              this.PromptTemplatesType === PromptTemplatesType.CUSTOM_LIST &&
              this.PromptTemplatesList === favoritesList.ID
                ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
                : ""
            } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__flex AIPRM__justify-center AIPRM__w-full">
            ${svg("StarSolidLarge")} &nbsp; Favorites
          </a>
        </li>

        <li class="AIPRM__flex-1 AIPRM__mr-2">
          <a href="#" id="AIPRMVerifiedPromptsTab" title="&quot;AIPRM Verified&quot; Prompts List"
            onclick="AIPRM.Client.UserQuota.canUseAIPRMVerifiedList() ? AIPRM.changePromptTemplatesType('${
              PromptTemplatesType.CUSTOM_LIST
            }', '${AIPRMVerifiedList?.ID}') : ''"
            class="${
              AIPRMVerifiedList &&
              this.PromptTemplatesType === PromptTemplatesType.CUSTOM_LIST &&
              this.PromptTemplatesList === AIPRMVerifiedList?.ID
                ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
                : ""
            } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__flex AIPRM__justify-center AIPRM__w-full">
            ${svg("CheckBadgeSolidLarge")} &nbsp; AIPRM
          </a>
        </li>

        <li class="AIPRM__flex-1 AIPRM__mr-2">
          <a href="#" id="publicPromptsTab" onclick="AIPRM.changePromptTemplatesType('${
            PromptTemplatesType.PUBLIC
          }')"
          class="${
            this.PromptTemplatesType === PromptTemplatesType.PUBLIC
              ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
              : ""
          } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__inline-block AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__w-full">
            Public
          </a>
        </li>
        <li class="AIPRM__flex-1 AIPRM__mr-2">
          <a href="#" id="ownPromptsTab" onclick="AIPRM.changePromptTemplatesType('${
            PromptTemplatesType.OWN
          }')"
          class="${
            this.PromptTemplatesType === PromptTemplatesType.OWN
              ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
              : ""
          } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__inline-block AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__w-full">
            Own
          </a>
        </li>

        ${
          customLists.length
            ? customLists
                .map(
                  (list) => /*html*/ `
                  <li class="AIPRM__flex-1 AIPRM__mr-2">
                    <a href="#" title="&quot;${sanitizeInput(
                      list.Comment
                    )}&quot; Prompts List" onclick="AIPRM.changePromptTemplatesType('${
                    PromptTemplatesType.CUSTOM_LIST
                  }', '${list.ID}')"
                    class="${
                      this.PromptTemplatesType ===
                        PromptTemplatesType.CUSTOM_LIST &&
                      this.PromptTemplatesList === list.ID
                        ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
                        : ""
                    } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__flex AIPRM__justify-center AIPRM__items-center AIPRM__gap-2 AIPRM__w-full">
                      ${sanitizeInput(list.Comment)}

                      ${
                        this.PromptTemplatesType ===
                          PromptTemplatesType.CUSTOM_LIST &&
                        this.PromptTemplatesList === list.ID
                          ? /*html*/ `
                          <span onclick="event.stopPropagation(); AIPRM.editCustomList('${
                            list.ID
                          }')" class="AIPRM__ml-2">${svg("Edit")}</span>
                          <span onclick="event.stopPropagation(); AIPRM.deleteCustomList('${
                            list.ID
                          }')">${svg("Trash")}</span>
                        `
                          : ""
                      }
                    </a>
                  </li>`
                )
                .join("")
            : ""
        }
       
        <li class="AIPRM__flex-1">
          <a href="#" id="hiddenPromptsTab" title="&quot;Hidden&quot; Prompts List"
          onclick="${
            hiddenList
              ? `AIPRM.changePromptTemplatesType('${PromptTemplatesType.CUSTOM_LIST}', '${hiddenList.ID}')`
              : "AIPRM.Client.UserQuota.canUseHidden(AIPRM.Lists) ? AIPRM.howToUseHiddenList() : null"
          }"
          class="${
            hiddenList &&
            this.PromptTemplatesType === PromptTemplatesType.CUSTOM_LIST &&
            this.PromptTemplatesList === hiddenList.ID
              ? "AIPRM__bg-gray-50 dark:AIPRM__bg-white/5"
              : ""
          } dark:hover:AIPRM__bg-gray-900 dark:hover:AIPRM__text-gray-300 hover:AIPRM__bg-gray-50 hover:AIPRM__text-gray-600 AIPRM__p-4 AIPRM__rounded-t-lg AIPRM__flex AIPRM__justify-center AIPRM__w-full">
            ${svg("CrossLarge")} &nbsp; Hidden
          </a>
        </li>
      </ul>
  
      <div class="AIPRM__grid AIPRM__grid-cols-2 sm:AIPRM__flex AIPRM__flex-row AIPRM__gap-3 AIPRM__items-end AIPRM__justify-between AIPRM__w-full md:last:AIPRM__mb-6 AIPRM__pt-2 AIPRM__stretch AIPRM__text-left AIPRM__text-sm">
        <div>
          <label for="topicSelect" class="AIPRM__block AIPRM__text-sm AIPRM__font-medium">Topic</label>
      
          <select id="topicSelect" class="AIPRM__bg-gray-100 AIPRM__border-0 AIPRM__text-sm AIPRM__rounded AIPRM__block AIPRM__w-full dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-600 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200 focus:AIPRM__ring-0 dark:hover:AIPRM__bg-gray-900">
            <option value="${DefaultPromptTopic}"
            ${
              this.PromptTopic === DefaultPromptTopic ? "selected" : ""
            }>All</option>

            ${this.Topics.map(
              (topic) =>
                /*html*/ `<option value="${sanitizeInput(topic.ID)}" ${
                  this.PromptTopic === topic.ID ? "selected" : ""
                }>${sanitizeInput(topic.Label)}</option>`
            ).join("")}
          </select>
        </div>

        <div>
          <label for="activitySelect" class="AIPRM__block AIPRM__text-sm AIPRM__font-medium">Activity</label>
      
          <select id="activitySelect" class="AIPRM__bg-gray-100 AIPRM__border-0 AIPRM__text-sm AIPRM__rounded AIPRM__block AIPRM__w-full dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-600 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200 focus:AIPRM__ring-0 dark:hover:AIPRM__bg-gray-900">
            <option value="${DefaultPromptActivity}"
            ${
              this.PromptActivity === DefaultPromptActivity ? "selected" : ""
            }>All</option>

            ${this.getActivities(this.PromptTopic)
              .map(
                (activity) =>
                  /*html*/ `<option value="${sanitizeInput(activity.ID)}" ${
                    this.PromptActivity === activity.ID ? "selected" : ""
                  }>${sanitizeInput(activity.Label)}</option>`
              )
              .join("")}
          </select>
        </div>

        <div>
          <label for="sortBySelect" class="AIPRM__block AIPRM__text-sm AIPRM__font-medium">Sort by</label>
      
          <select id="sortBySelect" class="AIPRM__bg-gray-100 AIPRM__border-0 AIPRM__text-sm AIPRM__rounded AIPRM__block AIPRM__w-full dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-600 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200 focus:AIPRM__ring-0 dark:hover:AIPRM__bg-gray-900">
            ${Object.keys(SortModeNo)
              .map(
                (sortMode) => /*html*/ `
                <option value="${SortModeNo[sortMode]}" ${
                  this.PromptSortMode === SortModeNo[sortMode] ? "selected" : ""
                }>${capitalizeWords(sortMode.replace("_", " "))}</option>`
              )
              .join("")}
          </select>
        </div>
        
        <div>
          <input id="promptSearchInput" type="text" class="AIPRM__bg-gray-100 AIPRM__border-0 AIPRM__text-sm AIPRM__rounded AIPRM__block AIPRM__w-full dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-600 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200 focus:AIPRM__ring-0 md:AIPRM__w-[260px]" placeholder="Search"
          value="${sanitizeInput(
            this.PromptSearch
          )}" onfocus="this.value = this.value">
        </div>
      </div>

      ${
        templates.length > this.PromptTemplateSection.pageSize
          ? paginationContainer
          : ""
      }
      
      <ul class="${css`ul`} AIPRM__grid AIPRM__grid-cols-1 lg:AIPRM__grid-cols-2 2xl:AIPRM__grid-cols-4">
        ${currentTemplates
          .map(
            (template) => /*html*/ `
          <button onclick="AIPRM.selectPromptTemplateByIndex(${
            template.ID
          })" class="${css`card`} AIPRM__relative AIPRM__group">
            ${
              !template.OwnPrompt && !isCustomListView && !isFavoritesListView
                ? /*html*/ `
                  <div class="AIPRM__absolute AIPRM__top-0 AIPRM__left-0 AIPRM__flex AIPRM__text-gray-400 lg:AIPRM__invisible group-hover:AIPRM__visible">
                    <a title="${
                      template.IsHidden ? "Unhide" : "Hide"
                    } this prompt"
                      class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); ${
                        template.IsHidden
                          ? `AIPRM.removeFromHiddenList(${template.ID})`
                          : `AIPRM.addToHiddenList(${template.ID})`
                      } ">
                      ${svg("Cross")}
                    </a>
                  </div>`
                : ""
            }

            ${
              isCustomListView
                ? /*html*/ `
                  <div class="AIPRM__absolute AIPRM__top-0 AIPRM__left-0 AIPRM__flex AIPRM__text-gray-400 lg:AIPRM__invisible group-hover:AIPRM__visible">
                    <a title="Remove this prompt from the list"
                      class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.removeFromList('${
                        this.PromptTemplatesList
                      }', ${template.ID})">
                      ${svg("Cross")}
                    </a>
                  </div>`
                : ""
            }

            <div class="AIPRM__flex AIPRM__items-start AIPRM__w-full AIPRM__justify-between">
              <h3 class="${css`h3`}" style="overflow-wrap: anywhere; ${
              template.IsVerified ? "padding-right: 30px;" : ""
            }">
                ${sanitizeInput(template.Title)}
                ${
                  template.IsVerified
                    ? /*html*/ `
                      <span class="AIPRM__ml-1 AIPRM__text-gray-500 dark:AIPRM__text-gray-400 AIPRM__inline-block"
                            style="vertical-align: sub; transform: translate(20px); margin-left: -20px;"
                            title="This prompt was reviewed and verified by AIPRM.">
                        ${
                          template.IsVerified ? svg("CheckBadgeSolidLarge") : ""
                        }
                      </span>`
                    : ""
                }
              </h3>

              <div class="AIPRM__flex AIPRM__gap-4 AIPRM__justify-center lg:AIPRM__gap-1 lg:AIPRM__pl-2 AIPRM__mt-1 AIPRM__right-2 AIPRM__text-gray-400 lg:AIPRM__invisible group-hover:AIPRM__visible">

                ${
                  !template.OwnPrompt
                    ? /*html*/ `
                    <a title="View prompt template source" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.viewPromptTemplateSource(${
                      template.ID
                    })">${svg("Eye")}</a>
                    <a title="Report this prompt" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.showReportPromptModal(${
                      template.ID
                    })">${svg("Report")}</a>
                    `
                    : ""
                }
                
                ${
                  template.OwnPrompt || this.isAdminMode()
                    ? /*html*/ `
                  <a title="Delete this prompt" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.deletePromptTemplate(${
                    template.ID
                  })">${svg("Trash")}</a>
                  <a title="Edit this prompt" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.editPromptTemplate(${
                    template.ID
                  })">${svg("Edit")}</a>
                  `
                    : ""
                }

                ${
                  template.IsHidden
                    ? ""
                    : /*html*/ `
                      <a title="Add this prompt to list" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.addToList(${
                        template.ID
                      })">${svg("SquaresPlus")}</a>
                      
                      <a title="${`${
                        template.IsFavorite
                          ? "Remove this prompt from"
                          : "Add this prompt to"
                      } Favorites`}" class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); ${
                        template.IsFavorite
                          ? `AIPRM.removeFromFavoritesList(${template.ID})`
                          : `AIPRM.addToFavoritesList(${template.ID})`
                      }">${
                        template.IsFavorite ? svg("StarSolid") : svg("Star")
                      }</a>`
                }
              </div>
            </div>

            <div class="AIPRM__-mt-0.5 AIPRM__text-gray-500 AIPRM__text-xs AIPRM__pb-1 AIPRM__max-w-full AIPRM__w-full">
              <span title="Topic: ${sanitizeInput(
                this.getTopicLabel(template.Community)
              )}">
                ${sanitizeInput(this.getTopicLabel(template.Community))}
              </span>
              /
              <span title="Activity: ${sanitizeInput(
                this.getActivityLabel(template.Category)
              )}">
                ${sanitizeInput(this.getActivityLabel(template.Category))}
              </span>
            </div>

            <div class="AIPRM__text-gray-500 AIPRM__text-xs AIPRM__flex AIPRM__pb-1 AIPRM__max-w-full">
              ${
                template.PromptTypeNo === PromptTypeNo.PUBLIC
                  ? /*html*/ `<span class="AIPRM__mr-1" title="Public">${svg(
                      "Globe"
                    )}</span>`
                  : /*html*/ `<span class="AIPRM__mr-1" title="Private">${svg(
                      "Lock"
                    )}</span>`
              }

              ${
                template.AuthorURL && template.AuthorName
                  ? /*html*/ `·
                    <a href="${sanitizeInput(
                      template.AuthorURL
                    )}" class="AIPRM__mx-1 AIPRM__underline AIPRM__overflow-hidden AIPRM__text-ellipsis AIPRM__flex-1 AIPRM__whitespace-nowrap"
                      onclick="event.stopPropagation()"
                      rel="noopener noreferrer" target="_blank"
                      title="Created by ${sanitizeInput(template.AuthorName)}">
                      ${sanitizeInput(template.AuthorName)}
                    </a>`
                  : ""
              }
              ·
              <span title="Last updated on ${formatDateTime(
                template.RevisionTime
              )}" class="AIPRM__mx-1">${formatAgo(template.RevisionTime)}</span>

              ${
                template.ForkedFromPromptID
                  ? /*html*/ `·
                  <a class="AIPRM__mx-1 AIPRM__underline"
                    onclick="event.stopPropagation()"
                    href="https://app.aiprm.com/prompts/${template.ForkedFromPromptID}"
                    rel="noopener noreferrer" target="_blank"
                    title="Forked from Prompt Template ${template.ForkedFromPromptID}">
                    Forked From
                  </a>`
                  : ""
              }
            </div>
            
            <p class="${css`p`} AIPRM__text-gray-600 dark:AIPRM__text-gray-200 AIPRM__overflow-hidden AIPRM__text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
              title="${sanitizeInput(template.Teaser)}">
              ${
                this.promptRequiresLiveCrawling(template.Prompt)
                  ? /*html*/ `
                    <span class="AIPRM__bg-green-100 AIPRM__text-green-800 AIPRM__text-xs AIPRM__font-medium AIPRM__mr-1 AIPRM__px-1.5 AIPRM__py-0.5 AIPRM__rounded dark:AIPRM__bg-green-900 dark:AIPRM__text-green-300" title="This prompt is utilizing AIPRM Live Crawling feature.">Live Crawling</span>
                  `
                  : ""
              }

              ${sanitizeInput(template.Teaser)}
            </p>

          <div class="AIPRM__text-gray-500 AIPRM__text-xs AIPRM__flex AIPRM__pt-3 AIPRM__w-full AIPRM__justify-between AIPRM__mt-auto">
              <span class="AIPRM__flex AIPRM__items-center" title="Views (${
                template.Views
              })">
                <span class="AIPRM__p-1">${svg(
                  "Eye"
                )}</span> &nbsp; ${formatHumanReadableNumber(template.Views)}
              </span>

              <span class="AIPRM__flex AIPRM__items-center" title="Usages (${
                template.Usages
              })">
                <span class="AIPRM__p-1">${svg(
                  "Quote"
                )}</span> &nbsp; ${formatHumanReadableNumber(template.Usages)}
              </span>

              <span class="AIPRM__flex AIPRM__items-center" title="Votes (${
                template.Votes
              })">
                ${
                  !template.OwnPrompt
                    ? /*html*/ `<a title="Votes (${
                        template.Votes
                      }) - Vote for this prompt with thumbs up"
                      class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.voteThumbsUp(${
                        template.ID
                      })">${svg("ThumbUp")}</a>`
                    : /*html*/ `${svg("ThumbUp")}`
                }
                &nbsp; ${formatHumanReadableNumber(template.Votes)}

                ${
                  !template.OwnPrompt
                    ? /*html*/ `&nbsp; <a title="Votes (${
                        template.Votes
                      }) - Vote for this prompt with thumbs down"
                      class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400" onclick="event.stopPropagation(); AIPRM.voteThumbsDown(${
                        template.ID
                      })">${svg("ThumbDown")}</a>`
                    : ""
                }
              </span>

              <span class="AIPRM__flex AIPRM__items-center" title="Copy link to this prompt">
                <a class="AIPRM__p-1 AIPRM__rounded-md hover:AIPRM__bg-gray-100 hover:AIPRM__text-gray-700 dark:AIPRM__text-gray-400 dark:hover:AIPRM__bg-gray-700 dark:hover:AIPRM__text-gray-200 disabled:dark:hover:AIPRM__text-gray-400"
                onclick="event.stopPropagation(); AIPRM.copyPromptDeepLink(${
                  template.ID
                })" title="Copy link to this prompt">
                ${svg("Link")}
                </a>
              </span>
          </div>
          
        </button>
      `
          )
          .join("")}
        
        ${
          this.PromptTemplatesType === PromptTemplatesType.OWN
            ? /*html*/ `<button onclick="AIPRM.showSavePromptModal()" class="${css`card`} AIPRM__relative AIPRM__group AIPRM__justify-center AIPRM__items-center">
            <div class="AIPRM__flex AIPRM__items-center AIPRM__gap-3">
              ${svg("Plus")}
              Add new prompt template
            </div>
          </button>`
            : ""
        }
      </ul>
    
      ${
        templates.length > this.PromptTemplateSection.pageSize
          ? paginationContainer
          : ""
      }
    
    </div>
   `;

    let wrapper = document.createElement("div");
    wrapper.id = "templates-wrapper";
    wrapper.className =
      "AIPRM__mt-6 md:AIPRM__flex AIPRM__items-start AIPRM__text-center AIPRM__gap-2.5 AIPRM__max-w-full AIPRM__m-auto sm:AIPRM__mx-4 AIPRM__text-sm";

    if (parent.querySelector("#templates-wrapper")) {
      wrapper = parent.querySelector("#templates-wrapper");
    } else {
      parent.appendChild(wrapper);
    }

    wrapper.innerHTML = html;

    // Add event listeners for topic, activity, sort by select, search input and prompts per page select
    wrapper
      .querySelector("#topicSelect")
      .addEventListener("change", this.changePromptTopic.bind(this));

    wrapper
      .querySelector("#activitySelect")
      .addEventListener("change", this.changePromptActivity.bind(this));

    wrapper
      .querySelector("#sortBySelect")
      .addEventListener("change", this.changePromptSortBy.bind(this));

    wrapper
      .querySelector("#promptSearchInput")
      .addEventListener(
        "input",
        this.debounce(this.changePromptSearch.bind(this), 300).bind(this)
      );

    const pageSizeSelectElements = wrapper.querySelectorAll(
      "select.pageSizeSelect"
    );

    // Remove event listener for the pagination buttons (if not needed/already added)
    document.removeEventListener("keydown", this.boundHandleArrowKey);

    // Add event listener for the pagination buttons and page size select elements
    if (pageSizeSelectElements.length > 0) {
      pageSizeSelectElements.forEach((select) => {
        select.addEventListener("change", this.changePromptPageSize.bind(this));
      });

      // Add event listener for the pagination buttons
      document.addEventListener("keydown", this.boundHandleArrowKey);
    }
  },

  /**
   * boundHandleArrowKey is the bound version of the handleArrowKey function
   *
   * @type {function(e: KeyboardEvent): void}
   */
  boundHandleArrowKey: null,

  // handleArrowKey handles the arrow key presses for the page navigation
  async handleArrowKey(e) {
    const isArrowKey = e.key === "ArrowLeft" || e.key === "ArrowRight";

    const isInput =
      e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

    if (!isArrowKey || isInput) {
      // If the key pressed is not an arrow key or if it was pressed in an input or textarea element, do nothing
      return;
    }

    // If the key pressed is a left arrow key, call the previous page function
    if (e.key === "ArrowLeft") {
      await this.prevPromptTemplatesPage();

      return;
    }

    // Otherwise, call the next page function
    await this.nextPromptTemplatesPage();
  },

  // changePromptPageSize updates the this.PromptTemplateSection.pageSize variable and re-renders the templates
  async changePromptPageSize(e) {
    let pageSize = +e.target.value;

    // if the pageSize is not in the pageSizeOptions array, use the default pageSize option
    pageSize = pageSizeOptions.includes(pageSize) ? pageSize : pageSizeDefault;

    // persist the last selected page size in local storage
    localStorage.setItem(lastPageSizeKey, pageSize);

    this.PromptTemplateSection.currentPage = 0;
    this.PromptTemplateSection.pageSize = pageSize;

    await this.insertPromptTemplatesSection();
  },

  // changePromptTopic updates the this.PromptTopic variable and reloads the templates & messages
  async changePromptTopic(e) {
    this.PromptTopic = e.target.value;

    this.PromptActivity = DefaultPromptActivity;

    this.PromptTemplateSection.currentPage = 0;

    await this.selectPromptTemplateByIndex(null);

    // persist the last selected topic in local storage
    localStorage.setItem(lastPromptTopicKey, this.PromptTopic);

    this.fetchPromptTemplates();

    this.fetchMessages();
  },

  // changePromptActivity updates the this.PromptActivity variable and re-renders the templates
  async changePromptActivity(e) {
    this.PromptActivity = e.target.value;

    this.PromptTemplateSection.currentPage = 0;

    await this.insertPromptTemplatesSection();
  },

  // changePromptSortBy updates the this.PromptSortMode variable and reloads the templates
  changePromptSortBy(e) {
    this.PromptSortMode = +e.target.value;

    this.PromptTemplateSection.currentPage = 0;

    this.fetchPromptTemplates();
  },

  // changePromptSearch updates the this.PromptSearch variable and re-renders the templates
  async changePromptSearch(e) {
    this.PromptSearch = e.target.value;

    this.PromptTemplateSection.currentPage = 0;

    await this.insertPromptTemplatesSection();

    const searchInput = document.querySelector("#promptSearchInput");

    searchInput.selectionStart = searchInput.selectionEnd =
      searchInput.value.length;
    searchInput.focus();
  },
  /**
   * changePromptTemplatesType updates PromptTemplatesType and PromptTemplatesList and re-renders the templates
   *
   * @param {PromptTemplatesType} type
   * @param {import('./client.js').List['ID']} listID
   */
  async changePromptTemplatesType(type, listID = null) {
    if (
      this.PromptTemplatesType === type &&
      this.PromptTemplatesList === listID
    ) {
      return;
    }

    this.PromptTemplatesType = type;

    this.PromptTemplatesList = listID;

    this.PromptTemplateSection.currentPage = 0;

    // persist the last selected prompt template type and listID in local storage
    localStorage.setItem(lastPromptTemplateTypeKey, type);
    localStorage.setItem(lastListIDKey, listID);

    await this.insertPromptTemplatesSection();
  },

  // debounce is a function that returns a function that will only execute after a certain amount of time has passed
  debounce(callback, milliseconds) {
    let timeout;

    return (argument) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(argument), milliseconds);
    };
  },

  // Insert language select and continue button above the prompt textarea input
  insertLanguageToneWritingStyleContinueActions() {
    let wrapper = document.createElement("div");

    wrapper.id = "language-select-wrapper";
    wrapper.className = css("languageSelectWrapper");

    // Get the list of languages
    const languages = this.Languages;

    // If there are no languages, skip
    if (!languages) {
      console.error("insertLanguageSelect: No languages found");
      return;
    }

    // Get the prompt textarea input
    const textarea = document.querySelector(
      `form textarea:not([name^="${variableIDPrefix}"])`
    );

    // If there is no textarea, skip
    if (!textarea) {
      console.error("insertLanguageSelect: No textarea found");
      return;
    }

    // Hide the spacer for absolutely positioned prompt input
    const spacer = document.querySelector(
      ".w-full.h-32.md\\:h-48.flex-shrink-0"
    );

    if (spacer) {
      spacer.style = "display: none";
    }

    // Remove the absolute positioning from the prompt input parent
    const formParent = textarea.form.parentElement;

    if (formParent) {
      formParent.classList.remove(
        "absolute",
        "md:!bg-transparent",
        "md:border-t-0",
        "md:dark:border-transparent",
        "md:border-transparent"
      );
    }

    // Get the parent of the textarea
    const parent = textarea.parentElement;

    // If there is no parent element, skip
    if (!parent) {
      console.error("insertLanguageSelect: No parent element found");
      return;
    }

    // Add padding to the parent element
    parent.classList.add("AIPRM__pr-4");

    // Get existing language select wrapper or create a new one
    if (parent.querySelector(`#${wrapper.id}`)) {
      wrapper = parent.querySelector(`#${wrapper.id}`);
    } else {
      parent.prepend(wrapper);
    }

    // Create the HTML for the language select section
    wrapper.innerHTML = /*html*/ `
    <div class="AIPRM__flex AIPRM__w-full">
      <div>
        <label for="languageSelect" class="${css(
          "selectLabel"
        )} AIPRM__whitespace-nowrap">Output in</label>
        
        <select id="languageSelect" class="${css("select")}">
          <option value ${
            !this.TargetLanguage ? " selected" : ""
          }>Default language</option>

          ${this.Languages.map(
            (language) => `
            <option value="${language.languageEnglish}" ${
              this.TargetLanguage === language.languageEnglish
                ? " selected"
                : ""
            }>
              ${language.languageLabel}
              </option>
          `
          ).join("")}
        </select>
      </div>
      
      <div class="AIPRM__ml-2">
        <label for="toneSelect" class="${css("selectLabel")}">Tone</label>
      
        <select id="toneSelect" class="${css("select")}">
          <option value ${!this.Tone ? " selected" : ""}>Default</option>

          ${this.Tones.filter((tone) =>
            this.Client.UserQuota.canUseCustomTone(tone)
          )
            .map(
              (tone) => `
            <option value="${tone.ID}" ${
                this.Tone === tone.ID ? " selected" : ""
              }>
              ${tone.Label}
              </option>
          `
            )
            .join("")}

          ${
            !this.Client.UserQuota.canUseCustomTone()
              ? '<option value disabled>_________</option><option value="UPGRADE">Upgrade for more</option>'
              : ""
          }
        </select>
      </div>

      <div class="AIPRM__ml-2">
        <label for="writingStyleSelect" class="${css(
          "selectLabel"
        )} AIPRM__whitespace-nowrap">Writing Style</label>
      
        <select id="writingStyleSelect" class="${css("select")}">
          <option value ${
            !this.WritingStyle ? " selected" : ""
          }>Default</option>

          ${this.WritingStyles.filter((writingStyle) =>
            this.Client.UserQuota.canUseCustomWritingStyle(writingStyle)
          )
            .map(
              (writingStyle) => `
            <option value="${writingStyle.ID}" ${
                this.WritingStyle === writingStyle.ID ? " selected" : ""
              }>
              ${writingStyle.Label}
              </option>
          `
            )
            .join("")}

          ${
            !this.Client.UserQuota.canUseCustomWritingStyle()
              ? '<option value disabled>_________</option><option value="UPGRADE">Upgrade for more</option>'
              : ""
          }
        </select>
      </div>
    </div>

    <div class="AIPRM__inline-flex AIPRM__invisible" role="group" id="continueActionsGroup">
      <button id="continueWritingButton" title="Continue writing please" class="${css(
        "continueButton"
      )}" onclick="event.stopPropagation(); AIPRM.continueWriting()" type="button">
        Continue
      </button>

      <select id="continueActionSelect" class="${css("continueActionSelect")}">
        <option value selected disabled>-- Select an action --</option>

        ${this.ContinueActions.map(
          (action) => `
          <option value="${action.ID}" ${
            !this.Client.UserQuota.canUsePowerContinue() ? "disabled" : ""
          }>${action.Label}</option>
        `
        ).join("")}

        ${
          !this.Client.UserQuota.canUsePowerContinue()
            ? '<option value disabled>_________</option><option value="UPGRADE">Upgrade to activate</option>'
            : ""
        }
      </select>
    </div>
  `;

    // Add event listener to language select to update the target language on change
    wrapper
      .querySelector("#languageSelect")
      .addEventListener("change", this.changeTargetLanguage.bind(this));

    // Add event listener to tone select to update the tone on change
    wrapper
      .querySelector("#toneSelect")
      .addEventListener("change", this.changeTone.bind(this));

    // Add event listener to writing style select to update the writing style on change
    wrapper
      .querySelector("#writingStyleSelect")
      .addEventListener("change", this.changeWritingStyle.bind(this));

    // Add event listener to continue action select to update the continue action on change
    wrapper
      .querySelector("#continueActionSelect")
      .addEventListener("change", this.changeContinueAction.bind(this));
  },

  insertVariablesInputWrapper() {
    let variableWrapper = document.querySelector("#" + variableWrapperID);

    if (variableWrapper) {
      variableWrapper.innerHTML = "";
      variableWrapper.classList.add("AIPRM__hidden");
    } else {
      const langWrapper = document.querySelector("#language-select-wrapper");
      variableWrapper = document.createElement("div");
      variableWrapper.id = variableWrapperID;

      variableWrapper.className =
        "AIPRM__gap-3 lg:AIPRM__max-w-3xl md:last:AIPRM__mb-6 AIPRM__mx-2 AIPRM__pt-2 AIPRM__stretch AIPRM__justify-between AIPRM__text-sm AIPRM__pb-2 AIPRM__mb-2 AIPRM__border-b AIPRM__hidden";
      langWrapper.after(variableWrapper);
    }
  },

  // Change the TargetLanguage on selection change
  changeTargetLanguage(event) {
    this.TargetLanguage = event.target.value;

    // persist the last selected language in local storage
    localStorage.setItem(lastTargetLanguageKey, this.TargetLanguage);
  },

  // Change the Tone on selection change
  changeTone(event) {
    // Show upgrade modal if the user is not allowed to use more custom tones
    if (event.target.value === "UPGRADE") {
      this.Tone = null;

      this.Client.UserQuota.upgradeCustomTone();

      return;
    }

    this.Tone = parseInt(event.target.value);
  },

  // Change the WritingStyle on selection change
  changeWritingStyle(event) {
    // Show upgrade modal if the user is not allowed to use more custom tones
    if (event.target.value === "UPGRADE") {
      this.WritingStyle = null;

      this.Client.UserQuota.upgradeCustomTone();

      return;
    }

    this.WritingStyle = parseInt(event.target.value);
  },

  // Change the ContinueAction on selection change and submit the continue action prompt
  changeContinueAction(event) {
    // Show upgrade modal if the user is not allowed to use Power Continue
    if (event.target.value === "UPGRADE") {
      this.Client.UserQuota.upgradePowerContinue();

      return;
    }

    const continueActionID = parseInt(event.target.value);

    // Get prompt for the selected continue action
    const continueAction = this.ContinueActions.find(
      (action) => action.ID === continueActionID
    );

    // If the continue action is not found, skip
    if (!continueAction) {
      return;
    }

    // Track usage of continue action
    this.Client.usePrompt(`${continueAction.ID}`, UsageTypeNo.SEND);

    // Submit the continue action prompt
    this.submitContinueActionPrompt(continueAction.Prompt);
  },

  // Ask ChatGPT to continue writing
  continueWriting() {
    this.submitContinueActionPrompt("Continue writing please");
  },

  // Submit the continue action prompt to ChatGPT
  submitContinueActionPrompt(prompt = "") {
    const textarea = document.querySelector(
      `form textarea:not([name^="${variableIDPrefix}"])`
    );

    // If the textarea is not empty and it's not "Continue writing please" - ask for confirmation
    if (
      textarea.value.trim() &&
      textarea.value.trim() !== "Continue writing please" &&
      !confirm(
        "Are you sure you want to continue? The current prompt text will be lost."
      )
    ) {
      return;
    }

    // Add the continue action prompt to the textarea
    textarea.value = prompt;
    textarea.focus();

    // Dispatch the input event to trigger the event listeners and enable the "Submit" button
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // select button element which is in form and it's direct next sibling of textarea
    let button = textarea.nextElementSibling;

    // Enable button if it's disabled
    if (button.disabled) {
      button.disabled = false;
    }

    // If the button is not found, skip
    if (
      !button ||
      !button.tagName ||
      button.tagName.toLowerCase() !== "button"
    ) {
      return;
    }

    // Click the "Submit" button
    button.click();
  },

  hideContinueActionsButton() {
    const button = document.querySelector("#continueActionsGroup");

    if (!button) {
      return;
    }

    button.classList.add("AIPRM__invisible");
  },

  showContinueActionsButton() {
    const button = document.querySelector("#continueActionsGroup");

    if (!button) {
      return;
    }

    button.classList.remove("AIPRM__invisible");
  },

  // Decrement the current page of the prompt templates section and re-render
  async prevPromptTemplatesPage() {
    this.PromptTemplateSection.currentPage--;
    this.PromptTemplateSection.currentPage = Math.max(
      0,
      this.PromptTemplateSection.currentPage
    );

    // Update the section
    await this.insertPromptTemplatesSection();
  },

  // nextPromptTemplatesPage increments the current page and re-renders the templates
  async nextPromptTemplatesPage() {
    let templates = await this.getCurrentPromptTemplates();

    if (!templates || !Array.isArray(templates)) return;

    // Filter templates based on selected activity and search query
    templates = await this.filterPromptTemplates(templates);

    // If there are no templates, skip
    if (templates.length === 0) return;

    this.PromptTemplateSection.currentPage++;

    this.PromptTemplateSection.currentPage = Math.min(
      Math.floor((templates.length - 1) / this.PromptTemplateSection.pageSize),
      this.PromptTemplateSection.currentPage
    );

    // Update the section
    await this.insertPromptTemplatesSection();
  },

  // Export the current chat log to a file
  exportCurrentChat() {
    const blocks = [
      ...document.querySelector(".flex.flex-col.items-center").children,
    ];

    let markdown = blocks.map((block) => {
      let wrapper = block.querySelector(".whitespace-pre-wrap");

      if (!wrapper) {
        return "";
      }

      // probably a user's, so..
      if (wrapper.children.length === 0) {
        return "**User:**\n" + wrapper.innerText;
      }

      // pass this point is assistant's

      wrapper = wrapper.firstChild;

      return (
        "**ChatGPT:**\n" +
        [...wrapper.children]
          .map((node) => {
            switch (node.nodeName) {
              case "PRE":
                return `\`\`\`${
                  node
                    .getElementsByTagName("code")[0]
                    .classList[2].split("-")[1]
                }\n${node.innerText.replace(/^Copy code/g, "").trim()}\n\`\`\``;
              default:
                return `${node.innerHTML}`;
            }
          })
          .join("\n")
      );
    });

    markdown = markdown.filter((b) => b);

    if (!markdown) return false;

    let header = "";

    try {
      header =
        ExportHeaderPrefix +
        window.__NEXT_DATA__.props.pageProps.user.name +
        " on " +
        new Date().toLocaleString() +
        "\n```\n\n---";
    } catch {
      console.error(
        "Failed to get user name from window.__NEXT_DATA__.props.pageProps.user.name. Using default header instead."
      );
    }

    const blob = new Blob([header + "\n\n\n" + markdown.join("\n\n---\n\n")], {
      type: "text/plain",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    //a.download = 'chatgpt-thread_' + (new Date().toLocaleString('en-US', { hour12: false }).replace(/[\s/:]/g, '-').replace(',', '')) + '.md'
    a.download = ExportFilePrefix + new Date().toISOString() + ".md";
    document.body.appendChild(a);
    a.click();
  },

  /** @param {string} ForkedFromPromptID */
  updateForkedFromPromptLink(ForkedFromPromptID) {
    const forkedFromPromptLink = document.getElementById(
      "savePromptForm-forked-from"
    );

    // Update the "Forked from Prompt Template" link
    forkedFromPromptLink.href =
      "https://app.aiprm.com/prompts/" + ForkedFromPromptID;

    forkedFromPromptLink.innerHTML =
      "Forked from Prompt Template " + ForkedFromPromptID;

    // Show the "Forked from Prompt Template" link
    forkedFromPromptLink.style = "display: block;";
  },

  /** @param {HTMLFormElement} form */
  hidePublicPromptFormElements(form) {
    // Disable the "Share as public" checkbox
    form.elements["Public"].type = "hidden";
    form.elements["Public"].disabled = true;
    form.elements["Public"].checked = false;

    // Hide the "Share as public" checkbox
    document.getElementById("savePromptForm-public-checkbox").style =
      "display: none;";

    // Hide the "Share as public" disclaimer
    document.getElementById("savePromptForm-public-disclaimer").style =
      "display: none;";
  },

  // Edit the prompt template
  async editPromptTemplate(idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    // Only allow editing of own prompt templates
    if (
      this.PromptTemplatesType !== PromptTemplatesType.OWN &&
      !prompt.OwnPrompt &&
      !this.isAdminMode()
    ) {
      return;
    }

    await this.showSavePromptModal(new CustomEvent(editPromptTemplateEvent));

    // Pre-fill the prompt template modal with the prompt template
    const form = document.getElementById("savePromptForm");

    form.elements["Prompt"].value = prompt.Prompt;
    form.elements["Teaser"].value = prompt.Teaser;
    form.elements["PromptHint"].value = prompt.PromptHint;
    form.elements["Title"].value = prompt.Title;
    form.elements["Community"].value = prompt.Community;
    form.elements["ID"].value = prompt.ID;
    form.elements["AuthorName"].value = prompt.AuthorName;
    form.elements["AuthorURL"].value = prompt.AuthorURL;
    form.elements["Views"].value = prompt.Views;
    form.elements["Usages"].value = prompt.Usages;
    form.elements["Votes"].value = prompt.Votes;

    // Show the "Forked from Prompt Template" link if applicable
    if (prompt.ForkedFromPromptID) {
      form.elements["ForkedFromPromptID"].value = prompt.ForkedFromPromptID;

      this.updateForkedFromPromptLink(prompt.ForkedFromPromptID);

      if (!this.isAdminMode()) {
        // Forked prompts for non-admins are always private
        this.hidePublicPromptFormElements(form);
      }
    }

    // Check the "Share as public" checkbox if the prompt template is public
    if (prompt.PromptTypeNo === PromptTypeNo.PUBLIC) {
      form.elements["Public"].checked = true;
    }

    // Trigger onchange event on Topics to update available Activities
    form.elements["Community"].dispatchEvent(new Event("change"));

    // Set the selected Activity (category)
    form.elements["Category"].value = prompt.Category;

    const cloneButton = document.getElementById("AIPRM__cloneButton");
    cloneButton.classList.remove("AIPRM__hidden");
    cloneButton.onclick = () => {
      this.hideSavePromptModal();
      this.clonePrompt(idx);
    };
  },

  // Delete a prompt template
  async deletePromptTemplate(idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    // Only allow deleting of own prompt templates
    if (
      this.PromptTemplatesType !== PromptTemplatesType.OWN &&
      !prompt.OwnPrompt &&
      !this.isAdminMode()
    ) {
      return;
    }

    // Ask for confirmation
    if (
      !confirm(
        `Are you sure you want to delete prompt template "${prompt.Title}"?`
      )
    ) {
      return;
    }

    try {
      await this.Client.deletePrompt(prompt.ID);

      // remove template using ID
      this.OwnPrompts = this.OwnPrompts.filter(
        (ownPrompt) => ownPrompt.ID !== prompt.ID
      );

      // remove template using ID from the public prompt templates if it's public
      if (prompt.PromptTypeNo === PromptTypeNo.PUBLIC) {
        this.PromptTemplates = this.PromptTemplates.filter(
          (promptTemplate) => promptTemplate.ID !== prompt.ID
        );
      }
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return;
    }

    // update the section
    await this.insertPromptTemplatesSection();
  },

  // Vote for a prompt template with a thumbs up
  async voteThumbsUp(idx) {
    try {
      await this.Client.voteForPrompt(this.PromptTemplates[idx].ID, 1);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      "Thanks for your vote!"
    );
  },

  // Vote for a prompt template with a thumbs down
  async voteThumbsDown(idx) {
    try {
      await this.Client.voteForPrompt(this.PromptTemplates[idx].ID, -1);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      "Thanks for your vote!"
    );
  },

  // Report the prompt template as inappropriate
  async reportPrompt(e) {
    // prevent the form from submitting
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await this.Client.reportPrompt(
        formData.get("PromptID"),
        +formData.get("FeedbackTypeNo"),
        formData.get("FeedbackText"),
        formData.get("FeedbackContact")
      );
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Something went wrong. Please try again."
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      "Thanks for your feedback! We will review this prompt."
    );

    this.hideModal("reportPromptModal");
  },

  // Copy link to prompt template to clipboard
  async copyPromptDeepLink(idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    if (!prompt) {
      return;
    }

    const promptLink =
      prompt.PromptTypeNo === PromptTypeNo.PUBLIC
        ? `https://app.aiprm.com/prompts/${prompt.ID}`
        : `https://chat.openai.com/chat?${queryParamPromptID}=${prompt.ID}`;

    navigator.clipboard.writeText(promptLink).then(
      // successfully copied
      () => {
        // Warning about prompt not shared as public
        if (prompt.PromptTypeNo !== PromptTypeNo.PUBLIC) {
          this.showNotification(
            NotificationSeverity.WARNING,
            "The link to the prompt template was copied to your clipboard.<br>This prompt is not shared as public. Only you can access it."
          );

          return;
        }

        // Success - copied & public
        this.showNotification(
          NotificationSeverity.SUCCESS,
          "The link to the prompt template was copied to your clipboard."
        );
      },
      // error - something went wrong (permissions?)
      () => {
        this.showNotification(
          NotificationSeverity.ERROR,
          "Something went wrong. Please try again."
        );
      }
    );
  },

  // This function selects a prompt template using the index
  async selectPromptTemplateByIndex(idx) {
    const templates = await this.getCurrentPromptTemplates();

    // If there are no templates, skip
    if (!templates || !Array.isArray(templates)) return;

    this.selectPromptTemplate(templates[idx]);

    // Hide the "Continue Writing" button (prompt selected/new chat)
    this.hideContinueActionsButton();
  },

  extractVariableDefinitions(template) {
    if (template.PromptVariables) {
      return;
    }

    var promptVariables = [];
    var matches;
    while ((matches = VariableDefinition.exec(template.Prompt))) {
      let promptVariableID = matches[1];

      var unique = true;
      promptVariables.forEach((promptVariable) => {
        if (promptVariable.ID === promptVariableID) {
          unique = false;
        }
      });

      if (unique) {
        let defaultValue = "";
        if (matches.length >= 4 && matches[3]) {
          defaultValue = matches[3].substring(1);
        }

        let enumS = [];
        if (matches.length >= 5 && matches[4]) {
          let enumsString = matches[4].substring(1);

          if (enumsString.length > 0) {
            enumS = enumsString.split("|");
          }
        }

        promptVariables.push({
          ID: promptVariableID,
          Label: matches[2],
          DefaultValue: defaultValue,
          EnumS: enumS,
        });
      }
    }

    if (promptVariables.length > 0) {
      // Reorder prompt variables by ID ascending
      promptVariables.sort((a, b) => a.ID - b.ID);

      template.PromptVariables = promptVariables;
    }
  },

  promptVariableEnumValueSelected(selectElem) {
    // Show upgrade modal if the user is not allowed to use more enum values
    if (selectElem.value === "UPGRADE") {
      selectElem.selectedIndex = 0;
      this.Client.UserQuota.upgradePromptVariableEnumMaxSize();

      return;
    }
  },

  /**
   * Select a prompt template and show it in the prompt input field
   *
   * @param {Prompt} template
   */
  selectPromptTemplate(template) {
    const textarea = document.querySelector(
      `textarea:not([name^="${variableIDPrefix}"])`
    );
    const parent = textarea.parentElement;
    let wrapper = document.createElement("div");
    wrapper.id = "prompt-wrapper";
    if (parent.querySelector("#prompt-wrapper")) {
      wrapper = parent.querySelector("#prompt-wrapper");
    } else {
      parent.prepend(wrapper);
    }

    const url = new URL(window.location.href);

    this.insertVariablesInputWrapper();

    const variableWrapper = document.querySelector("#" + variableWrapperID);

    if (template) {
      // if the prompt needs live crawling, check if the user can use it
      if (
        this.promptRequiresLiveCrawling(template.Prompt) &&
        !this.Client.UserQuota.canUseLiveCrawling()
      ) {
        return;
      }

      wrapper.innerHTML = /*html*/ `
        <span class="${css`tag`}" title="${sanitizeInput(template.Teaser)}">
          ${sanitizeInput(template.Title)}
        </span>

        ${
          template.AuthorURL && template.AuthorName
            ? /*html*/ `
              <span class="AIPRM__text-xs">by
                <a href="${sanitizeInput(template.AuthorURL)}"
                  class="AIPRM__mx-1 AIPRM__underline"
                  onclick="event.stopPropagation()"
                  rel="noopener noreferrer" target="_blank"
                  title="Created by">${sanitizeInput(template.AuthorName)}</a>
              </span>
            `
            : ""
        }`;

      this.extractVariableDefinitions(template);

      if (template.PromptVariables && template.PromptVariables.length > 0) {
        variableWrapper.classList.remove("AIPRM__hidden");

        if (template.PromptVariables.length == 1) {
          variableWrapper.classList.remove(
            "AIPRM__grid",
            "AIPRM__grid-cols-1",
            "lg:AIPRM__grid-cols-2"
          );
        } else {
          variableWrapper.classList.add(
            "AIPRM__grid",
            "AIPRM__grid-cols-1",
            "lg:AIPRM__grid-cols-2"
          );
        }

        template.PromptVariables.forEach((promptVariable) => {
          const variableElement = document.createElement("div");

          let variableHTML = /*html*/ `
            <label class="AIPRM__block AIPRM__text-sm AIPRM__font-medium AIPRM__truncate" title="${sanitizeInput(
              promptVariable.Label
            )}">${sanitizeInput(promptVariable.Label)}</label>
          `;

          if (promptVariable.EnumS.length > 0) {
            variableHTML += /*html*/ `
              <select id="${variableIDPrefix}${promptVariable.ID}"
                name="${variableIDPrefix}${promptVariable.ID}"
                title="${sanitizeInput(promptVariable.Label)}"
                onchange="AIPRM.promptVariableEnumValueSelected(this)"
                class="AIPRM__w-full AIPRM__border-0 AIPRM__rounded AIPRM__p-2 AIPRM__mt-1 AIPRM__bg-gray-100 dark:AIPRM__bg-gray-600 dark:AIPRM__border-gray-600 dark:hover:AIPRM__bg-gray-900 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200" required>
                  ${promptVariable.EnumS.slice(
                    0,
                    this.Client.UserQuota.promptVariableEnumMaxSize()
                  )
                    .map(
                      (e) => /*html*/ `
                      <option value="${sanitizeInput(e)}" ${
                        promptVariable.DefaultValue === e ? "selected" : ""
                      }>${sanitizeInput(e)}</option>`
                    )
                    .join("")}

                  ${
                    promptVariable.EnumS.length >
                    this.Client.UserQuota.promptVariableEnumMaxSize()
                      ? '<option value disabled>_________</option><option value="UPGRADE">Upgrade for all prompt variable values</option>'
                      : ""
                  }
              }
              </select>
           `;
          } else {
            variableHTML += /*html*/ `
              <textarea id="${variableIDPrefix}${promptVariable.ID}"
              name="${variableIDPrefix}${promptVariable.ID}"
              rows="1"
              title="${sanitizeInput(promptVariable.Label)}"
              placeholder="${sanitizeInput(promptVariable.Label)}"
              class="AIPRM__w-full AIPRM__border-0 AIPRM__rounded AIPRM__p-2 AIPRM__mt-1 AIPRM__bg-gray-100 dark:AIPRM__bg-gray-600 dark:AIPRM__border-gray-600 dark:hover:AIPRM__bg-gray-900 dark:AIPRM__placeholder-gray-400 dark:AIPRM__text-white hover:AIPRM__bg-gray-200">${sanitizeInput(
                promptVariable.DefaultValue
              )}</textarea>
            `;
          }

          variableElement.innerHTML = variableHTML;
          variableWrapper.append(variableElement);
        });
      }

      textarea.placeholder = template.PromptHint;
      this.SelectedPromptTemplate = template;
      textarea.focus();

      this.Client.usePrompt(template.ID, UsageTypeNo.CLICK);

      // Update query param AIPRM_PromptID to the selected prompt ID
      if (url.searchParams.get(queryParamPromptID) === template.ID) {
        return;
      }

      url.searchParams.set(queryParamPromptID, template.ID);
    } else {
      wrapper.innerHTML = "";
      textarea.placeholder = "";
      this.SelectedPromptTemplate = null;

      // Remove AIPRM_VARIABLE* and AIPRM_PromptID query params
      const removeSearchParams = [];

      for (const key of url.searchParams.keys()) {
        if (key.startsWith(queryParamVariable) || key === queryParamPromptID) {
          removeSearchParams.push(key);
        }
      }

      // No need to update the history if no query params to remove
      if (!removeSearchParams.length) {
        return;
      }

      // Remove query params
      removeSearchParams.forEach((key) => url.searchParams.delete(key));
    }

    // Push new URL to browser history
    window.history.pushState({}, "", url);
  },

  CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    var pattern = new RegExp(
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );
    var data = [[]];
    var matches;
    while ((matches = pattern.exec(strData))) {
      var delimiter = matches[1];
      if (delimiter.length && delimiter !== strDelimiter) {
        data.push([]);
      }
      var value = matches[2]
        ? matches[2].replace(new RegExp('""', "g"), '"')
        : matches[3];
      data[data.length - 1].push(value);
    }
    return data;
  },

  // get the topic label from the topic ID
  getTopicLabel(TopicID) {
    const topic = this.Topics.find((topic) => topic.ID === TopicID);

    if (!topic) {
      return "";
    }

    return topic.Label;
  },

  // get the activity label from the activity ID
  getActivityLabel(ActivityID) {
    const activity = this.Activities.find(
      (activity) => activity.ID === ActivityID
    );

    if (!activity) {
      return "";
    }

    return activity.Label;
  },

  // current user is admin
  isAdmin() {
    return this.Client.User.UserLevelNo === UserLevelNo.SUPER_ADMIN;
  },

  // current user is admin and has enabled admin mode
  isAdminMode() {
    return this.isAdmin() && this.AdminMode;
  },

  // toggle admin mode and re-render prompt templates
  async toggleAdminMode() {
    if (!this.isAdmin()) {
      return;
    }

    this.AdminMode = !this.AdminMode;

    await this.insertPromptTemplatesSection();
  },

  // current user can create public or private prompt template
  canCreatePromptTemplate() {
    return (
      this.canCreatePublicPromptTemplate() ||
      this.canCreatePrivatePromptTemplate()
    );
  },

  // current user can create private prompt template
  canCreatePrivatePromptTemplate() {
    return (
      this.isAdmin() ||
      this.Client.UserQuota.canCreatePrivatePromptTemplate(this.OwnPrompts)
    );
  },

  // current user can create public prompt template
  canCreatePublicPromptTemplate() {
    return (
      this.isAdmin() ||
      this.Client.UserQuota.canCreatePublicPromptTemplate(this.OwnPrompts)
    );
  },

  /**
   * Show modal to view prompt template
   */
  async showViewPromptModal(idx) {
    let viewPromptModal = document.getElementById("viewPromptModal");

    // if modal does not exist, create it, add event listener on submit and append it to body
    if (!viewPromptModal) {
      viewPromptModal = document.createElement("div");
      viewPromptModal.id = "viewPromptModal";
      document.body.appendChild(viewPromptModal);
    }

    viewPromptModal.innerHTML = /*html*/ `
      <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__text-center AIPRM__transition-opacity AIPRM__z-50">
        <div class="AIPRM__absolute AIPRM__bg-gray-900 AIPRM__inset-0 AIPRM__opacity-90">
        </div>

        <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__overflow-y-auto">
          <div class="AIPRM__flex AIPRM__items-center AIPRM__justify-center AIPRM__min-h-full">
            <form id="viewPromptForm">
              <div
              class="AIPRM__align-center AIPRM__bg-white dark:AIPRM__bg-gray-800 dark:AIPRM__text-gray-200 AIPRM__inline-block AIPRM__overflow-hidden sm:AIPRM__rounded-lg AIPRM__shadow-xl sm:AIPRM__align-middle sm:AIPRM__max-w-lg sm:AIPRM__my-8 sm:AIPRM__w-full AIPRM__text-left AIPRM__transform AIPRM__transition-all"
              role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          
                <div class="AIPRM__bg-white dark:AIPRM__bg-gray-800 AIPRM__px-4 AIPRM__pt-5 AIPRM__pb-4 sm:AIPRM__p-6 sm:AIPRM__pb-4 AIPRM__overflow-y-auto">
                  <label>Prompt Template</label>
                  <textarea disabled name="Prompt" class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" style="height: 120px;" required
                            placeholder="Prompt text including placeholders [TARGETLANGUAGE] or [PROMPT] replaced automagically by AIPRM"
                            title="Prompt text including placeholders [TARGETLANGUAGE] or [PROMPT] replaced automagically by AIPRM"></textarea>
            
                  <label>Teaser</label>
                  <textarea disabled name="Teaser" required
                    title="Short teaser for this prompt template, e.g. 'Create a keyword strategy and SEO content plan from 1 [KEYWORD]'"
                    class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" style="height: 71px;"
                    placeholder="Create a keyword strategy and SEO content plan from 1 [KEYWORD]"></textarea>
                    
                  <label>Prompt Hint</label>
                  <input disabled name="PromptHint" required type="text"
                    title="Prompt hint for this prompt template, e.g. '[KEYWORD]' or '[your list of keywords, maximum ca. 8000]"
                    class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__p-2 AIPRM__mt-2 AIPRM__mb-3" placeholder="[KEYWORD] or [your list of keywords, maximum ca. 8000]" />

                  <label>Title</label>
                  <input disabled name="Title" type="text"
                    title="Short title for this prompt template, e.g. 'Keyword Strategy'" required placeholder="Keyword Strategy" class="AIPRM__w-full AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2" />
            
                  <div class="AIPRM__flex">
                    <div class="AIPRM__mr-4 AIPRM__w-full">
                      <label>Topic</label>
                      <select disabled name="Community" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full" required>
                        ${this.Topics.map(
                          (topic) => /*html*/ `
                              <option value="${sanitizeInput(topic.ID)}" ${
                            topic.ID === this.PromptTopic ? "selected" : ""
                          }>${sanitizeInput(topic.Label)}</option>`
                        ).join("")}
                      </select>
                    </div>

                    <div class="AIPRM__w-full">
                      <label>Activity</label>
                      <select disabled name="Category" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full" required>
                        ${this.getActivities(
                          this.PromptTopic === DefaultPromptTopic
                            ? this.Topics[0].ID
                            : this.PromptTopic
                        )
                          .map(
                            (activity) => /*html*/ `
                              <option value="${sanitizeInput(
                                activity.ID
                              )}">${sanitizeInput(activity.Label)}</option>`
                          )
                          .join("")}
                      </select>
                    </div>
                  </div>

                  <div class="AIPRM__block AIPRM__mt-4">
                    <div class="AIPRM__flex AIPRM__justify-between AIPRM__mt-4">
                      <div class="AIPRM__mr-4 AIPRM__w-full"><label>Author Name</label>
                        <input disabled name="AuthorName" type="text" title="Author Name visible for all users"
                              placeholder="Author Name" class="AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2 AIPRM__w-full" />
                      </div>

                      <div class="AIPRM__w-full"><label>Author URL</label>
                        <input disabled name="AuthorURL" type="url" title="Author URL visible for all users"
                              placeholder="https://www.example.com/" class="AIPRM__bg-gray-100 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 AIPRM__rounded AIPRM__mb-3 AIPRM__mt-2 AIPRM__p-2 AIPRM__w-full" />
                      </div>
                    </div>
                  </div>
                </div>
            
                <div class="AIPRM__bg-gray-200 dark:AIPRM__bg-gray-700 AIPRM__px-4 AIPRM__py-3 AIPRM__text-right">
                  <button type="button" class="AIPRM__bg-gray-600 hover:AIPRM__bg-gray-800 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white"
                          onclick="AIPRM.hideViewPromptModal()"> Close
                  </button>
                  <button type="button" class="AIPRM__bg-green-600 hover:AIPRM__bg-green-700 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white"
                          onclick="AIPRM.hideViewPromptModal(); AIPRM.forkToPrivatePrompt(${idx})">
                    Fork as Private Prompt
                  </button>
                </div>
            
              </div>
            </form>
          </div>
        </div>
        
      </div>
    `;

    viewPromptModal.style = "display: block;";

    // add event listener to close the modal on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideViewPromptModal();
      }
    });
  },

  hideViewPromptModal() {
    this.hideModal("viewPromptModal");
  },

  async viewPromptTemplateSource(idx) {
    if (!this.Client.UserQuota.canUseViewPromptTemplateSource()) {
      return;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    this.showViewPromptModal(idx);

    // Pre-fill the prompt template modal with the prompt template
    const form = document.getElementById("viewPromptForm");

    form.elements["Prompt"].value = prompt.Prompt;
    form.elements["Teaser"].value = prompt.Teaser;
    form.elements["PromptHint"].value = prompt.PromptHint;
    form.elements["Title"].value = prompt.Title;
    form.elements["Community"].value = prompt.Community;
    form.elements["Category"].value = prompt.Category;
    form.elements["AuthorName"].value = prompt.AuthorName;
    form.elements["AuthorURL"].value = prompt.AuthorURL;
  },

  async forkToPrivatePrompt(idx) {
    const promptOriginal = (await this.getCurrentPromptTemplates())[idx];

    await this.showSavePromptModal();

    // Pre-fill the prompt template modal with the prompt template
    const form = document.getElementById("savePromptForm");

    form.elements["ForkedFromPromptID"].value = promptOriginal.ID;

    form.elements["Prompt"].value = promptOriginal.Prompt;
    form.elements["Teaser"].value = promptOriginal.Teaser;
    form.elements["PromptHint"].value = promptOriginal.PromptHint;
    form.elements["Title"].value = promptOriginal.Title;
    form.elements["Community"].value = promptOriginal.Community;

    // Update the "Forked from Prompt Template" link
    this.updateForkedFromPromptLink(promptOriginal.ID);

    // Check the "Share as public" checkbox if the prompt template is public
    if (
      this.isAdminMode() &&
      promptOriginal.PromptTypeNo === PromptTypeNo.PUBLIC
    ) {
      form.elements["Public"].checked = true;
    }
    // Forked prompts for non-admins are always private
    else if (!this.isAdminMode()) {
      this.hidePublicPromptFormElements(form);
    }

    // Trigger onchange event on Topics to update available Activities
    form.elements["Community"].dispatchEvent(new Event("change"));

    // Set the selected Activity (category)
    form.elements["Category"].value = promptOriginal.Category;
  },

  async clonePrompt(idx) {
    const promptOriginal = (await this.getCurrentPromptTemplates())[idx];

    await this.showSavePromptModal();

    // Pre-fill the prompt template modal with the cloned prompt template
    const form = document.getElementById("savePromptForm");

    // Do not set prompt.ID from original prompt template to create a new prompt
    form.elements["Prompt"].value = promptOriginal.Prompt;
    form.elements["Teaser"].value = promptOriginal.Teaser;
    form.elements["PromptHint"].value = promptOriginal.PromptHint;
    form.elements["Title"].value = promptOriginal.Title;
    form.elements["Community"].value = promptOriginal.Community;
    form.elements["AuthorName"].value = promptOriginal.AuthorName;
    form.elements["AuthorURL"].value = promptOriginal.AuthorURL;

    // Cloning forked prompt template results in a forked prompt too
    if (promptOriginal.ForkedFromPromptID) {
      form.elements["ForkedFromPromptID"].value =
        promptOriginal.ForkedFromPromptID;

      this.updateForkedFromPromptLink(promptOriginal.ForkedFromPromptID);

      if (!this.isAdminMode()) {
        // Forked prompts for non-admins are always private
        this.hidePublicPromptFormElements(form);
      }
    }

    // Check the "Share as public" checkbox if the prompt template is public
    if (promptOriginal.PromptTypeNo === PromptTypeNo.PUBLIC) {
      form.elements["Public"].checked = true;
    }

    // Trigger onchange event on Topics to update available Activities
    form.elements["Community"].dispatchEvent(new Event("change"));

    // Set the selected Activity (category)
    form.elements["Category"].value = promptOriginal.Category;
  },

  // Add prompt template to "Hidden" prompts list
  async addToHiddenList(idx) {
    if (!this.Client.UserQuota.canUseHidden(this.Lists)) {
      return;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const hiddenList = this.Lists.getHidden();

    try {
      hiddenList
        ? // if hidden list already exists, add prompt to it
          await hiddenList.add(prompt)
        : // if hidden list does not exist, create it and add prompt to it
          await this.Lists.create(this.Client, ListTypeNo.HIDDEN, "", {
            PromptID: prompt.ID,
            Comment: "",
          });
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not hide prompt template. ${
          error instanceof Reaction ? error.message : ""
        }`
      );

      if (
        error instanceof Reaction &&
        error.ReactionNo === ReactionNo.RXN_AIPRM_QUOTA_EXCEEDED
      ) {
        hiddenList
          ? this.Client.UserQuota.listItemQuotaExceeded()
          : this.Client.UserQuota.listQuotaExceeded();
      }

      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      'Added to "Hidden" prompts list.'
    );

    await this.insertPromptTemplatesSection();
  },

  // Remove prompt template from "Hidden" prompts list
  async removeFromHiddenList(idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const list = this.Lists.getHidden();

    try {
      await list.remove(prompt);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not unhide prompt template. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      'Removed from "Hidden" prompts list.'
    );

    await this.insertPromptTemplatesSection();
  },

  // Check if prompt template is hidden
  async isHidden(idx) {
    const list = this.Lists.getHidden();

    if (!list) {
      return false;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    return await list.has(prompt);
  },

  /**
   * Add prompt template to "Favorites" prompts list
   *
   * @param {string} idx - prompt template index
   * @returns {Promise<void>}
   */
  async addToFavoritesList(idx) {
    if (!this.Client.UserQuota.canUseFavorites(this.Lists)) {
      return;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const favoritesList = this.Lists.getFavorites();

    try {
      favoritesList
        ? // if favorites list already exists, add prompt to it
          await favoritesList.add(prompt)
        : // if favorites list does not exist, create it and add prompt to it
          await this.Lists.create(this.Client, ListTypeNo.FAVORITES, "", {
            PromptID: prompt.ID,
            Comment: "",
          });
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not add to "Favorites" prompts list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );

      if (
        error instanceof Reaction &&
        error.ReactionNo === ReactionNo.RXN_AIPRM_QUOTA_EXCEEDED
      ) {
        favoritesList
          ? this.Client.UserQuota.listItemQuotaExceeded()
          : this.Client.UserQuota.listQuotaExceeded();
      }

      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      'Added to "Favorites" prompts list.'
    );

    this.insertPromptTemplatesSection();
  },

  /**
   * Remove prompt template from "Favorites" prompts list
   *
   * @param {string} idx - prompt template index
   * @returns {Promise<void>}
   */
  async removeFromFavoritesList(idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const list = this.Lists.getFavorites();

    try {
      // remove prompt from favorites list via API and update the local list
      await list.remove(prompt);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not remove from "Favorites" prompts list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      'Removed from "Favorites" prompts list.'
    );

    this.insertPromptTemplatesSection();
  },

  /**
   * Check if prompt is in "Favorites" prompts list
   *
   * @param {string} idx - prompt template index
   * @returns {Promise<boolean>}
   */
  async isFavorite(idx) {
    const list = this.Lists.getFavorites();

    if (!list) {
      return false;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    return await list.has(prompt);
  },

  /**
   * Add prompt template to custom list
   *
   * @param {string} idx
   */
  async addToList(idx) {
    if (!this.Client.UserQuota.canUseCustomList()) {
      return;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const lists = this.Lists.getCustom();

    const AIPRMVerifiedList = this.Lists.getAIPRMVerified();

    // if AIPRM verified list exists and it's owned by the user, add it to the list
    if (AIPRMVerifiedList && AIPRMVerifiedList.OwnList) {
      lists.push(AIPRMVerifiedList);
    }

    // sort lists by Comment
    lists.sort((a, b) => a.Comment.localeCompare(b.Comment));

    // show list selection modal
    this.showListSelectionModal(lists, prompt);
  },

  /**
   * Remove prompt template from custom list
   *
   * @param {List['ID']} listID
   * @param {string} idx - prompt template index
   */
  async removeFromList(listID, idx) {
    const prompt = (await this.getCurrentPromptTemplates())[idx];

    const list = this.Lists.withID(listID);

    try {
      // remove prompt from list via API and update local list
      await list.remove(prompt);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not remove from list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      `Removed from "${sanitizeInput(list.Comment)}" prompts list.`
    );

    this.insertPromptTemplatesSection();
  },

  /**
   * Show list selection modal to select list to add prompt to or to create a new list
   *
   * @param {List[]} lists
   * @param {Prompt} prompt
   */
  showListSelectionModal(lists, prompt) {
    let listSelectionModal = document.getElementById("listSelectionModal");

    // if modal does not exist, create it, add event listener on submit and append it to body
    if (!listSelectionModal) {
      listSelectionModal = document.createElement("div");
      listSelectionModal.id = "listSelectionModal";

      listSelectionModal.addEventListener(
        "submit",
        this.handleListSelectionModalSubmit.bind(this)
      );

      document.body.appendChild(listSelectionModal);
    }

    listSelectionModal.innerHTML = /*html*/ `
      <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__text-center AIPRM__transition-opacity AIPRM__z-50">
        <div class="AIPRM__absolute AIPRM__bg-gray-900 AIPRM__inset-0 AIPRM__opacity-90">
        </div>

        <div class="AIPRM__fixed AIPRM__inset-0 AIPRM__overflow-y-auto">
          <div class="AIPRM__flex AIPRM__items-center AIPRM__justify-center AIPRM__min-h-full">
            <form>
              <div
                class="AIPRM__align-center AIPRM__bg-white dark:AIPRM__bg-gray-800 dark:AIPRM__text-gray-200 AIPRM__inline-block AIPRM__overflow-hidden sm:AIPRM__rounded-lg AIPRM__shadow-xl sm:AIPRM__align-middle sm:AIPRM__max-w-lg sm:AIPRM__my-8 sm:AIPRM__w-full AIPRM__text-left AIPRM__transform AIPRM__transition-all"
                role="dialog" aria-modal="true" aria-labelledby="modal-headline">

                <div class="AIPRM__bg-white dark:AIPRM__bg-gray-800 AIPRM__px-4 AIPRM__pt-5 AIPRM__pb-4 sm:AIPRM__p-6 sm:AIPRM__pb-4 AIPRM__w-96">

                  <input type="hidden" name="promptID" value="${sanitizeInput(
                    prompt.ID
                  )}">

                  <h3 class="${css`h3`} AIPRM__my-4">Choose a list</h3>

                  <label class="AIPRM__block">Lists</label>
                  <select name="listID" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full">
                    ${lists
                      .map(
                        (list) =>
                          `<option value="${sanitizeInput(
                            list.ID
                          )}">${sanitizeInput(list.Comment)}</option>`
                      )
                      .join("")}

                      <option disabled>_________</option>

                      ${
                        !lists.length
                          ? "<option value selected>-- No lists found, yet. Please create a new custom list first. --</option>"
                          : "<option value>-- Create a new list --</option>"
                      }
                  </select>
                  
                  <div id="createNewList" class="${
                    lists.length ? "AIPRM__hidden" : ""
                  }">
                    <h3 class="${css`h3`} AIPRM__my-4 AIPRM__mt-6">Create a new list</h3>
                    
                    <label class="AIPRM__block">List Name</label>
                    <input type="text" name="listName" class="AIPRM__mt-2 AIPRM__mb-3 dark:AIPRM__bg-gray-700 dark:AIPRM__border-gray-700 dark:hover:AIPRM__bg-gray-900 AIPRM__rounded AIPRM__w-full" ${
                      !lists.length ? "required" : ""
                    }>
                  </div>

                </div>

                <div class="AIPRM__bg-gray-200 dark:AIPRM__bg-gray-700 AIPRM__px-4 AIPRM__py-3 AIPRM__text-right">
                  <button type="button" class="AIPRM__bg-gray-600 hover:AIPRM__bg-gray-800 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white"
                          onclick="AIPRM.hideModal('listSelectionModal')"> Cancel
                  </button>
                  <button type="submit" class="AIPRM__bg-green-600 hover:AIPRM__bg-green-700 AIPRM__mr-2 AIPRM__px-4 AIPRM__py-2 AIPRM__rounded AIPRM__text-white">Add to list</button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    `;

    // add event listener to show/hide "Create a new list" section
    const listIDSelect = listSelectionModal.querySelector(
      'select[name="listID"]'
    );

    listIDSelect.addEventListener("change", (e) => {
      const createNewListSection =
        listSelectionModal.querySelector("#createNewList");

      if (e.target.value === "") {
        createNewListSection.classList.remove("AIPRM__hidden");
        return;
      }

      createNewListSection.classList.add("AIPRM__hidden");
    });

    listSelectionModal.style = "display: block;";

    // add event listener to close the modal on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideModal("listSelectionModal");
      }
    });
  },

  // Handle submit of list selection modal form and add prompt to list or create a new list and add prompt to it
  async handleListSelectionModalSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const listID = formData.get("listID");
    const listName = formData.get("listName")?.trim();

    // no list selected and no list name entered
    if (!listID && !listName) {
      this.showNotification(
        NotificationSeverity.ERROR,
        "Please select a list or create a new one."
      );
      return;
    }

    const promptID = formData.get("promptID");

    let list;

    try {
      // existing list - add prompt to it
      if (listID) {
        list = this.Lists.withID(listID);

        if (!this.Client.UserQuota.canAddToCustomList(list)) {
          return;
        }

        await list.add({ ID: promptID });
      }
      // new list - create it and add prompt to it
      else {
        if (!this.Client.UserQuota.canCreateCustomList(this.Lists)) {
          return;
        }

        list = await this.Lists.create(
          this.Client,
          ListTypeNo.CUSTOM,
          listName,
          {
            PromptID: promptID,
            Comment: "",
          }
        );
      }
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not add to list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );

      if (
        error instanceof Reaction &&
        error.ReactionNo === ReactionNo.RXN_AIPRM_QUOTA_EXCEEDED
      ) {
        listID
          ? this.Client.UserQuota.listItemQuotaExceeded()
          : this.Client.UserQuota.listQuotaExceeded();
      }

      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      `Added to "${sanitizeInput(list.Comment)}" prompts list.`
    );

    this.hideModal("listSelectionModal");

    // re-insert the prompt templates section if it's a new list
    if (!listID) {
      this.insertPromptTemplatesSection();
    }
  },

  /**
   * Edit a custom list's name, then re-insert the prompt templates section
   *
   * @param {List['ID]} listID
   */
  async editCustomList(listID) {
    const list = this.Lists.withID(listID);

    // Ask for new name
    const listName = prompt(
      "Please enter a new name for the list:",
      sanitizeInput(list.Comment)
    );

    // Abort if no name was entered
    if (!listName) {
      return;
    }

    try {
      // Update the list using the API and update it in the local list of lists
      await list.update(listName);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not update list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      `Updated prompts list "${sanitizeInput(list.Comment)}".`
    );

    this.insertPromptTemplatesSection();
  },

  /**
   * Delete a custom list after confirmation, then re-insert the prompt templates section
   *
   * @param {List['ID]} listID
   */
  async deleteCustomList(listID) {
    const list = this.Lists.withID(listID);

    // Ask for confirmation
    if (
      !confirm(
        `Are you sure you want to delete list "${sanitizeInput(list.Comment)}"?`
      )
    ) {
      return;
    }

    try {
      // delete the list using the API and remove it from the local list of lists
      await this.Lists.delete(list);
    } catch (error) {
      this.showNotification(
        NotificationSeverity.ERROR,
        `Could not delete list. ${
          error instanceof Reaction ? error.message : ""
        }`
      );
      return;
    }

    this.showNotification(
      NotificationSeverity.SUCCESS,
      `Deleted list "${sanitizeInput(list.Comment)}".`
    );

    // reset the list of lists and the selected list type after deleting a list
    this.PromptTemplatesList = null;

    this.PromptTemplatesType = PromptTemplatesType.PUBLIC;

    this.insertPromptTemplatesSection();
  },

  // Explain how to use the "Favorites" prompts list in case of no prompts in the list
  howToUseFavoriteList() {
    this.showNotification(
      NotificationSeverity.INFO,
      'To add a prompt to your "Favorites" prompts list, click the star icon next to the prompt title.'
    );
  },

  // Explain how to use the "Hidden" prompts list in case of no prompts in the list
  howToUseHiddenList() {
    this.showNotification(
      NotificationSeverity.INFO,
      'To add prompt to your "Hidden" prompts list and hide it, click the cross icon next to the prompt title.'
    );
  },

  /**
   * Check if prompt is in the "AIPRM Verified Prompts" list
   *
   * @param {number} idx
   * @returns {Promise<boolean>}
   */
  async isVerified(idx) {
    const list = this.Lists.getAIPRMVerified();

    // no AIPRM Verified list
    if (!list) {
      return false;
    }

    // cannot use AIPRM Verified list
    if (!this.Client.UserQuota.canUseAIPRMVerifiedList(false)) {
      return false;
    }

    const prompt = (await this.getCurrentPromptTemplates())[idx];

    return await list.has(prompt);
  },
};

window.AIPRM.init();
