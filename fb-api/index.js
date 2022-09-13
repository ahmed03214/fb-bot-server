const { cheackData } = require("./helper");
const FBApiClass = require("./class");
const Events = require("./helper/Events");

const create = ({
  pageID,
  appID,
  appSecret,
  validationToken,
  pageToken,
  server,
}) => {
  const data = { pageID, appID, appSecret, validationToken, pageToken };

  // check errors
  const err = cheackData(data);
  if (err) return err;

  // create bot
  const fbApi = new FBApiClass(data);

  // build server
  if (server) fbApi.createServer(server);

  return fbApi;
};

const FbApi = {
  create,
  Events,
};

module.exports = FbApi;
