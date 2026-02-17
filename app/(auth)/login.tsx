import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/input";

import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { showAlert } from "@/utils/globalAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (!email || !passwordRef.current) {
      showAlert({
        title: "Login",
        message: "Please fill all the details",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, passwordRef.current);
    } catch (error: any) {
      showAlert({
        title: "Logout",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const showAlertBox = ()=>{
    showAlert({
      title:"Oops",
      message:"This feature coming soon!"
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern={true}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton iconSize={28} />

            <TouchableOpacity onPress={showAlertBox}>
              <Typo size={17} color={colors.white}>
                Forgot Your Password?
              </Typo>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  gap: spacingY._10,
                  marginBottom: spacingY._15,
                }}
              >
                <Typo size={28} fontWeight={"600"}>
                  Welcome Back
                </Typo>
                <Typo color={colors.neutral600}>We are happy to see you</Typo>
              </View>

              <Input
                placeholder="Enter Your Email"
                value={email}
                isEmail
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value: string) =>
                  setEmail(value.replace(/[A-Z]/g, "").toLowerCase())
                }
                icon={
                  <Icons.At
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />

              <Input
                placeholder="Enter Your Password"
                isPassword
                onChangeText={(value: string) => (passwordRef.current = value)}
                icon={
                  <Icons.Lock
                    size={verticalScale(26)}
                    color={colors.neutral600}
                  />
                }
              />

              <View style={{ marginTop: spacingY._20, gap: spacingY._15 }}>
                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo fontWeight={"bold"} color={colors.black} size={20}>
                    Login
                  </Typo>
                </Button>

                <View style={styles.footer}>
                  <Typo>Don't have an account ?</Typo>

                  <Pressable onPress={() => router.push("/register")}>
                    <Typo color={colors.primaryDark} fontWeight={"bold"}>
                      Sign Up
                    </Typo>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // gap: spacingY._30,
    // marginHorizontal: spacingX._20,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
