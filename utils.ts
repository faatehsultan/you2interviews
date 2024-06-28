import { FieldProps } from "@/components/Form";

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
