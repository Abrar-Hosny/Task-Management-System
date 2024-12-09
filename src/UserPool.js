import {CognitoUserPool} from "amazon-cognito-identity-js"

const poolDate ={
    UserPoolId : "us-east-1_JynIZMgdm" , 
    ClientId : "1mroh6jn9t6n7i2q9sittj4n7b"
}

export default new CognitoUserPool(poolDate)