import {
  BACKEND_URL,
  ENDPOINT_CHANNEL_LIST,
  ENDPOINT_NEW_TOKEN,
} from "@/constants/api";

export const getAuthToken = async (channelName: string) => {
  const response = await fetch(
    `${BACKEND_URL}${ENDPOINT_NEW_TOKEN}?channel=${channelName}`
  );

  try {
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getChannelsList = async () => {
  const response = await fetch(`${BACKEND_URL}${ENDPOINT_CHANNEL_LIST}/`);

  try {
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
