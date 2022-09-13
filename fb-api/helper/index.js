var url = require("url");
const Events = require("./Events");

const cheackData = (data) => {
  if (!data?.pageID) throw new Error("pageID is required");
  if (!data?.appID) throw new Error("pageID is appID");
  if (!data?.appSecret) throw new Error("pageID is appSecret");
  if (!data?.validationToken) throw new Error("pageID is validationToken");
  if (!data?.pageToken) throw new Error("pageID is pageToken");

  return false;
};

const parseRequestUrl = (requestUrl) => {
  requestUrl = url.parse(requestUrl, true);
  const query = requestUrl.query;
  const path = requestUrl.pathname;

  return { path, query };
};

const handleEventRequest = (body, signature, thisClass) => {
  try {
    if (!signature) throw new Error("Request does not contain signature");
    if (typeof body === "string")
      throw new Error("Request body must not be String");

    body = JSON.parse(body.toString());

    body.entry.forEach((entry) => {
      // check if message
      if (entry.hasOwnProperty("messaging")) {
        const data = entry.messaging[0];

        const senderId = data.sender.id;
        const message = data.message;

        return thisClass.emit(Events.MESSAGE, senderId, message);
      }

      //chack if comment

      if (entry.hasOwnProperty("changes")) {
        entry.changes.forEach((changes) => {
          console.log(changes);

          if (
            changes.field == "feed" &&
            changes.value.item == "comment" &&
            changes.value.verb == "add"
          ) {
            console.log(changes);
          }
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  cheackData,
  parseRequestUrl,
  handleEventRequest,
};
