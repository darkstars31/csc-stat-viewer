import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "https://core.csconfederation.com/graphql",
	documents: ["src/**/*.tsx"],
	generates: {
		"./src/gql/": {
			preset: "client",
		},
	},
};
export default config;
