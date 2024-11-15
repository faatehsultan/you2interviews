import {
  BACKEND_URL,
  ENDPOINT_AUTO_RECORD,
  ENDPOINT_CHANNEL_LIST,
  ENDPOINT_CHANNEL_REGISTER,
  ENDPOINT_FILE_MP3_RECORDED_CHANNEL,
  ENDPOINT_NEW_TOKEN,
  ENDPOINT_STOP_RECORD,
  ENDPOINT_USER_UPDATE,
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

export const startAutoRecording = async (channelName: string, uid: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_AUTO_RECORD}?channel=${channelName}&uid=${uid}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const stopRecording = async (
  channelName: string,
  uid: string,
  sid: string,
  resource_id: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_STOP_RECORD}?channel=${channelName}&uid=${uid}&sid=${sid}&resource_id=${resource_id}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMp3RecordedFile = async (channel: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_FILE_MP3_RECORDED_CHANNEL}?channel=${channel}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserProfile = async (
  uid: string,
  newEmail?: string,
  newName?: string,
  newPassword?: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}${ENDPOINT_USER_UPDATE}${uid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          password: newPassword,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
