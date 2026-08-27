import { Expo, ExpoPushMessage } from "expo-server-sdk";
import * as db from "./db";

const expo = new Expo();

export async function sendPushNotification(userId: number, title: string, body: string, data?: any) {
  const tokens = await db.getPushTokensByUser(userId);
  if (tokens.length === 0) return;

  const messages: ExpoPushMessage[] = [];
  for (const pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken.token)) {
      console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken.token,
      sound: "default",
      title,
      body,
      data,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      
      // Log successful sends
      for (const ticket of ticketChunk) {
        await db.logPushNotification({
          userId,
          title,
          body,
          data,
          status: ticket.status === "ok" ? "sent" : "failed",
          error: ticket.status !== "ok" ? JSON.stringify(ticket) : undefined,
        });
      }
    } catch (error) {
      console.error("Error sending push notification chunk:", error);
      await db.logPushNotification({
        userId,
        title,
        body,
        data,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  
  return tickets;
}

export async function broadcastPushNotification(title: string, body: string, data?: any) {
  const tokens = await db.getAllPushTokens();
  if (tokens.length === 0) return;

  const messages: ExpoPushMessage[] = [];
  for (const pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken.token)) continue;
    messages.push({
      to: pushToken.token,
      sound: "default",
      title,
      body,
      data,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error broadcasting push notification chunk:", error);
    }
  }
}
