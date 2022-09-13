// const Events = require("./Events");
const { parseRequestUrl, handleEventRequest } = require("../helper");
const EventEmitter = require("events").EventEmitter;
const { validationToken } = require("../../config/keys");

class FBApi extends EventEmitter {
  // Private Keys
  #pageID;
  #appID;
  #appSecret;
  #validationToken;
  #pageToken;
  #webhookRoute;
  #server;

  constructor({ pageID, appID, appSecret, validationToken, pageToken }) {
    super(EventEmitter);

    this.#pageID = pageID;
    this.#appID = appID;
    this.#appSecret = appSecret;
    this.#validationToken = validationToken;
    this.#pageToken = pageToken;
    this.#server;
    this.#webhookRoute;
  }

  // requests handelar
  #requestsHandelar = {
    get: async (req, res) => {
      const requestUrl = parseRequestUrl(req.url);
      const query = requestUrl.query;

      // check if route is = webhookRoute
      if (requestUrl?.path != this.#webhookRoute) return;

      if (
        query["hub.mode"] === "subscribe" &&
        query["hub.verify_token"] === validationToken
      ) {
        return res.status(200).send(query["hub.challenge"]);
      }

      res.status(403).send();
    },

    post: (req, res) => {
      const requestUrl = parseRequestUrl(req.url);

      // check if route is = webhookRoute
      if (requestUrl.path !== this.#webhookRoute) return;

      let body = [];

      req
        .on("data", (chunk) => body.push(chunk))
        .on("end", () => {
          body = Buffer.concat(body);

          if (!body) return;

          const headers = req.headers;
          const signature = headers["x-hub-signature"];

          handleEventRequest(body, signature, this);
        });

      res.end();
    },
  };

  // build rouets
  webhook(webhookRoute) {
    this.#webhookRoute = webhookRoute;

    return (req, _, next) => {
      const requestUrl = parseRequestUrl(req.url);
      if (requestUrl.path == this.#webhookRoute) return;

      next();
    };
  }

  // router handelar
  #requestHandelar = (req, res) => {
    switch (req.method) {
      case "GET":
        this.#requestsHandelar.get(req, res);
        break;
      case "POST":
        this.#requestsHandelar.post(req, res);
        break;
    }
  };

  // create Server
  createServer(http) {
    this.#server = http;

    this.#server.on("request", this.#requestHandelar);
  }

  // Actions methods
  async sendTextMessage(userId, message) {}

  async sendVoiceMessage(userId, voiceUrl) {}

  async sendImgMessage(userId, imgUrl) {}

  async replayComment(postId, commentId, comment) {}

  async getUserProfile(userId) {}

  async hideComment(userId, commentId, postId) {}
}

module.exports = FBApi;
