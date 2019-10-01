## About

Code forum is a fullstack application fully built on TypeScript. It has all the basic functionality for a forum. For the backend it utilizes express and for the front react.

### About the frontend

All the needed code is labeled in the corresponding folders. Also components are divided into different main features. In those different features there are private and public components. Private meaning an user who has logged in can access them and public, meaning anyone can access the component.

### About the backend

Since this project 100% Typescript I have utilized the class functionality which has made defining routes and controllers more elegant. The main server starts from the `index.ts` file, but the main functionality of the server starts in the `app.ts` file. Different features are divided into different components. These component folder include needed DTO's, models, interfaces and controllers. DTO's might not be necessary for a project of this scale, but they add a bit of clarity for the controllers.
