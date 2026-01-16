import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { S3Triggerab6d9679 } from "./storage/S3Triggerab6d9679/resource";
import { lowstockproducts } from "./function/lowstockproducts/resource";
import { defineBackend } from "@aws-amplify/backend";
import { Duration, aws_iam } from "aws-cdk-lib";


const backend = defineBackend({
    auth,
    data,
    storage,
    S3Triggerab6d9679,
    lowstockproducts
});

backend.lowstockproducts.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT', backend.data.apiKey!)
backend.lowstockproducts.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT', backend.data.graphqlUrl)
backend.lowstockproducts.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT', backend.data.apiId)

backend.lowstockproducts.resources.lambda.addToRolePolicy(new aws_iam.PolicyStatement({
    effect: aws_iam.Effect.ALLOW,
    actions: ['appsync:GraphQL'],
    resources: [`arn:aws:appsync:${backend.data.stack.region}:${backend.data.stack.account}:apis/${backend.data.apiId}/types/Query/*`]
}))

backend.S3Triggerab6d9679.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT', backend.data.apiKey!)
backend.S3Triggerab6d9679.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT', backend.data.graphqlUrl)
backend.S3Triggerab6d9679.addEnvironment('API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT', backend.data.apiId)

backend.S3Triggerab6d9679.resources.lambda.addToRolePolicy(new aws_iam.PolicyStatement({
    effect: aws_iam.Effect.ALLOW,
    actions: ['appsync:GraphQL'],
    resources: [`arn:aws:appsync:${backend.data.stack.region}:${backend.data.stack.account}:apis/${backend.data.apiId}/types/Mutation/*`]
}))

backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(new aws_iam.PolicyStatement({
    effect: aws_iam.Effect.ALLOW,
    actions: ['appsync:GraphQL'],
    resources: [`arn:aws:appsync:${backend.data.stack.region}:${backend.data.stack.account}:apis/3er6lcblxnczva2kmw34iwbw4q/*`]
}))

const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.usernameAttributes = ["email"];
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
const userPool = backend.auth.resources.userPool;
userPool.addClient("NativeAppClient", {
    refreshTokenValidity: Duration.days(30),
    disableOAuth: true,
    enableTokenRevocation: true,
    enablePropagateAdditionalUserContextData: false,
    authSessionValidity: Duration.minutes(3),
    generateSecret: false
});
const s3Bucket = backend.storage.resources.cfnResources.cfnBucket;
// Use this bucket name post refactor
s3Bucket.bucketName = 'projectboards767a940442d14c169ca2466d147d866b584d1-dev';
s3Bucket.bucketEncryption = {
    serverSideEncryptionConfiguration: [
        {
            serverSideEncryptionByDefault: {
                sseAlgorithm: "AES256"
            },
            bucketKeyEnabled: false
        }
    ]
};
const cfnGraphqlApi = backend.data.resources.cfnResources.cfnGraphqlApi;
cfnGraphqlApi.additionalAuthenticationProviders = [
    {
        authenticationType: "API_KEY"
    },
    {
        authenticationType: "AMAZON_COGNITO_USER_POOLS",
        userPoolConfig: {
            awsRegion: backend.auth.resources.userPool.stack.region,
            userPoolId: backend.auth.resources.userPool.userPoolId
        }
    }
];
const branchName = process.env.AWS_BRANCH ?? "sandbox";
backend.S3Triggerab6d9679.resources.cfnResources.cfnFunction.functionName = `S3Triggerab6d9679-${branchName}`;
backend.lowstockproducts.resources.cfnResources.cfnFunction.functionName = `lowstockproducts-${branchName}`;
