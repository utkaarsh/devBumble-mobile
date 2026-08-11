import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Field from "./Field";
import { Formik } from "formik";
import VirtualizedScrollView from "../supercomponents/VirtualizedScrollList";
import { row } from "../utils/utility";
import { col6 } from "../utils/constants";
import api from "../utils/api";
import { useToast } from "../supercomponents/ToastProvider";

const EditProfile = ({ user, handleEdit, setUser }) => {
  const [focusedField, setFocusedField] = useState(null);
  const toast = useToast();
  const editProfile = async (profileData) => {
    const response = await api.put("/profile/edit", profileData);

    return response.data;
  };
  const initialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    about: user?.about || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    experience: user?.experience || "",
    skills: user?.skills || [],
    interests: user?.interests || [],
  };

  const styles = StyleSheet.create({
    container: {
      //   flex: 1,
      backgroundColor: "#15191E",
      padding: 20,
    },
    text: {
      color: "#000",
    },
    boldText: {
      color: "#000",
      fontFamily: "Gilroy-Bold",
    },
    mediumText: {
      color: "#000",
      fontFamily: "Gilroy-Medium",
    },
    semiboldText: {
      color: "#000",
      fontFamily: "Gilroy-SemiBold",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 5,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const payload = {
                  ...values,
                  age: values.age ? Number(values.age) : undefined,
                };

                const response = await editProfile(payload);
                setUser(response.data);
                console.log("Profile updated:", response);

                toast.success(
                  response?.message || "Your profile was updated successfully.",
                  "Profile Updated",
                );
              } catch (error) {
                console.error(
                  "Profile update failed:",
                  error?.response?.data || error?.message,
                );

                toast.apiError(error, "Unable to update your profile.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                <View
                  className="flex-row items-center space-x-4"
                  style={{ width: row }}
                >
                  <Field
                    label="First Name"
                    icon="person-outline"
                    placeholder="First Name"
                    style={{ width: col6 }}
                    fieldKey="firstName"
                    value={values.firstName}
                    error={errors.firstName}
                    touched={touched.firstName}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />

                  <Field
                    label="Last Name"
                    icon="person-outline"
                    style={{ width: col6 }}
                    placeholder="Last Name"
                    fieldKey="lastName"
                    value={values.lastName}
                    error={errors.lastName}
                    touched={touched.lastName}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </View>
                <Field
                  label="About"
                  icon="document-text-outline"
                  placeholder="About yourself"
                  fieldKey="about"
                  value={values.about}
                  error={errors.about}
                  touched={touched.about}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
                <View
                  className="flex-row items-center space-x-4"
                  style={{ width: row }}
                >
                  <Field
                    label="Experience"
                    icon="briefcase-outline"
                    style={{ width: col6 }}
                    placeholder="Experience"
                    fieldKey="experience"
                    value={values.experience}
                    error={errors.experience}
                    touched={touched.experience}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <Field
                    label="Age"
                    style={{ width: col6 }}
                    icon="calendar-outline"
                    placeholder="Age"
                    fieldKey="age"
                    keyboardType="numeric"
                    value={values.age}
                    error={errors.age}
                    touched={touched.age}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </View>

                <Field
                  type="dropdown"
                  isMultiSelect
                  label="Skills"
                  icon="code-slash-outline"
                  placeholder="Select Skills"
                  fieldKey="skills"
                  value={values.skills}
                  options={[
                    "React",
                    "React Native",
                    "Node.js",
                    "MongoDB",
                    "Express",
                    "JavaScript",
                    "TypeScript",
                    "AWS",
                    "Docker",
                    "Redis",
                  ]}
                  error={errors.skills}
                  touched={touched.skills}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />

                <Field
                  type="dropdown"
                  isMultiSelect
                  label="Interests"
                  icon="heart-outline"
                  placeholder="Select Interests"
                  fieldKey="interests"
                  value={values.interests}
                  options={[
                    "AI",
                    "Web Dev",
                    "Gaming",
                    "Startups",
                    "Fitness",
                    "Music",
                    "Travel",
                    "Photography",
                  ]}
                  error={errors.interests}
                  touched={touched.interests}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />

                <View className="flex-row items-center  gap-2 p-2">
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    className="w-48 self-start h-12 bg-blue-950 border border-gray-700 flex-row justify-center mx-2 rounded-lg items-center "
                  >
                    <Text className="text-center text-white text-lg">
                      {isSubmitting ? "Updating..." : "Update"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEdit()}
                    className="w-48 self-start h-12 bg-red-700 border border-gray-700 flex-row justify-center mx-2 rounded-lg items-center "
                  >
                    <Text className="text-center text-white text-lg">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
