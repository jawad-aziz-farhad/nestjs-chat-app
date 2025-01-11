# NestJS Chat Application

A real-time chat application built using [NestJS](https://nestjs.com/), [Socket.IO](https://socket.io/), and [TypeORM](https://typeorm.io/). This application demonstrates the use of WebSockets for real-time communication, RESTful APIs for user management, and a relational database for storing messages and user data.

## Features

- Real-time messaging with Socket.IO
- User authentication and authorization using JWT
- RESTful API for user management
- Database integration with TypeORM
- Support for private and group chats

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) or any other relational database supported by TypeORM

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nestjs-chat-app.git
   cd nestjs-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=chat_app
   JWT_SECRET=your_secret_key
   SOCKET_PORT=3001
   ```

4. Run database migrations:

   ```bash
   npm run typeorm migration:run
   # or
   yarn typeorm migration:run
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

2. The application should now be running at `http://localhost:3000`.

## Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user and get a JWT token

### Users

- `GET /users` - Get a list of all users (authenticated)
- `GET /users/:id` - Get user details by ID (authenticated)

### Messages

- `POST /messages` - Send a message
- `GET /messages` - Get chat history (with query params for filters)

### WebSocket Events

- `connection` - Triggered when a user connects to the WebSocket server
- `message` - Handles sending and receiving messages
- `disconnect` - Triggered when a user disconnects from the WebSocket server

## Project Structure

```
nestjs-chat-app/
├── src/
│   ├── auth/              # Authentication module
│   ├── chat/              # Chat module
│   ├── users/             # User module
│   ├── common/            # Common utilities, guards, interceptors
│   ├── app.module.ts      # Root module
│   ├── main.ts            # Entry point
├── test/                  # Unit and e2e tests
├── .env                   # Environment variables
├── ormconfig.json         # TypeORM configuration
├── package.json           # Dependencies and scripts
```

## Technologies Used

- **NestJS** - Framework for building efficient and scalable server-side applications
- **Socket.IO** - Real-time bidirectional event-based communication
- **TypeORM** - ORM for database interactions
- **JWT** - Authentication and authorization
- **PostgreSQL** - Relational database

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

Special thanks to the NestJS and Socket.IO communities for their comprehensive documentation and examples.
