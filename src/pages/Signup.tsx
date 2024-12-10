import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import UserPool from "../UserPool"; // Ensure UserPool is properly set up and exported
import { useNavigate } from "react-router-dom"; // For navigation

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState(""); // State for displaying messages
  const [messageType, setMessageType] = useState(""); // State for message type (success or error)
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "", name: "" };

    if (!email.includes("@")) {
      newErrors.email = "Invalid email address.";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!name) {
      newErrors.name = "Name is required.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("");
      setMessageType(""); // Clear message type
      return;
    }

    // Cognito User Attributes with name included
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: name }), // Added name attribute
    ];

    // Sign up with Cognito User Pool
    UserPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.error("Error during sign up:", err);
        // Extract content after the colon (if available)
        const messageContent = err.message.split(":").slice(1).join(":").trim() || "An error occurred during sign up.";
        setMessage(messageContent);
        setMessageType("error"); // Set message type as error
        return;
      }

      console.log("Sign up successful:", result);
      setMessage("Account created successfully! Please check your email to verify your account.");
      setMessageType("success"); // Set message type as success
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Enter Your Credentials to Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
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
              Sign Up
            </Button>
          </form>
        </CardContent>
        {message && (
          <p
            className={`text-center mt-2 mb-4 font-semibold text-sm ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
