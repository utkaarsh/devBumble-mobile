import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { path } from "../utils/path";
import axios from "axios";
import Field from "./Field";
import { developerInterests, SKILLS } from "../utils/constants";
import ProgressBar from "./ProgressBar";
import StrengthBar from "./StrengthBar";
import { saveToken } from "../auth/authTokenStorage";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../auth/context";
import api from "../utils/api";

// ─── Yup schemas per step ───────────────────────────────────────────────────
const step1Schema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name too short")
    .required("Full name is required"),
  username: Yup.string()
    .min(3, "At least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Letters, numbers & underscores only")
    .required("Username is required"),
});

const step2Schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Phone number is required"),
});

const step3Schema = Yup.object({
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const schemas = [step1Schema, step2Schema, step3Schema];

const STEPS = [
  { label: "Profile", icon: "person-outline" },
  { label: "Contact", icon: "mail-outline" },
  { label: "Security", icon: "shield-checkmark-outline" },
];
const TOTAL = STEPS.length;

// ─── Reusable Field ─────────────────────────────────────────────────────────
// FIX: Uses setFieldValue/setFieldTouched — NOT handleChange/handleBlur.
// Formik's handleChange expects a DOM Event with .persist(), but React Native's
// onChangeText passes a plain string value → causes "persist of undefined" crash.

// ─── Progress bar ───────────────────────────────────────────────────────────

// ─── Step components ────────────────────────────────────────────────────────
const Step1 = (props) => (
  <>
    <Field
      {...props}
      label="First Name"
      icon="person-outline"
      placeholder="John"
      fieldKey="firstName"
      value={props.values.firstName}
      error={props.errors.firstName}
      touched={props.touched.firstName}
      autoCapitalize="words"
    />
    <Field
      {...props}
      label="Last Name"
      icon="person-outline"
      placeholder="Doe"
      fieldKey="lastName"
      value={props.values.lastName}
      error={props.errors.lastName}
      touched={props.touched.lastName}
      autoCapitalize="words"
    />
  </>
);

const Step2 = (props) => (
  <>
    <Field
      {...props}
      label="Email"
      icon="mail-outline"
      placeholder="you@example.com"
      fieldKey="emailId"
      value={props.values.emailId}
      error={props.errors.emailId}
      touched={props.touched.emailId}
      keyboardType="email-address"
    />

    {/* <Field
      {...props}
      label="Gender"
      fieldKey="gender"
      value={props.values.gender}
      error={props.errors.gender}
      touched={props.touched.gender}
      placeholder="Male/Female/Other"
      icon="transgender-outline"
      keyboardType="default"
    /> */}

    <Field
      {...props}
      label="Gender"
      icon="transgender-outline"
      fieldKey="gender"
      value={props.values.gender}
      type="dropdown"
      options={["Male", "Female", "Other"]}
      placeholder="Select your gender"
    />

    <Field
      {...props}
      label="Age"
      icon="call-outline"
      placeholder="24"
      fieldKey="age"
      value={props.values.age}
      error={props.errors.age}
      touched={props.touched.age}
      keyboardType="phone-pad"
    />
  </>
);

const Step3 = (props) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
      <Field
        {...props}
        label="Skills"
        icon="construct-outline"
        fieldKey="skills"
        value={props.values.skills}
        type="dropdown"
        options={SKILLS}
        placeholder="Select your skills"
        isMultiSelect
      />
      <Field
        {...props}
        label="Interests"
        icon="heart-outline"
        fieldKey="interests"
        value={props.values.interests}
        type="dropdown"
        options={developerInterests}
        placeholder="Select your interests"
        isMultiSelect
      />

      <Field
        {...props}
        label="Experience"
        fieldKey="experience"
        value={props.values.experience}
        error={props.errors.experience}
        touched={props.touched.experience}
        placeholder="e.g. 2 years at XYZ"
        icon="briefcase-outline"
        keyboardType="default"
      />
      <Field
        {...props}
        label="Password"
        icon="lock-closed-outline"
        placeholder="Min 8 characters"
        fieldKey="password"
        value={props.values.password}
        error={props.errors.password}
        touched={props.touched.password}
        secure={!showPwd}
        rightIcon={showPwd ? "eye-outline" : "eye-off-outline"}
        onRightIconPress={() => setShowPwd((p) => !p)}
      />
      <StrengthBar password={props.values.password} />
      <Field
        {...props}
        label="Confirm Password"
        icon="lock-closed-outline"
        placeholder="Repeat password"
        fieldKey="confirmPassword"
        value={props.values.confirmPassword}
        error={props.errors.confirmPassword}
        touched={props.touched.confirmPassword}
        secure={!showConfirm}
        rightIcon={showConfirm ? "eye-outline" : "eye-off-outline"}
        onRightIconPress={() => setShowConfirm((p) => !p)}
      />
    </>
  );
};

