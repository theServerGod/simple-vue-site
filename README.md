# Simple Vue Site Project Seed
> Project template/seed for static sites and small web applications, using [Vue.js](https://vuejs.org/).

Please note: this project seed is intended for simple/small projects and favours simpler configuration over larger, more scalable configurations. As such, there is currently no OOTB support for live-reloading, Webpack Hot Module Replacement, complex testing, etc.

## Getting Started

### Development
```bash
# Install both main and dev dependencies
npm install

# Build project assets and run Webpack under watch mode
npm run dev

# Run server
npm start

# Run tests (ensure server is running first)
npm test
```

Typically, during development, you would want to have the Webpack watch mode and server running at the same time.

### Production
Typically, all that is needed for app deployment are the contents of the build directory `dist/`, the `server.js` file, and the `package.json` file. Otherwise, if you wish to perform builds on the server, you need to pull in the entire repo/project codebase.

```bash
# Install production dependencies (assuming `dist/` already built)
npm install --production
# OR
# Install all dependencies and build project assets
npm install && npm run build

# Launch server using all CPUs available (assuming PM2 as process monitor)
pm2 start server.js -i 0 --name "app-name"
```

Note the port that the server is running on as indicated in the output logs. To run multiple instances or sites on one VPS, simply change the port number for each site and configure your reverse proxy (e.g. Nginx) accordingly.

## Generating Thumbnails for Image Assets
A utility BASH script is provided at `assets/gallery/generate_thumbs.bash` that will generate thumbnails for all jpg/png images present in the directory the script is run from. Thubmnail filenames have the following convention:

Given `./foo.jpg`, script will produce `./foo.thumb.jpg`.

Build thumbnails for images in `./assets/gallery/` with:

	npm run build:thumbnails

This has been excluded from the Webpack build process in case certain projects do not need this build feature.
