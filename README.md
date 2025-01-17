# Demonstride
A RESTful API designed to manage and access various services provided by the CordX platform. It offers a range of endpoints to interact with the system, perform CRUD operations, and retrieve information.

---

## Key Features

- **GraphQL Integration**: Query and mutate data using GraphQL.
- **Swagger Documentation**: Auto-generated API documentation for easy reference.
- **Health Checks**: Monitor the health and status of the API.
- **Modular Database**: Uses a modular database architecture, powered by the [@cordxapp/db](https://github.com/CordXApp/node-sdk/tree/master/packages/database) npm module.

---

## Installation

To install the dependencies, run:

```sh
npm install
```

---

## Usage

### Development
To start the development server with watch mode:

```sh
$ npm run dev
```

### Production
To build and start the production server:

```sh
$ npm run build
$ npm run start
```

### Scripts
- `build`: Build the project using tsup.
- `dev`: Generate Prisma client and start the development server with watch mode.
- `dev:watch`: Start the development server with watch mode.
- `start`: Start the server in production mode.
- `start:prod`: Start the server in production mode using the built files.
- `typecheck`: Run TypeScript type checking.
- `prestart`: Generate Prisma client.
- `prepare`: Prepare Husky for Git hooks.

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

---

## License
This project follows the "No License" standards. All rights are reserved. You may not copy, modify, or distribute this project without permission.
