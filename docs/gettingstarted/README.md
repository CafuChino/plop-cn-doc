---
sidebar: auto
---
>[大量阿里云新老客户优惠请点击!](https://promotion.aliyun.com/ntms/yunparter/invite.html?userCode=bl6ygqub)2核2G 突发性能型服务器最低99/年起！
# 快速上手
[![npm](https://img.shields.io/npm/dm/plop.svg)](https://www.npmjs.com/package/plop)
&nbsp;
[![npm](https://img.shields.io/npm/v/plop.svg)](https://www.npmjs.com/package/plop)
&nbsp;
[![plop on slack](https://img.shields.io/badge/slack-join%20workspace-green)](https://join.slack.com/t/plopjs/shared_invite/zt-ehh69el1-2_DjgZRuMbpC9RnEa4M8cA)

文档版本：<Badge type="tip" text="v2.7.4" vertical="middle" />

## 什么是 Plop？

Plop是一个“微生成器框架”——之所以这样定义它，是因为Plop是一个用于生成代码文件或其他纯文本文件的小工具。并且简单、高效、同时保证一致性。在开发中我们的代码往往基于“框架”和“关键字”的组合（路由、控制器、模板、等等）。这些组合往往随着时间的推移和开发的进行不断的会被完善和调整。当你需要创建一个同类型的文件时，你往往很难在浩如烟海的代码仓库中找到当初的那个“最佳实践”。而Plop专为解决此类问题而生，通过使用Plop，你只要在控制台输入`Plop`命令，即可创建任何格式的已经提前编写好的“最佳实现”代码。这不仅节约了你在搜寻合适代码来复制粘贴的时间，同时他也带给你最“正确”也最“方便”的创建新文件的方法。

Plop的核心其实主要是[inquirer](https://github.com/SBoudrias/Inquirer.js/)命令行工具和[handlebar](https://github.com/wycats/handlebars.js/)模板引擎的整合。

::: tip
此文档还在编写中，如果你想提供帮助，欢迎提交PR。
:::

## 安装

### 1. 将plop添加到项目
```
$ npm install --save-dev plop
```
### 2. 全局安装plop (可选项，推荐)
```
$ npm install -g plop
```
### 3. 在项目的根目录创建plopfile.js
``` javascript
module.exports = function (plop) {
	// 创建生成器
	plop.setGenerator('basics', {
		description: '这是一个基础plopfile模板',
		prompts: [], // 确认问题数组
		actions: []  // 操作列表
	});
};
```
## 编写Plopfile

Plopfile是一个简单的Node module，并导出一个函数，它接受一个`plop`对象作为第一个传入参数。

``` javascript
module.exports = function (plop) {};
```
`plop`对象暴露了一些plop的api，其中包括`setGenerator(name, config)`方法，使用此方法可以创建Plop生成器。当在工作目录（或工作目录的子目录）命令行中输入`plop`命令时，所有的生成器会以列表形式输出。

一个最简单的起始生成器例子可能类似这样：

``` javascript
module.exports = function (plop) {
	// controller generator
	plop.setGenerator('controller', {
		description: 'application controller logic',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'controller name please'
		}],
		actions: [{
			type: 'add',
			path: 'src/{{name}}.js',
			templateFile: 'plop-templates/controller.hbs'
		}]
	});
};
```
我们创建的 *controller* 生成器会询问我们一个问题，并创建一个文件。这一操作可以进一步扩展，比如询问更多的问题，创建更多的文件。也有一些附加的`action`可以通过其他的方式操作我们的代码仓库。


## 使用Prompts
Plop使用[inquirer.js](https://github.com/SBoudrias/Inquirer.js) 库来接受用户输入。更多关于[问题类型](https://github.com/SBoudrias/Inquirer.js/#prompt-types)的信息可以查看inquirer官方文档.

## 通过CLI调用

Plop成功安装并且创建了`generator`之后，你就可以使用命令行运行plop了。直接调用`plop`命令将会输出所有可用的生成器。你呀可以直接使用`plop [生成器名称]`来直接调用某一生成器。如果你没有全局安装plop，则需要编写一个npm脚本来帮助运行plop。


```javascript
// package.json
{
    ...,
    "scripts": {
        "plop": "plop"
    },
    ...
}
```

### 直接传入参数

如果你对一个项目（以及它的生成器）十分了解，你可能在调用生成器时就可以传递回答参数了。如果项目中有一个名为`component`的生成器，其接受一个名为`name`的参数，可以直接通过`plop component "名字"`直接传入参数。如果生成器接受更多参数，只要按照这种规则依次传入即可。

例如`confirm`和`list`类型问题会最大程度尝试理解你的输入。比如为`confirm`类型问题传入"y"，"yes"，"t"，或者"true"都会被解析成布尔值`true`。同时你可以使用选项的确切值，数组下标，键名，或者名称等等表示从列表中选中某选项。多选问题允许你传入以逗号分隔的值的列表，来表示多选项。

#### 操作示例

![操作示例](https://i.loli.net/2021/02/20/TIA8zUY5NSBurXs.gif)

::: tip
如果你想直接传入参数的问题是第二个问题，第一个仍需手动填写或选择，可以使用“\_“来跳过某个参数(例如 `plop component _ "input for second prompt"`).
:::

Plop已经内置常规问题的直接传入参数逻辑了，不过你也可以自定义一些特殊问题解析用户输入的逻辑。如果你发布了inquirer的第三方插件并想支持plop的直接传入参数逻辑，可以查看[本文档的相关内容](#3rd-party-prompt-bypass).

### 通过属性名直接传入参数
你也可以直接传入参数 `--` 然后提供每个问题的参数来直接传入参数，例子[如下](#直接传入参数示例).

#### 直接传入参数示例
```
## 直接传入问题1和2的参数
$ plop component "my component" react
$ plop component -- --name "my component" --type react

## 直接传入问题2的参数 (name 属性依然会正常询问)
$ plop component _ react
$ plop component -- --type react
```

### 强制执行生成器

通常情况下Plop的`action`在发现执行可以操作时会执行失败，以此来尽可能确保文件安全。最常见的情况可能是不允许[`add`](#add) 操作覆盖一个已存在文件。但是Plop支持特殊的`force`属性，你也可以在命令行输入指令是加上`--force`选项开启强制模式，在这一模式下所有操作均会强制完成。不惜一切代价...🕷

## 为什么是“生成器”机制

这一机制可以使得你可以专注于编写模板，而不必同时考虑代码逻辑问题。这一机制可以为你和你的团队在面对重复逻辑时（路由，组件，辅助函数，测试，界面层，等等）节省大量的时间，[这真的很重要](https://xkcd.com/1205/)！

与此同时，对于程序猿来说在不同任务之间反复横跳真的[很浪费时间](https://www.petrikainulainen.net/software-development/processes/the-cost-of-context-switching/)，很有可能还没等你进入编写新逻辑的状态你就忍不住去摸鱼了...所以一次专注一件事真的可以大大提高工作效率！而且[工程化运作](https://kentcdodds.com/blog/automation)的优势远不止于此！
