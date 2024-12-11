import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

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
import AWS from "aws-sdk";

// Configure AWS credentials using environment variables
AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey:  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

// Load SNS service from AWS SDK
const sns = new AWS.SNS();
console.log(import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ,  import.meta.env.VITE_AWS_ACCESS_KEY_ID , import.meta.env.VITE_SNS_TOPIC_ARN )
export default function Login() {
  const navigate = useNavigate(); // For navigation after login
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

  const getClientIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return "Unknown";
    }
  };

  const sendDetailedSNSNotification = async (username, loginTimestamp) => {
    const ipAddress = await getClientIpAddress();

    const notificationMessage = JSON.stringify({
      username: username,
      loginTimestamp: loginTimestamp,
      loginSource: "Web Application",
      ipAddress: ipAddress,
      deviceInfo: navigator.userAgent,
    });

    const params = {
      Message: notificationMessage,
      TopicArn: import.meta.env.VITE_SNS_TOPIC_ARN ,
      MessageAttributes: {
        EventType: {
          DataType: "String",
          StringValue: "UserLogin",
        },
      },
    };

    try {
      await sns.publish(params).promise();
      console.log("Detailed login notification sent successfully.");
    } catch (error) {
      console.error("Error sending detailed login notification:", error);
    }
  };

  // Subscribe email to SNS topic
  const subscribeEmailToSNS = async (email) => {
    const params = {
      Protocol: "EMAIL",
      TopicArn:import.meta.env.VITE_SNS_TOPIC_ARN, // Your SNS topic ARN
      Endpoint: email, // Email to subscribe
    };

    try {
      const data = await sns.subscribe(params).promise();
      console.log("Email subscription successful:", data);
    } catch (error) {
      console.error("Error subscribing email to SNS:", error);
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
        setLoginStatus("Login successful! Please check your email");
        setStatusColor("text-green-500");

        const username = data.getIdToken().payload.email || email;
        const loginTimestamp = new Date().toISOString();

        try {
          // Send detailed SNS notification about the login event
          await sendDetailedSNSNotification(username, loginTimestamp);

          // Subscribe email to SNS topic
          await subscribeEmailToSNS(email); // Subscribe the email on login

          // Update status to inform the user about the subscription process
          setLoginStatus(
            "Login successful! Please check your email to confirm your subscription."
          );
          setStatusColor("text-blue-500");

          // Optional: Navigate to a dashboard or home page after successful login
          navigate("/home/pending");
        } catch (error) {
          console.warn(
            "Detailed SNS notification failed, but login is successful."
          );
          // Update status to inform the user about potential issues with SNS
          setLoginStatus(
            "Login successful, but failed to send notification. Please check email subscription."
          );
          setStatusColor("text-yellow-500");
        }
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
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
                <p className="text-sm text-red-500">{errors.email}</p>
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
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
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
