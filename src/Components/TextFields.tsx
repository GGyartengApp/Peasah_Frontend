import React from "react";
import { Platform, Text, TextInput, View } from "react-native";

type FormTextProps = {
  label: string;
  fontWeight?: string | number;
  paddingLeft?: number;
};

function FormText(props: FormTextProps) {
  const textStyle = {
    fontWeight: props.fontWeight || "bold",
    color: "#333",
    fontSize: Platform.OS === "ios" ? 20 : 16,
    paddingLeft: props.paddingLeft || 0,
  } as const;

  return <Text style={textStyle}>{props.label}</Text>;
}

function FormTextInput(p: { placeholder: string }) {
  return (
    <TextInput
      style={{
        borderRadius: 10,
        padding: 15,
        marginBottom: 16,
        width: "100%",
        backgroundColor: "#cccccc75",

        borderWidth: 0,
        borderBottomWidth: 0,
        elevation: 0, //
      }}
      placeholder={p.placeholder}
      placeholderTextColor="#616060"
      underlineColorAndroid="transparent"
    />
  );
}

type TextFieldsProps = {
  label: string;
};

const TextFields = ({ label }: TextFieldsProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "flex-start", gap:Platform.OS === "ios" ? 9 : 7  }}>
      <FormText label={label} fontWeight={600} paddingLeft={9} />
      <FormTextInput placeholder={`Enter your ${label.toLowerCase()}`} />
    </View>
  );
};

export default TextFields;
