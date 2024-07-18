import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import Button from "./UI/Button";
import TextInput from "./UI/TextInput";
import { getInitialFormFields } from "@/utils";

export type FieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export type FormProps = {
  fields: Array<FieldProps>;
  initialValues?: any;
  buttonText?: string;
  onSubmit?: Function;
};

export const Form = ({
  fields,
  initialValues,
  buttonText = "Submit",
  onSubmit = () => {},
}: FormProps) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  return (
    <Formik
      initialValues={initialValues || getInitialFormFields(fields)}
      onSubmit={async (values) => {
        setSubmitLoading(true);
        onSubmit && (await onSubmit(values));
        setSubmitLoading(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.inputsContainer}>
          {fields?.map((item, idx) => (
            <TextInput
              key={idx}
              onChangeText={handleChange(item?.name)}
              onBlur={handleBlur(item?.name)}
              value={values?.[item?.name]}
              placeholder={item?.placeholder}
              secureTextEntry={item?.secureTextEntry}
              label={item?.label}
            />
          ))}
          <View style={{ marginTop: 15 }}>
            <Button
              onPress={handleSubmit}
              title={buttonText}
              loading={submitLoading}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    marginTop: 45,
    width: "100%",
    gap: 15,
  },
});
