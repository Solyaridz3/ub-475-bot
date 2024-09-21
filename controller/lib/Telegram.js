import { axiosInstance } from "./axios.js";
import { generatePairResponse } from "./pair.js";
function sendMessage(messageObj, messageText) {
  return axiosInstance.get("sendMessage", {
    chat_id: messageObj.chat.id,
    text: messageText,
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

function deleteMessage(messageObj) {
  return axiosInstance.get("deleteMessage", {
    chat_id: messageObj.chat.id,
    message_id: messageObj.message_id,
  });
}

// Asynchronous delay function using setTimeout to avoid blocking execution
async function delayDelete(messageObj, ms, commandMessageObj = null) {
  try {
    await new Promise((resolve) => setTimeout(resolve, ms));
    await deleteMessage(messageObj);
    console.log(`Message ${messageObj} deleted successfully.`);

    if (commandMessageObj) {
      await deleteMessage(commandMessageObj);
      console.log("Command message deleted successfully.");
    }
  } catch (err) {
    console.error(`Failed to delete message(s): ${err.message}`);
  }
}

export { handleMessage, deleteMessage, delayDelete };
