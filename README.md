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

...
