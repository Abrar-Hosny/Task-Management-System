import {
  CognitoUserPool,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";

const poolData: ICognitoUserPoolData = {
  UserPoolId: "us-east-1_hUHDTfuHK", 
  ClientId: "sadaqu6rhgu6s76m8adt7vg6c", 
};

export default new CognitoUserPool(poolData);
