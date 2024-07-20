School Management System
This is a school management system project built with Node.js, Express, and PostgreSQL. The project includes endpoints to handle CRUD operations for various entities such as Principal, Teacher, Student, Class, Course, and Grade. It is designed as a RESTful API.

Features
Principal:
Can create, delete, and update Classes, Teachers, Courses, and Students.
Can perform all basic CRUD operations.
Teacher:
Can manage student grades.
Can perform all operations related to grades.
Student:
Can view their own courses, schedules, and grades.
Technology Stack
Node.js: JavaScript runtime for server-side programming.
Express: Web framework for Node.js to create the API endpoints.
PostgreSQL: Database to store and manage data.
Sequelize: ORM for PostgreSQL to handle database operations.
Sequelize CLI: Tool to generate models, migrations, and seed files.
Dotenv: Module to load environment variables from a .env file.
Bcrypt: Library to hash passwords.
Jsonwebtoken: Library for token-based authentication and authorization.
Multer: Middleware for handling file uploads (e.g., profile images).
Nodemailer: Library to send emails for various school operations
