import { FieldProps } from "@/components/Form";
import moment from "moment";

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
