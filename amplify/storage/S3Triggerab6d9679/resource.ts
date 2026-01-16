import { defineFunction } from "@aws-amplify/backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const S3Triggerab6d9679 = defineFunction({
    entry: "./index.js",
    name: `S3Triggerab6d9679-${branchName}`,
    timeoutSeconds: 25,
    memoryMB: 128,
    environment: { ENV: `${branchName}`, REGION: "us-west-2" },
    runtime: 22
});
