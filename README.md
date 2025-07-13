# express-wetube-challenge

fullstack video community web app using express v4 + pug + ffmpeg + mongodb + minio

## how to run

### setup

- install latest nodejs runtime

```sh
$ node -v
v22.16.0

$ npm -v
10.9.2
```

### configure

- install packages with npm packager

```sh
$ npm init
$ npm i
```

- create runtime variables

```sh
$ cat .env
MODE=DEV
API_ADDRESS=localhost
API_PORT_NO=4567
COOKIE_SECRET={YOUR_COOKIE_SECRET}
GITHUB_API_URL=https://api.github.com
GITHUB_AUTH_URL=https://github.com/login/oauth
GITHUB_CLIENT_ID={YOUR_GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={YOUR_GITHUB_CLIENT_SECRET}
DATABASE_URL=mongodb://id:pw@127.0.0.1:27017/video
STORAGE_SERVER=minio
STORAGE_REGION=auto
STORAGE_ENDPOINT_URL={YOUR_ENDPOINT_URL}
STORAGE_ACCESS_KEY_ID={YOUR_ACCESS_KEY_ID}
STORAGE_SECRET_ACCESS_KEY={YOUR_SECRET_ACCESS_KEY}
```

### launch

- run nodejs apps with development mode

```sh
$ npm run dev:assets
asset js/main.js 3.41 KiB [compared for emit] (name: main)
asset css/styles.css 881 bytes [compared for emit] (name: main)
Entrypoint main 4.27 KiB = css/styles.css 881 bytes js/main.js 3.41 KiB
orphan modules 3.24 KiB (javascript) 937 bytes (runtime) [orphan] 7 modules
runtime modules 274 bytes 1 module
cacheable modules 101 bytes (javascript) 509 bytes (css/mini-extract)
  ./src/client/js/main.js 51 bytes [built] [code generated]
  ./src/client/scss/styles.scss 50 bytes [built] [code generated]
  css ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/client/scss/styles.scss 509 bytes [built] [code generated]
webpack 5.99.9 compiled successfully in 823 ms

$ npm run dev:server
[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `babel-node src/index.js`
✅ Server listenting on http://localhost:4567 🚀
✅ Connected to DB
```

### test

- download sample video file
  - [Pexcel](https://www.pexels.com)
  - [Others](https://www.sample-videos.com)
