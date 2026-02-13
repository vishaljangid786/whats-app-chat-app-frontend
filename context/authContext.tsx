import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadtoken()
  }, [])

  const loadtoken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          // token has expired , navigate to welcome page
          await AsyncStorage.removeItem("token");
          gotoWelcomePage();
          return;
        }

        // user is logged in
        setToken(storedToken);
        setUser(decoded.user);

        gotoHomePage();
      } catch (error) {
        gotoWelcomePage();
        console.log("failed to decode token:", error);
      }
    }else{
      gotoWelcomePage()
    }
  };

  const gotoHomePage = () => {
    setTimeout(() => {
      router.replace('/(main)/home')
    }, 1000);
  };

  const gotoWelcomePage = () => {
    setTimeout(() => {
      router.replace('/(auth)/welcome')
    }, 1000);
  };

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);
      // decode token(use)

      const decoded = jwtDecode<DecodedTokenProps>(token);
      console.log("decoded token:", decoded);

      setUser(decoded.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    await updateToken(response.token);
    router.replace("/(main)/home");
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null,
  ) => {
    const response = await register(email, password, name, avatar);
    console.log(response);

    await updateToken(response.token);
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
