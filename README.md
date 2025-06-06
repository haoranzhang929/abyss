## Abyss

This is a small personal project showcasing some of my [three.js](https://threejs.org/) experiments. It renders an animated star field and a few post–processing effects with React acting as the UI framework.

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) but most of the rendering logic lives in plain three.js.

### Getting started

Clone the repository and install the dependencies:

```bash
npm install
```

Then run the development server with:

```bash
npm start
```

The scene will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run lint`

Launches the eslint for code wthin src directory.

### `npm run lint:fix`

Launches the eslint for code wthin src directory and fix errors if possible.

### `npm run typecheck`

Launches the type checking using typescript CLI for code wthin src directory.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Features

- Animated star field driven by an audio analyser
- Post–processing stack using `postprocessing` for god rays and SMAA anti–aliasing
- Dithering shader based on Codrops tutorial (press "D" to toggle)
- Optional device orientation controls for mobile users

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
