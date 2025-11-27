import path from "node:path";
import { generateApi } from "swagger-typescript-api";

async function run() {
  console.log("🚀 Generating SDK from OpenAPI spec...");

  await generateApi({
    fileName: "api-sdk.ts",
    input: path.resolve(process.cwd(), "../../apps/api-app/dist/openapi.json"),
    output: path.resolve(process.cwd(), "src"),
    httpClientType: "axios",
    generateClient: true,
    generateRouteTypes: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractResponseError: true,
    unwrapResponseData: false
  });

  console.log("✅ SDK generated successfully!");
}

run().catch((error) => {
  console.error("❌ SDK generation failed:", error);
  process.exit(1);
});


