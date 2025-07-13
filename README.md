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
DATABASE_URL=mongodb://id:pw@127.0.0.1:27017/wetube
STORAGE_SERVER="minio | cloudflare r2 | aws s3"
STORAGE_REGION=auto
STORAGE_ENDPOINT_URL={YOUR_ENDPOINT_URL}
STORAGE_ACCESS_KEY_ID={YOUR_ACCESS_KEY_ID}
STORAGE_SECRET_ACCESS_KEY={YOUR_SECRET_ACCESS_KEY}
STORAGE_DOWNLOAD_URL_VIDEO={YOUR_PUBLIC_VIDEO_DOMAIN}
STORAGE_DOWNLOAD_URL_IMAGE={YOUR_PUBLIC_IMAGE_DOMAIN}
```

### launch

- run nodejs apps with development mode

```sh
$ npm run dev:assets
asset js/main.js 3.41 KiB [compared for emit] (name: main)
asset css/styles.css 881 bytes [compared for emit] (name: main)
...
webpack 5.99.9 compiled successfully in 823 ms

$ npm run dev:server
...
[nodemon] starting `babel-node src/index.js`
✅ Server listenting on http://localhost:4567 🚀
✅ Connected to DB
```

- deploy nodejs apps with production mode

```sh
$ curl -L https://fly.io/install.sh | sh
$ fly launch
$ fly deploy
```

### test

- download sample video file
  - [Pexcel](https://www.pexels.com)
  - [Others](https://www.sample-videos.com)
