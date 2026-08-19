import { postChatMessage } from "../api/chat.api.js";

const unwrapResponse = (response) => {
  const payload = response?.data ?? response;

  if (payload?.success === false) {
    throw new Error(payload.message || "Chat request failed");
  }

  return payload?.data ?? payload;
};

export const sendChatMessage = async ({ history, message, comparisonResult }) => {
  const response = await postChatMessage({ history, message, comparisonResult });
  const data = unwrapResponse(response);
  return data.reply;
};