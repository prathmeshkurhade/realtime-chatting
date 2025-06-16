import Victory from "@/assets/victory.svg";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { useNavigate, Navigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setLoading(true);
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else navigate("/profile");
        } else {
          setUserInfo(undefined);
        }
        console.log({ response });
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log(response);
    }
  };

  const isAuthenticated = !!userInfo;

  return isAuthenticated ? (
    <Navigate to="/chat" />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <img src={Victory} alt="Victory Emoji" className="h-12 ml-2" />
          </div>
          <p className="text-sm text-gray-500">Please sign in to continue</p>
        </div>
        <Tabs className="w-full" defaultValue="login">
          <TabsList className="flex justify-center w-full mb-6 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="login"
              className="flex-1 py-2 text-base rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 py-2 text-base rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-4" value="login">
            <input
              placeholder="Email"
              type="email"
              className="rounded-lg p-3 border focus:outline-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              className="rounded-lg p-3 border focus:outline-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="mt-2 bg-purple-500 text-white rounded-lg py-2 font-semibold hover:bg-purple-600 transition-all"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </TabsContent>
          <TabsContent className="flex flex-col gap-4" value="register">
            <input
              placeholder="Email"
              type="email"
              className="rounded-lg p-3 border focus:outline-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              className="rounded-lg p-3 border focus:outline-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Confirm Password"
              type="password"
              className="rounded-lg p-3 border focus:outline-purple-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="mt-2 bg-purple-500 text-white rounded-lg py-2 font-semibold hover:bg-purple-600 transition-all"
              onClick={handleRegister}
            >
              Register
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
