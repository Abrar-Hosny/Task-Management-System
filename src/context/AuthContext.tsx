import React, { createContext, useState, useContext, useEffect } from "react";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

// Cognito Pool Configuration
const poolData = {
  UserPoolId: "us-east-1_hUHDTfuHK",
  ClientId: "sadaqu6rhgu6s76m8adt7vg6c",
};

const userPool = new CognitoUserPool(poolData);

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: CognitoUser | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  getUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  getUserId: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const currentUser = userPool.getCurrentUser();

      if (currentUser) {
        currentUser.getSession(
          (err: Error | null, session?: CognitoUserSession) => {
            if (err) {
              console.error("Error getting session:", err);
              setIsAuthenticated(false);
              setUser(null);
            } else if (session && session.isValid()) {
              setIsAuthenticated(true);
              setUser(currentUser);

              // Log session details for debugging
              console.log("Session is valid");
              console.log(
                "Access Token:",
                session.getAccessToken().getJwtToken()
              );
              console.log("ID Token:", session.getIdToken().getJwtToken());
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
            setLoading(false);
          }
        );
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          setIsAuthenticated(true);
          setUser(cognitoUser);

          // Log session details for debugging
          console.log("Login successful");
          console.log("Access Token:", session.getAccessToken().getJwtToken());
          console.log("ID Token:", session.getIdToken().getJwtToken());

          resolve(session);
        },
        onFailure: (err) => {
          console.error("Login failed:", err);
          setIsAuthenticated(false);
          setUser(null);
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // Handle new password required scenario
          console.log(
            "New password required",
            userAttributes,
            requiredAttributes
          );
          reject(new Error("New password required"));
        },
      });
    });
  };

  const logout = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const getUserId = () => {
    if (!isAuthenticated) return null;
    const currentUser = userPool.getCurrentUser();
    return currentUser ? currentUser.getUsername() : null;
  };

  // If still loading, you might want to show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        getUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
