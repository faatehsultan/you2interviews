import {
  BACKEND_URL,
  ENDPOINT_CHANNEL_LIST,
  ENDPOINT_CHANNEL_REGISTER,
  ENDPOINT_NEW_TOKEN,
  ENDPOINT_USERS_LIST,
} from "@/constants/api";

export const getAuthToken = async (channelName: string, uid: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_NEW_TOKEN}?channel=${channelName}&uid=${uid}`
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getChannelsList = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}${ENDPOINT_CHANNEL_LIST}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersList = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}${ENDPOINT_USERS_LIST}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const registerChannel = async (channel: string, uid: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_CHANNEL_REGISTER}?channel=${channel}&uid=${uid}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
