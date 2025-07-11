# express-wetube-challenge

fullstack video community web app using express v4, ffmpeg, pug, mongodb, minio

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
API_PORT_NO=4000
COOKIE_SECRET={YOUR_COOKIE_SECRET}
DATABASE_URL=mongodb://127.0.0.1:27017/movie
GITHUB_API_URL=https://api.github.com
GITHUB_AUTH_URL=https://github.com/login/oauth
GITHUB_CLIENT_ID={YOUR_GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET={YOUR_GITHUB_CLIENT_SECRET}
```

### launch

- update nodemon setting

```sh
$ cat nodemon.json
{
  "ignore": ["webpack.config.js", "src/client/*", "assets/*"],
  "exec": "babel-node src/index.js"
}
```

- run nodejs apps with development mode

```sh
$ npm run dev:server
$ npm run dev:assets
```

### test

- download sample video file
  - [Pexcel](https://www.pexels.com)
  - [Others](https://www.sample-videos.com)
