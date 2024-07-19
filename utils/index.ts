import { FieldProps } from "@/components/Form";
import moment from "moment";
import * as agoraApi from "@/agora/api";
import { AgoraDropdownItem } from "@/components/UI";

export const objectToItems = (object: any): AgoraDropdownItem[] => {
  return Object.keys(object).map((value) => {
    return {
      label: value,
      value: object[value],
    };
  });
};

export const arrayToItems = (array: any[]): AgoraDropdownItem[] => {
  return array.map((value) => {
    return {
      label: value.toString(),
      value: value,
    };
  });
};

export const enumToItems = (enumType: any): AgoraDropdownItem[] => {
  const items = Object.values(enumType);
  const keys = items.filter((v) => typeof v === "string") as string[];
  const values = items.filter((v) => typeof v === "number") as number[];
  return keys.map((value, index) => ({
    label: value,
    value: values[index],
  }));
};

export const getInitialFormFields = (fields_list: Array<FieldProps>) => {
  let fields = {};
  fields_list.forEach((field) => {
    fields = {
      ...fields,
      [field.name]: "",
    };
  });
  return fields;
};

export const formatTimer = (fromTimestamp) => {
  // Get the current time
  const now = moment();

  // Convert the provided timestamp to a moment object
  const timestampMoment = moment(fromTimestamp);

  // Calculate the duration between now and the timestamp
  const duration = moment.duration(now.diff(timestampMoment));

  // Format the duration as MM:SS
  const minutes = Math.floor(duration.asMinutes());
  const seconds = duration.seconds();

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const matchText = (
  targetText: string,
  searchSpace: any[],
  matcherProperties: string[]
) => {
  const matches: any = [];
  const lowerTargetText = targetText.toLowerCase();
  const regex = new RegExp(`\\b${lowerTargetText}\\b`, "i"); // Word boundary regex

  searchSpace.forEach((item) => {
    matcherProperties.forEach((property) => {
      let sentence = item[property] || item;

      if (typeof sentence !== "string") return;

      sentence = sentence.toLowerCase();
      if (sentence.match(regex) || sentence.includes(lowerTargetText)) {
        matches.push(item);
      }
    });
  });

  return matches;
};

export const processChannelBeforeJoining = async (
  channelTitle: string,
  uid: string
): Promise<{ channelName: string; token: string }> => {
  // step 1: register channel title on firebase and get channel name
  // step 2: ask for token for that channel name
  // step 3: join channel with channel name

  let channelName = "";
  let token = "";

  try {
    channelName = await agoraApi.registerChannel(channelTitle, uid);

    if (!channelName) {
      throw new Error("Failed to register channel");
    }

    const tokenRes = await agoraApi.getAuthToken(channelName);

    if (!tokenRes?.token) {
      throw new Error("Failed to get token");
    }

    token = tokenRes?.token;
  } catch (error) {
    console.log("processChannelBeforeJoining error", error);
  }

  return { channelName, token };
};
