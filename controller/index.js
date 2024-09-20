import { handleMessage, deleteMessage } from "./lib/Telegram.js";

// Asynchronous delay function using setTimeout to avoid blocking execution
function delayDelete(messageObj, ms, commandMessageObj = null) {
  setTimeout(async () => {
    try {
      await deleteMessage(messageObj);
      console.log(`Message ${messageObj} deleted successfully.`);
    } catch (err) {
      console.error(`Failed to delete message ${messageObj}:`, err.message);
    }
    if (commandMessageObj) {
      try {
        await deleteMessage(commandMessageObj);
      } catch (err) {
        console.log("Failed to delete command message", err.message);
      }
    }
  }, ms);
}

// Main handler function for processing incoming requests
async function handler(req, method) {
  try {
    const { body } = req;
    if (body && body.message) {
      // Handle the incoming message
      const response = await handleMessage(body.message);
      // Check if the response is valid and contains the message ID
      if (response && response.data && response.data.ok) {
        const messageObj = response.data.result;
        console.log("Message handled successfully:");

        // Schedule the deletion of the message after 6 seconds without blocking the handler
        delayDelete(messageObj, 60000, body.message);
      } else if (response && response === "Do not need to respond") {
        console.log(response);
      } else {
        console.error("Failed to handle message:", response.data);
      }
    }
  } catch (err) {
    // Error handling
    console.error("Error in handler:", err.message);
  }
}

export { handler };
