import API from "../../../../../api/client";

export const postChatMessage = async ({ history, message, comparisonResult }) => {
  return await API.post("/chat/message", { history, message, comparisonResult }, { timeout: 30000 });
};