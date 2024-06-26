import React from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import Button from "./UI/Button";
import TextInput from "./UI/TextInput";

type FieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
};

type FormProps = {
  fields?: Array<FieldProps>;
  initialValues?: any;
  buttonText?: string;
};

export const Form = ({
  fields,
  initialValues,
  buttonText = "Submit",
}: FormProps) => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values) => console.log(values)}
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
        <Button
          onPress={handleSubmit}
          title={buttonText}
          style={{ marginTop: 15 }}
        />
      </View>
    )}
  </Formik>
);

const styles = StyleSheet.create({
  inputsContainer: {
    marginTop: 45,
    width: "100%",
    gap: 15,
  },
});
