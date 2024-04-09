# Caller ID

This project implements a RESTful API using Node.js and PostgreSQL, providing various endpoints for user authentication, spam management, and contact search functionalities.

## Table of Contents

- [Routes](#routes)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)

## Routes

### Authentication Routes

- **POST /auth/register**: Register a new user with a name, phone number, email (optional), and password.
- **POST /auth/login**: Authenticate and log in a user with their phone number and password.

### Spam Routes

- **GET /spam/:phone**: Get all spam entries for a specific phone number.
- **POST /spam/:phone**: Mark a contact as spam by phone number.
- **DELETE /spam/:phone**: Remove a contact from the spam list by phone number.

### Search Routes

- **GET /search/name/:query**: Search for a person by name in the global database.
- **GET /search/phone/:phone**: Search for a person by phone number in the global database.
- **GET /search/id-source/:id/:source**: Search for a person by ID and source in the global database.

## Database Schema

The project utilizes a PostgreSQL database with the following schema:

### User Table

- **id**: Primary key auto-incremented integer.
- **name**: Name of the user.
- **phone_number**: Unique phone number of the user.
- **email**: Email address of the user (optional).
- **password_hash**: Hashed password of the user.

### Spam Table

- **id**: Primary key auto-incremented integer.
- **phone_number**: Phone number of the spam entry.
- **marked_by_user_id**: Foreign key referencing the ID of the user who marked the spam.

### Contacts Table

- **id**: Primary key auto-incremented integer.
- **user_id**: Foreign key referencing the ID of the user.
- **name**: Name of the contact.
- **email**: Email address of the contact (optional).
- **phone_number**: Phone number of the contact.

## Setup Instructions

To set up and run the project:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `docker-compose up` to start the containers defined in the `compose.yaml` file. This will set up the Node.js server and PostgreSQL database.
4. Run `node server/scripts/migrateData.js` to populate the database with sample data.
5. Once the setup is complete, you can access the API endpoints as described above.
