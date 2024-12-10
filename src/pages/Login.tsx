import React, { useState } from "react";
import AWS from "aws-sdk";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom"; // For navigation

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";

// Load AWS Configuration
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION, // Use environment variables
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
});

const sns = new AWS.SNS();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-red-500");

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendSNSNotification = async (username) => {
    const params = {
      Message: `User ${username} logged in successfully.`,
      TopicArn: process.env.REACT_APP_SNS_TOPIC_ARN, // Use environment variable
    };

    try {
      await sns.publish(params).promise();
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: async (data) => {
        console.log("onSuccess:", data);
        setLoginStatus("Login successful!");
        setStatusColor("text-green-500");
        try {
          await sendSNSNotification(email); // Send SNS notification on successful login
        } catch (error) {
          console.warn("SNS notification failed, but login is successful.");
        }
        setTimeout(() => {
          // Replace navigation logic with window.location.href
          window.location.href = "/home/pending"; // Redirect to home/pending
        }, 1000); // Redirect after 3 seconds

      },
      onFailure: (err) => {
        console.error("onFailure:", err);
        setLoginStatus("Login failed. Please check your credentials.");
        setStatusColor("text-red-500");
      },
      newPasswordRequired: (data) => {
        console.log("newPasswordRequired:", data);
        setLoginStatus("Password update required.");
        setStatusColor("text-yellow-500");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </CardContent>
        {loginStatus && (
          <p
            className={`text-center font-semibold mt-2 mb-4 text-sm ${statusColor}`}
          >
            {loginStatus}
          </p>
        )}
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
