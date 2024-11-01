# Demonstride
A RESTful API designed to manage and access various services provided by the CordX platform. It offers a range of endpoints to interact with the system, perform CRUD operations, and retrieve information.

## Key Features

- **File Management**: List and access files and directories in the CDN.
- **GraphQL Integration**: Query and mutate data using GraphQL.
- **Swagger Documentation**: Auto-generated API documentation for easy reference.
- **Health Checks**: Monitor the health and status of the API.

---

## Self Hosting
Self Hosting Demonstride can be fairly complex, This section will explain the commands and steps you need to focus on, please note that `pnpm` is 
used and enforced for this project!

### Commands
- `db:init`: Initializes our Database using the schema located at `src/prisma/schema.prisma` (__**this is necessary to use and interact with our Database**__)
```sh
pnpm db:init
```

- `db:create`: Generates a new Database Client based on the schema located at `src/prisma/schema.prisma` (__**this is necessary to use and interact with our Database**__)
```sh
pnpm db:create
```

- `dev`: Compiles schemas and starts the development server with watch mode enabled
```sh
pnpm dev
```








