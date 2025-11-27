# API SDK Demo

A comprehensive guide and demonstration of building type-safe APIs with TypeScript, NestJS, and auto-generated SDKs.

## 📚 Table of Contents

- [Why You Should Create an SDK for Your API](#why-you-should-create-an-sdk-for-your-api)
- [What is an SDK?](#what-is-an-sdk)
- [Why SDKs Are Essential](#why-sdks-are-essential)
- [Building Your SDK Step-by-Step](#building-your-sdk-step-by-step)
- [Usage Examples](#usage-examples)
- [Benefits](#benefits)

## Why You Should Create an SDK for Your API

In modern JavaScript ecosystems, having a well-designed API is no longer enough. You also need a convenient and type-safe way to consume that API across your frontends, microservices, and integrations.

That's exactly why **SDKs (Software Development Kits)** matter.

This project demonstrates how to build, generate, and publish an SDK that transforms your API from a simple endpoint collection into a fully typed, developer-friendly toolkit.

## What is an SDK?

An SDK is a collection of pre-built, typed functions that abstracts away HTTP complexity.

**Without SDK:**
```typescript
const response = await fetch(`/api/users/${id}`);
const user = await response.json();
// What type is user? 🤷‍♂️
```

**With SDK:**
```typescript
const user = await api.users.findOne({ id });
// user is fully typed! ✨
```

All DTOs, request shapes, responses, and errors are typed - and always synchronized with your backend.

## Why SDKs Are Essential

### How SDKs Transform Frontend Development

Modern frontend applications demand type safety and developer experience. Here's what an SDK provides:

#### Benefits of SDKs in Modern Frontends:

✅ **Full Type Safety** - Catch errors instantly when backend DTOs change  
✅ **Zero Boilerplate** - No repeated fetch/axios wrappers or retry logic  
✅ **Instant Onboarding** - Autocomplete shows all API calls immediately  
✅ **Single Source of Truth** - Generated from OpenAPI; types never drift

### Why SDKs Matter in Microservice Communication

In microservices, services need consistent APIs to communicate. Without a central source, types get duplicated, schemas mismatch, and bugs appear. SDKs provide a single, strongly-typed interface, making integrations reliable and maintainable.

#### Key Benefits for Microservices:

✅ **No Duplicated DTOs** - Maintain a single source of types across services  
✅ **Stable Contracts** - Breaking changes are caught immediately  
✅ **Safer Integrations** - Reduce runtime bugs from mismatched schemas  
✅ **Version Control via NPM** - Use semantic versioning for controlled updates

## Building Your SDK Step-by-Step

### Step 1: Generate Swagger File in Your NestJS API

Create a script to generate the OpenAPI specification:

```typescript
// apps/api-app/scripts/generate-openapi.ts
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

async function generateOpenApiDocument() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('API Demo')
    .setDescription('Simple API with Users and Posts')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./dist/openapi.json', JSON.stringify(document, null, 2));

  console.log(`✅ OpenAPI specification successfully generated.`);

  await app.close();
  return true;
}

generateOpenApiDocument().catch((e) => {
  console.error('❌ Failed to generate OpenAPI specification:', e);
  return false;
});
```

### Step 2: Prepare SDK Package

Create a separate package for your SDK:

```
/sdk
  /scripts
    generate-sdk.ts    # Generation script
  /src
    api-sdk.ts         # Generated file
    index.ts           # Export barrel
  package.json
  tsconfig.json
```

**package.json:**
```json
{
  "name": "@demo/api-sdk",
  "version": "1.0.0",
  "description": "Generated TypeScript SDK for the demo API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "generate": "ts-node scripts/generate-sdk.ts",
    "build": "tsc -p tsconfig.json",
    "rebuild": "pnpm run generate && pnpm run build"
  },
  "dependencies": {
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@types/node": "^22.19.1",
    "swagger-typescript-api": "^13.1.0",
    "typescript": "^5.6.3"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**src/index.ts:**
```typescript
export * from "./api-sdk";
```

### Step 3: Create Generation Script

This script loads your `openapi.json` file and generates an HTTP client:

```typescript
// scripts/generate-sdk.ts
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
```

### Step 4: Build and Publish

```bash
cd sdk
npm run generate
npm run build
npm publish
```

For private packages:
```bash
npm publish --access restricted
```

## Usage Examples

### React Frontend with React Query

**1. Setup the SDK client:**

```typescript
// src/api/client.ts
import { Api } from "@demo/api-sdk";

const api = new Api<string>({
  baseURL: import.meta.env.VITE_API_URL,
  securityWorker: () => {
    const token = localStorage.getItem('jwt');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  },
});

export { api };
```

**Alternative: Using `setSecurityData` for runtime token updates:**

```typescript
// src/api/client.ts
import { Api } from "@demo/api-sdk";

const api = new Api<string>({
  baseURL: import.meta.env.VITE_API_URL,
  securityWorker: (token) => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  },
});

api.setSecurityData(localStorage.getItem('jwt'));

export { api };
```

**2. Create a React Query hook:**

```typescript
// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.users.findAll();
      return data;
    }
  });
}
```

**3. Use in your component:**

```typescript
import { useUsers } from "./useUsers";

export function App() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  return (
    <div>
      <h1>Users</h1>
      {isLoading && (<p>Loading...</p>)}
      {isError && (<p>Error: {error.message}</p>)}

      {users.length && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Notice how:**
- `user.name`, `user.email`, and `user.role` are all fully typed
- TypeScript catches errors if the backend changes
- No manual type definitions needed

### NestJS Microservice Communication

**1. Setup the client:**

```typescript
// apps/notification-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { Api } from '@demo/api-sdk';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Api,
      useFactory: () => {
        return new Api<string>({
          baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
          securityWorker: () => {
            const token = process.env.API_BASE_AUTH;
            return token
              ? { headers: { Authorization: `Bearer ${token}` } }
              : {};
          },
        });
      },
    },
  ],
})
export class AppModule {}
```

**2. Use in your service:**

```typescript
// apps/notification-app/src/app.controller.ts
import { Controller, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async sendPostNotification(@Param('postId') postId: string) {
    await this.appService.sendPostNotification(postId);
  }
}
```

### General Node.js Usage

You can use this SDK in any Node.js project, including AWS Lambda functions:

```typescript
import { Api } from "@your-org/api-sdk";

const api = new Api({
  baseURL: process.env.API_URL || "https://api.example.com",
});

// Fully typed request and response!
const user = await api.users.findOne({ id: '1' });
console.log(user.data.name);
```

## Benefits

Creating an SDK isn't just a convenience - it's a strategic investment in your development workflow.

An SDK provides:

✨ **Full-stack type safety**  
🔒 **Unified API contracts**  
🚀 **Faster development cycles**  
🎯 **Better developer experience**  
🏗️ **Scalable microservice architecture**  
📚 **Self-documenting APIs**

Your OpenAPI specification becomes the single source of truth, and your SDK becomes the easiest and safest way to consume your API anywhere in your architecture.

## Alternative SDK Generators

You can also use other packages for generating TypeScript SDKs from OpenAPI specs:

- **[openapi-typescript](https://github.com/drwpow/openapi-typescript)** – Generates TypeScript types from OpenAPI definitions
- **[openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)** – Generates full TypeScript clients including API call functions
- **[@redocly/openapi-sdk-codegen](https://redocly.com/)** – Redocly's official SDK generator for TypeScript clients
- **[openapi-typescript-generator](https://github.com/OpenAPITools/openapi-generator)** – Another TypeScript SDK generator with customizable templates
- **[openapi-ts](https://github.com/hey-api/openapi-ts)** – Focused on generating TypeScript types and interfaces from OpenAPI specs

## 📖 Learn More

If you found this helpful, please:

👏 Star this repository  
💬 Leave feedback or questions in the issues  
➡️ Connect on [LinkedIn](https://www.linkedin.com/in/mark-galant-187aa1104/)

Happy coding! 🚀
