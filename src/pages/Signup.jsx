import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Cognito User Attributes
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "phone_number", Value: phoneNumber }), // Adding phone number
    ];

    // Sign up with Cognito User Pool
    UserPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.error("Error during sign up:", err);
        alert(err.message || "An error occurred during sign up.");
        return;
      }

      console.log("Sign up successful:", result);
      alert("Account created successfully! Please check your email to verify your account.");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          {/* Email input */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Your password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm password input */}
          <div className="mb-5">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone number input */}
          <div className="mb-5">
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Your phone number</label>
            <input
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
