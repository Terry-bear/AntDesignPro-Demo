<!--
 * @Author: Terryzh
 * @Date: 2019-08-19 16:57:09
 * @LastEditors: Terryzh
 * @LastEditTime: 2019-09-21 15:01:11
 * @Description: add readme
 -->
# AntDesignPro-Demo

初探AntDesignPro4.0用法和采坑记录
欢迎提issues来讨论自己遇到的问题.
> tip：现在 umi 同步更新到了 3.0，迁移方案在官网很明确。[umi官网迁移方案](https://umijs.org/zh-CN/docs/upgrade-to-umi-3)
> [AndDesign Pro 关于 umi3.0 迁移方案](https://pro.ant.design/docs/upgrade-umi3-cn)
## 初始化项目

使用`yarn create umi`会报错,导致脚手架无法生效,使用`npm create umi`选择`Ant design pro`问题解决

## 初始化区块

在[区块官网](https://preview.pro.ant.design)下载区块即可.

区块中如果包含了package.json没有的依赖,在拉取区块的时候会卡死,原因目前不知道.

手动安装依赖`npm install numeral@^2.0.6 react-router@^4.3.1`, 安装成功后react的`node_modules`会消失,原因未知.

重新`yarn`一下,安装回来`node_modules`,项目正常启动.

## 删除不常用的package

删除package.json里面的：

1. 关于提交前检查的项

```json
"husky": { "hooks": { "pre-commit": "npm run lint-staged" } },
```

2. 关于jest测试用例

```json
"jest-puppeteer": "^4.2.0",
```

3. 关于puppeteer浏览器

```json
  "optionalDependencies": { "puppeteer": "^1.17.0" },
```

4. 国际化文件`、src/locales/*`

```bash
// 内置了package命令
npm run i18n-remove
// 这个脚本将会尝试删除项目中所有的 i18n 代码，对于复杂的运行时代码，表现并不好，慎用。

// 手动删除
yarn i18n-remove
删除 */locales/*
```

## 其他采坑进行中

### 删除了相关的测试用例

国内镜像拉取Puppeteer速度很慢,删除后拉包速度显著提升,一般情况下的公司前端开发不需要自己编写前端自动化测试用例.所以删除了

### 整合graphql

使用umi-plugin-apollo整合graphql中遇到的坑
详情请跳入链接[点击我](Article/graphQL.md)

### AntDesignPro去掉国际化

AntDesignPro整合了国际化的多语言,但是大多数项目是不需要多语言的,在Component或者page里面找到自己开发的页面,对应引入的包->

`import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';`

对应包内`locales`的中文版找出相关词,删除`FormattedMessage, formatMessage`的格式化.

### 区块中遇到的坑

#### 引入问题

在拉取区块的时候,umi会对所有引入的包在npm中寻找,所以区块的所有引用都是单独存在的.
如果你配置了全局的`css`样式或者`request`请求,请在引入区块后修改相应的`import`引入.

#### 模块问题

`umi`中区块用的很多`Component`其实都一样的,但是在引入时,会在`page`的`Component`里面生成同样的代码.
如果要对`Component`进行模块化管理和统一使用,需要将`page`目录下的`Component`移入根目录的`Component`,进行相关细节调整.

### 项目启动问题

#### umi编译page下的`.umi`

umi在编译时对路由和dva进行了预处理封装.所以在`page`目录下会生成隐藏文件夹📂`.umi`,这个目录会在每次重启`yarn start`的时候,重新进行编译.

这个目录下的文件,最多只能用`console``来查看传值和实现,**请勿修改里面的内容,这样就算下次编译以后也不会生效**.

### `node_modules`重新拉取的问题

在`package.json`文件中,我在开发过程中更新了最新的`loadash.js`,`npm install`重新拉取全部包结构的时候,发现npm对umi的结构进行了重新梳理.

后来无法正常启动,排查原因发现,是新版的`yarn`对包结构进行了优化,直接用`yarn`安装`node_modules`的速度快而稳定.

### 接口配置

AntDesignPro官方使用`umi-request`·做接口请求。`umi-request`整合了axios和fetch的优点。

在`extend`方法中配置请求头，带入`token`。

```ts
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie
  // mode: 'no-cors',
  prefix: '/api',
  headers: {
    Authorization: window.localStorage.getItem('Authorization') || '', // 统一的headers
  },
});
```

接口调用异常的捕获。

```ts
/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): void => {
  const { response } = error;
  console.log('errorHandler', error);
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
		
    // notification是AntDesign里面的组件，作为提醒用
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
};
```

接口调用返回值的处理

```ts
// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  // 获取后端返回msg和code
  const { code, msg } = await response.clone().json();
  if (response.status === 200) {
    if (code === 200 && !/query|get/g.test(response.url)) message.success(msg);
    else if (typeof code === 'number' && code.toString().length >= 4) message.warning(msg);
    else if (typeof code === 'number' && code === 401) message.warning(msg);
  } else message.error(msg);
  return response;
});
```



## 全局化配置

全局化配置中可以修改全局样式文件。

在根目录下的`config/config.ts`或者`config/config.js`文件中配置

```ts
theme: {
    'primary-color': primaryColor, // 主色调
    'font-size-base': '12px', // 主字号
  },
```

> 具体配置可参考[官网示例](https://ant.design/docs/react/customize-theme-cn)。



## webpack优化

#### 如何在打包过程中去掉console

在AntDesignPro中，webpack使用的是4.0+，无法继续使用`UglifyJsPlugin`.

加上AntDesignPro中使用的是链式配置调用。—>`chainWebpack`

采坑发现使用最新的`TerserPlugin`可以解决此问题。

文件路径`config/plugin.config.ts`

```ts
config.optimization
    // TODO TerserPlugin优化
    .minimizer('terser-webpack-plugin')
    .use(TerserPlugin, [
      {
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      },
    ])
    .end()
```

> 完美去除打包后的console


### less样式覆盖

**如何覆盖局部AntDesign组件样式?**
找到组件中子class的名字,包裹一层`global`,示例:
```less
.CardManual{
  :global {
    .antd-pro-pages-kanban-components-charts-chart-card-index-chartTop,
    .antd-pro-pages-kanban-components-charts-chart-card-index-meta,
    .antd-pro-pages-kanban-components-charts-chart-card-index-meta{
      margin-bottom: 10px;
    }
  }
}
```

### 更新版本
在12 月份更新的版本中。
侧边栏和顶部导航采用了 sticky 粘性定位来固定，对较低版本的浏览器不兼容，建议先进行版本锁定。

#### 后续采坑继续补充...

...
