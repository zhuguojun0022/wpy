# admin-h5

> A Vue.js project

## Build Setup

``` bash
# install dependencies
yarn install

yarn add xxx --save / --save-dev

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test

#run mock server
npm run mock
```

## 开发

### 接口 mock

1. 位置: `src/common/apis`  
2. mock: config 中可以定义{mock: true}进行mock
3. 调用目标: config 中可以定义 {origin: 'api'}, 默认为'api' 



For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
