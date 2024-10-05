# UF1845: Acceso a Datos en Aplicaciones Web del Entorno Servidor

This fully responsive full-stack apartment rental app, serving as the evaluated project for the UF1845 module, is part of the encompassing IFCD0210 Professional Certificate (Development of Applications with Web Technologies).

Use the app [here](https://uf1845-ironhack.onrender.com/)*       
_<sub>*It may take upto 50 seconds to load due to free hosting limitations</sub>_

## Overview

The UF1845 module focuses on creating dynamic web applications with database access. It covers server-side development, database integration, and security best practices, including server-side validation. The curriculum includes designing, testing, and deploying web applications while managing vulnerabilities and ensuring data consistency and secure operations in production environments.

## Installation

To run the code in this repository, you'll need to have Node.js and npm installed. You can install the required dependencies using npm:

```bash
npm install
```

## Usage

After installing the necessary dependencies, you can start the development server by running:

```bash
npm run start
```

This will start the server, and you can navigate to [http://localhost:3000](http://localhost:3000) to view the application in your web browser.

## Project Structure

This repository follows the MVC (Model-View-Controller) architectural pattern and includes the following main directories and files:

- `controllers/`: Contains the logic for handling user input and interacting with the model. Controllers process requests, retrieve data, and return responses.

- `models/`: Defines Mongoose schemas that represent the data structure and business logic of the application. These models interact with the MongoDB database and manage data-related operations.

- `views/`: Includes EJS templates for rendering dynamic HTML content, allowing for the separation of presentation from business logic.

- `public/`: Houses static files, organized into the following folders:

  - `icons/`: Contains icon files used throughout the application.
  - `js/`: Includes JavaScript files for client-side functionality.
  - `css/`: Holds CSS files for styling the application.
  - `logo/`: Contains logo files for branding purposes.
  - `utils/`: Contains utility functions and helpers that provide common functionalities used across the application.

- `app.js/`: The main application file that sets up the Express framework, defines routes for handling HTTP requests, and includes JavaScript for data processing and client-side logic.

- `package.json`: Lists dependencies and scripts required to run the application, facilitating easy management of project dependencies.

## Tools Used

### Development Environment
* Node.js

### Templating Language
* EJS

### Back End
* Express.js
* MongoDB
* Mongoose

### API Testing
* Thunder Client

### Hosting 
* Render (free hosting)

# Features

### Standard user are able to:

* search for apartments based on minimum price, maximum price, number of guests, locations, latest listing and available dates. 
