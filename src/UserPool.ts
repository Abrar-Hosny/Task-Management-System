import {
  CognitoUserPool,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";

const poolData: ICognitoUserPoolData = {
  UserPoolId: "us-east-1_hUHDTfuHK", // Replace with your actual User Pool ID
  ClientId: "sadaqu6rhgu6s76m8adt7vg6c", // Replace with your actual Client ID
};

export default new CognitoUserPool(poolData);
