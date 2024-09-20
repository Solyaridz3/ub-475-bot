import { axiosInstance } from "./axios.js";
import { generatePairResponse } from "./pair.js";
function sendMessage(messageObj, messageText) {
  return axiosInstance.get("sendMessage", {
    chat_id: messageObj.chat.id,
    text: messageText,
  });
}

function deleteMessage(messageObj) {
  return axiosInstance.get("deleteMessage", {
    chat_id: messageObj.chat.id,
    message_id: messageObj.message_id,
  });
}

function handleMessage(messageObj) {
  const messageText = messageObj.text || "";
  if (messageText.charAt(0) === "/") {
    const command = messageText.substr(1);
    if (command.startsWith("para2")) {
      return sendMessage(messageObj, generatePairResponse(2));
    } else if (command.startsWith("para")) {
      return sendMessage(messageObj, generatePairResponse(1));
    } else {
      return sendMessage(messageObj, "Введена невідома команда");
    }
  }
  return "Do not need to respond";
}

export { handleMessage, deleteMessage };