// ─── Success screen ─────────────────────────────────────────────────────────
const SuccessScreen = ({ onNavigateToLogin }) => (
  <View className="flex-1 items-center justify-center px-6 bg-black">
    <View className="w-full bg-[#1D232A] rounded-2xl p-7 border border-[#252C35] items-center">
      <View className="w-16 h-16 rounded-full bg-[#0D2E1F] items-center justify-center mb-4 border-2 border-[#3DD68C]">
        <Ionicons name="checkmark-circle" size={40} color="#3DD68C" />
      </View>
      <Text className="text-[#EFF2F5] text-2xl font-bold mb-2">You're in!</Text>
      <Text className="text-[#5A6677] text-sm text-center mb-6">
        Your account has been created successfully.
      </Text>
      <TouchableOpacity
        className="w-full bg-[#4A9EFF] rounded-xl py-4 items-center"
        onPress={onNavigateToLogin}
        activeOpacity={0.85}
      >
        <Text className="text-white text-base font-bold">Sign In Now</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const SignupForm = ({ onNavigateToLogin }) => {
  const [step, setStep] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();
  const handleNavigation = () => {
    navigation.navigate("login");
  };
  const authContext = useContext(AuthContext);

  const stepFields = [
    ["firstName", "lastName"],
    ["emailId", "gender", "age"],
    [
      "skills",
      "interests",
      "experience",
      "about",
      "password",
      "confirmPassword",
    ],
  ];

  const stepTitles = [
    { title: "Create account", subtitle: "Tell us who you are" },
    { title: "Your contact", subtitle: "How we'll reach you" },
    { title: "Secure it", subtitle: "Protect your account" },
  ];

  const handleNext = async (values, formik) => {
    // Touch only the current step's fields so future steps stay pristine
    const touchMap = {};
    stepFields[step].forEach((f) => (touchMap[f] = true));
    await formik.setTouched({ ...formik.touched, ...touchMap }, true);

    const allErrors = await formik.validateForm(values);
    const hasStepError = stepFields[step].some((f) => allErrors[f]);
    if (hasStepError) return;

    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      return;
    }

    // Final submit
    try {
      formik.setSubmitting(true);
      setSubmitError("");
      const res = await axios.post(`${path}/signup`, {
        firstName: values.firstName,
        lastName: values.lastName,
        emailId: values.emailId,
        password: values.password,
        gender: values.gender,
        age: Number(values.age),
        skills: values.skills, // "react,node" → ["react","node"]
        interests: values.interests,
        experience: values.experience,
        about: values.about,
      });
      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error("Login response did not include token");
      await saveToken(token);
      // Prefer profile endpoint so we have the full user object (photoUrl, name, etc.)
      let userData = null;
      try {
        const profile = await api.get("/profile/view");
        userData = profile.data;
      } catch (profileErr) {
        // Fallback to API login data if profile call is unavailable.
        userData = res.data.user || res.data;
      }

      authContext.setUser(userData);
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Signup failed",
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  if (success) return <SuccessScreen onNavigateToLogin={handleNavigation} />;

  const StepComponents = [Step1, Step2, Step3];
  const CurrentStep = StepComponents[step];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            emailId: "",
            password: "StrongP@ssw0rd123",
            confirmPassword: "StrongP@ssw0rd123",
            gender: "Male",
            age: "24",
            skills: ["React", "Node.js"],
            interests: ["Web Dev", "AI"],
            experience: "3.5 years at Google",
            about:
              "Cool developer looking to connect and collaborate on exciting projects!",
          }}
          validationSchema={schemas[step]}
          validateOnChange
          validateOnBlur
        >
          {(formik) => (
            <View className="w-full bg-[#1D232A] rounded-2xl p-7 border border-[#252C35]">
              {/* Header */}
              <View className="mb-6">
                <Text className="text-[#EFF2F5] text-2xl font-bold mb-1">
                  {stepTitles[step].title}
                </Text>
                <Text className="text-[#5A6677] text-sm">
                  {stepTitles[step].subtitle}
                </Text>
              </View>

              <ProgressBar step={step} TOTAL={TOTAL} STEPS={STEPS} />

              <CurrentStep
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />

              {submitError ? (
                <View className="flex-row items-center bg-[#3D0015] rounded-lg px-3 py-2 mb-4 border border-[#FF5E7D33] gap-2">
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#FF5E7D"
                  />
                  <Text className="text-[#FF5E7D] text-sm flex-1">
                    {submitError}
                  </Text>
                </View>
              ) : null}

              {/* Navigation buttons */}
              <View className="flex-row gap-3 mt-1">
                {step > 0 && (
                  <TouchableOpacity
                    className="flex-1 border-2 border-[#2F3740] rounded-xl py-4 items-center justify-center"
                    onPress={() => setStep((s) => s - 1)}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name="arrow-back-outline"
                        size={16}
                        color="#8695A4"
                      />
                      <Text className="text-[#8695A4] text-base font-semibold">
                        Back
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className={`flex-1 rounded-xl py-4 flex-row items-center justify-center bg-[#4A9EFF] ${
                    formik.isSubmitting ? "opacity-60" : "opacity-100"
                  }`}
                  onPress={() => handleNext(formik.values, formik)}
                  disabled={formik.isSubmitting}
                  activeOpacity={0.85}
                >
                  {formik.isSubmitting && (
                    <ActivityIndicator
                      color="#fff"
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text className="text-white text-base font-bold tracking-wide">
                    {formik.isSubmitting
                      ? "Creating..."
                      : step === TOTAL - 1
                        ? "Create Account"
                        : "Continue"}
                  </Text>
                  {!formik.isSubmitting && step < TOTAL - 1 && (
                    <Ionicons
                      name="arrow-forward-outline"
                      size={16}
                      color="#fff"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="flex-row items-center my-6 gap-3">
                <View className="flex-1 h-px bg-[#252C35]" />
                <Text className="text-[#3D4855] text-sm">or</Text>
                <View className="flex-1 h-px bg-[#252C35]" />
              </View>

              <Pressable
                className="flex-row justify-center items-center"
                onPress={() => handleNavigation()}
              >
                <Text className="text-[#5A6677] text-sm">
                  Already have an account?{" "}
                </Text>
                <Text className="text-[#4A9EFF] text-sm font-semibold">
                  Sign In
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupForm;
