require("dotenv").config();
const app = require("express")();
const server = require("http").Server(app);
const FBApiModule = require("./fb-api");
const Keys = require("./config/keys");

const { pageID, appID, appSecret, validationToken, pageToken } = Keys;
const port = process.env.PORT || 3000;

// build bot
const FbBot = FBApiModule.create({
  pageID,
  appID,
  appSecret,
  validationToken,
  pageToken,
  server,
});

// build webhook rouets
app.use(FbBot.webhook("/webhook"));

// MESSAGE lisint
FbBot.on(FBApiModule.Events.MESSAGE, (senderId, message) => {
  const { text: userMessage } = message;

  console.log(senderId, userMessage);
});

// COMMENT lisint
FbBot.on(FBApiModule.Events.COMMENT, (senderId, message) => {
  const { text: userMessage } = message;

  console.log(senderId, userMessage);
});

// start server
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
