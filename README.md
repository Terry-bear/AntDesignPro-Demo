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

### 整合graphql[TODO]

使用umi-plugin-apollo整合graphql中遇到的坑

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

#### 后续采坑继续补充...

...
