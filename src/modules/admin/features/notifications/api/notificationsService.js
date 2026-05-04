import { ADMIN_NOTIFICATIONS } from "./notificationsMockData";

const API_DELAY_MS = 250;

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const cloneData = (data) => JSON.parse(JSON.stringify(data));

export async function getAdminNotifications() {
  await wait(API_DELAY_MS);
  return cloneData(ADMIN_NOTIFICATIONS);
}
