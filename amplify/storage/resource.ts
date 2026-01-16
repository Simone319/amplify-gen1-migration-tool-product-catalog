import { defineStorage } from "@aws-amplify/backend";
import { S3Triggerab6d9679 } from "./S3Triggerab6d9679/resource";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const storage = defineStorage({ name: `projectboards767a940442d14c169ca2466d147d866b584d1-${branchName}`, access: allow => ({
        "public/*": [allow.authenticated.to(["write", "read", "delete"])],
        "protected/{entity_id}/*": [allow.authenticated.to(["write", "read", "delete"])],
        "private/{entity_id}/*": [allow.authenticated.to(["write", "read", "delete"])]
    }), triggers: {
        onUpload: S3Triggerab6d9679,
        onDelete: S3Triggerab6d9679
    } });
