# AntDesignPro-Demo

初探AntDesignPro4.0用法和采坑记录

## 初始化项目

使用`yarn create umi`会报错,导致脚手架无法生效,使用`npm create umi`选择`Ant design pro`问题解决

## 初始化区块

在[区块官网](https://preview.pro.ant.design)下载区块即可.

区块中如果包含了package.json没有的依赖,在拉取区块的时候会卡死,原因目前不知道.

手动安装依赖`npm install numeral@^2.0.6 react-router@^4.3.1`, 安装成功后react的`node_modules`会消失,原因未知.

重新`yarn`一下,安装回来`node_modules`,项目正常启动.

## 其他采坑进行中

### 删除了相关的测试用例

国内镜像拉取Puppeteer速度很慢,删除后拉包速度显著提升,一般情况下的公司前端开发不需要自己编写前端自动化测试用例.所以删除了

### 整合graphql

使用umi-plugin-apollo整合graphql中遇到的坑

...
