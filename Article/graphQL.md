<!--
 * @Author: Terryzh
 * @Date: 2019-08-31 14:00:23
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-08-31 14:03:02
 * @Description: graphql in AntDesignPro
 -->

# 在AntDesignPro中集成Graphql

Graphql是一种查询语句的API，可以对比常用的Restfull API。

目前使用Graphql的主要人群仍居少数，虽然已经推广了很久。可能的原因应该是Graphql的上手难度和学习成本加上后期的维护成本比较高，导致目前社区使用人数不多，但可以预见的是Graphql带来了新的解决思路。

有幸在工作中用到，但当时的集成是集成在了VUE2.5+的版本中，效果并不明显。

apollo是react直接提供的针对Graphql的客户端对接端口，天然耦合，所以react更加适合Graphql的请求调用。接下来将梳理一下Ant Design Pro如何对Graphql进行集成。实现快速的接口对接。

## umi提供的社区插件

umi社区提供了配置型集成apollo。先拉取`umi-plugin-apollo`， 在config中直接配置相关内容便可以使用。

### Install

```bash
$ yarn add umi-plugin-apollo    # OR npm install --save umi-plugin-apollo
```

### Setup

> umi中的配置方式

Having setup the `umi-plugin-react`, add the `umi-plugin-apollo` plugin:

```javascript
// .umirc.js

export default {
  plugins: [
    ['umi-plugin-react', {
      routes: {
        exclude: [
          /schema\.(js|jsx|ts|tsx)$/,
          /resolvers\.(js|jsx|ts|tsx)$/,
        ],
      },
      // other umi-plugin-react options
    }],
    ['umi-plugin-apollo', {/*
      uri: 'https://my.endpoint.com/graphql',
      mock: true,
      hooksImportFrom: 'react-apollo-hooks',
      options: 'path/to/options/file',
    */}],
  ]
}
```

Done.

> Ant Design Pro 中的配置方式

```javascript
// config/config.js or config/config.ts

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: false,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        exclude: ['@babel/runtime', 'netlify-lambda'],
      },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  // !!!!加在配置plugin的后面
    ['umi-plugin-apollo', {/*
      uri: 'https://my.endpoint.com/graphql',
      mock: true,
      hooksImportFrom: 'react-apollo-hooks',
      options: 'path/to/options/file',
    */}],
];
export default {
  plugins,
}
```



接下来提供apollo的客户端，类似于创建一个`request`请求

```javascript
// path/to/options/file.js' -->目标路径

export const cacheOptions = {
};

export const httpLinkOptions = {
};

export const stateLinkOptions = {
};

export const extraLinks = [
];

export const clientOptions = {
};

export const providerOptions = {
};

export const makeCache = undefined; // : ({ cacheOptions }) => Cache
export const makeHttpLink = undefined; // : ({ clientStateLink, remoteLink, httpLinkOptions }) => ApolloLink
export const makeClientStateLink = undefined; // : ({ resolvers, defaults, cache, typeDefs, stateLinkOptions }) => ApolloLink
export const makeLink = undefined; // : ({ clientStateLink, remoteLink, extraLinks }) => ApolloLink
export const makeClient = undefined; // : ({ link, cache, clientOptions }) => ApolloClient
export const makeProvider = undefined; // : ({ client, providerOptions }) => ReactElement (eg: ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider)
```



相关细节可以参考[原文链接](https://github.com/lemol/umi-plugin-apollo)



# 手动配置apollo

在umi提供的社区plugin中的apollo只能满足基本Graphql调用需求，复杂的调用还要涉及调用扩展方法，不是很方便，在AntDesignPro中也可以直接引入官方提供的apollo客户端。

优点：灵活性高。

缺点：配置项多，且复杂。

[官网地址](https://www.apollographql.com/docs/react/basics/setup.html)

### 基础包安装

```bash
npm install apollo-boost @apollo/react-hooks graphql
```

- `apollo-boost`: 包含设置Apollo Client所需的一切的包
- `@apollo/react-hooks`: 基于视图层集成的React hook
- `graphql`: 解析您的GraphQL查询



### 创建客户端

像umi内置的`request`一样创建一个客户端。

```javascript
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
});
```



### 创建基础查询语句

> 注： `gql`可以从 `apollo-boost` 和 `graphql-tag` 中导入。`gql` 是解析Graphql查询语句的必备方法。
>
> 你也可以让webpack帮助你解析`.gql`的文件。这里 就不深入讲解了。

```javascript
import { gql } from "apollo-boost";
// or you can use `import gql from 'graphql-tag';` instead

...

client
  .query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `
  })
  .then(result => console.log(result));
```



### 连接Graphql到AntDesignPro

```javascript
import React from 'react';
import { render } from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
```

和连接到React应用是一个道理。



详情可以上面给出的官方链接。这里不深入了。