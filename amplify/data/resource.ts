import { defineData } from "@aws-amplify/backend";

const schema = `# This "input" configures a global authorization rule to enable public access to
# all models in this schema. Learn more about authorization rules here: https://docs.amplify.aws/cli/graphql/authorization-rules
input AMPLIFY { globalAuthRule: AuthRule = { allow: public } } # FOR TESTING ONLY!

type Blog @model {
  id: ID!
  name: String!
  posts: [Post] @hasMany
}

type Post @model {
  id: ID!
  title: String!
  blog: Blog @belongsTo
  comments: [Comment] @hasMany
}

type Comment @model {
  id: ID!
  post: Post @belongsTo
  content: String!
}
`;

export const data = defineData({
    migratedAmplifyGen1DynamoDbTableMappings: [{
            //The "branchname" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
            branchName: "gen2-main",
            modelNameToTableNameMapping: { Blog: "Blog-3er6lcblxnczva2kmw34iwbw4q-dev", Post: "Post-3er6lcblxnczva2kmw34iwbw4q-dev", Comment: "Comment-3er6lcblxnczva2kmw34iwbw4q-dev" }
        }],
    authorizationModes: {
        defaultAuthorizationMode: "iam",
        apiKeyAuthorizationMode: { expiresInDays: 7 }
    },
    schema
});
