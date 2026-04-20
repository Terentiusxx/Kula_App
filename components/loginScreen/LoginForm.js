import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Validator from "email-validator";
import { Ionicons } from "@expo/vector-icons";

import Button from "../Button";
import InputField from "../InputField";
import { AuthContext } from "../../store/auth-context";

const LoginForm = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const LoginFormSchema = yup.object().shape({
    email: yup.string().email().required("Email address is required."),
    password: yup.string().min(8, "Password must have at least 8 characters."),
  });

  async function onLogin(email, password) {
    try {
      // Mock: authenticate accepts any credentials
      // TODO (backend): replace with real API call → authCtx.authenticate(token, userData)
      authCtx.authenticate(email, password);
    } catch (error) {
      Alert.alert("Login Failed", error?.message ?? "Something went wrong.");
    }
  }

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          onLogin(values.email, values.password);
        }}
        validationSchema={LoginFormSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          errors,
          touched,
        }) => (
          <>
            {/* Email field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <InputField
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="you@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                inValid={
                  values.email.length < 1 || Validator.validate(values.email)
                }
                lightTheme
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={12} /> {errors.email}
                </Text>
              )}
            </View>

            {/* Password field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <InputField
                textContentType="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                placeholder="Min. 8 characters"
                keyboardType="default"
                inValid={
                  values.password.length === 0 || values.password.length > 7
                }
                lightTheme
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={12} /> {errors.password}
                </Text>
              )}
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <View style={styles.buttonWrapper}>
              <Button
                title="Sign in"
                onPress={handleSubmit}
                disabled={!isValid}
                containerStyle={styles.loginButton}
                titleStyle={styles.loginButtonText}
              />
            </View>

            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupPrompt}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignupScreen")}
              >
                <Text style={styles.signupLink}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  wrapper: {},
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A6A",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 12,
    color: "#E05252",
    marginTop: 5,
    marginLeft: 4,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: "#7A40F8",
    fontWeight: "600",
  },
  buttonWrapper: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#7A40F8",
    borderRadius: 16,
    shadowColor: "#7A40F8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    padding: 18,
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 4,
  },
  signupPrompt: {
    color: "#7A7A9D",
    fontSize: 14,
  },
  signupLink: {
    color: "#7A40F8",
    fontWeight: "700",
    fontSize: 14,
  },
});

