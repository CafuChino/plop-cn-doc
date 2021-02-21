# Plopfile 配置
Plopfile的配置项是`plop`对象暴露出的的方法的集合，[`setGenerator`](#setgenerator)可以解决大部分的问题。但是在这部分文档中你可能会找到一些其他的有用信息以充实和完善你的plopfile。

## 使用TypeScript

`plop`内置了Typescript类型定义，无论你是否需要使用Typescript编写plopfile，这一特定都可以方便大部分的代码编辑器提供代码提示。

```javascript
// plopfile.ts
import {NodePlopAPI} from 'plop';

export default function (plop: NodePlopAPI) {
  // plop generator code
};
```

```javascript
// plopfile.js
module.exports = function (
	/** @type {import('plop').NodePlopAPI} */
	plop
) {
	// plop generator code
};
```

## 常用方法
这些是你创建plopfile时所需要用到的常用方法，调方法通常都是为内部服务，你可以查看[其他方法](#其他方法)。

方法 | 参数 | 返回 | 描述
------ | ---------- | ------- | -----------
[**setGenerator**](#setgenerator) | *String, [GeneratorConfig](#interface-generatorconfig)* | *[GeneratorConfig](#interface-generatorconfig)* | 创建一个生成器
[**setHelper**](#sethelper) | *String, Function* | | 创建一个helper
[**setPartial**](#setpartial) | *String, String* | | 创建一个Partial
[**setActionType**](#setactiontype) | *String, [CustomAction](#functionsignature-custom-action)* | | 创建一个Action类型
[**setPrompt**](#setprompt) | *String, InquirerPrompt* | | 使用inquirer注册自定义问题类型
[**load**](https://github.com/amwmedia/plop/blob/master/plop-load.md) | *Array[String], Object, Object* | | 从另一plopfile或者 npm module中载入生成器，helper，和/或 partials 

## setHelper
`setHelper` 等同于 handlebars 的方法 `registerHelper`。 如果你熟悉 [handlebars helpers](https://handlebarsjs.com/guide/expressions.html#helpers)，那你就已经对此很熟悉了。

``` javascript
module.exports = function (plop) {
	plop.setHelper('upperCase', function (text) {
		return text.toUpperCase();
	});

	// or in es6/es2015
	plop.setHelper('upperCase', (txt) => txt.toUpperCase());
};
```

## setPartial
`setPartial` 等同于 handlebars 的方法 `registerPartial`。如果你熟悉 [handlebars partials](https://handlebarsjs.com/guide/partials.html)，那你就已经对此很熟悉了。

``` javascript
module.exports = function (plop) {
	plop.setPartial('myTitlePartial', '<h1>{{titleCase name}}</h1>');
	// used in template as {{> myTitlePartial }}
};
```

## setActionType
`setActionType`允许你创建自定义`actions` (类似 `add` 或 `modify`) 完善你的plopfile。这些方法通常都是高度可复用的的 [自定义函数](/api/builtInActions.html#自定义action方法)。

### *函数定义* 自定义Action
参数 | 类型 | 描述
---------- | ---- | -----------
**answers** | *Object* | 生成器问题的回答
**config** | *[ActionConfig](#interface-actionconfig)* | 生成器“actions”数组中的对象
**plop** | *[PlopfileApi](#plopfile-api)* | Action运作时的plop api

``` javascript
module.exports = function (plop) {

	plop.setActionType('doTheThing', function (answers, config, plop) {
		// do something
		doSomething(config.configProp);
		// if something went wrong
		throw 'error message';
		// otherwise
		return 'success status message';
	});

	// or do async things inside of an action
	plop.setActionType('doTheAsyncThing', function (answers, config, plop) {
		// do something
		return new Promise((resolve, reject) => {
			if (success) {
				resolve('success status message');
			} else {
				reject('error message');
			}
		});
	});

	// use the custom action
	plop.setGenerator('test', {
		prompts: [],
		actions: [{
			type: 'doTheThing',
			configProp: 'available from the config param'
		}, {
			type: 'doTheAsyncThing',
			speed: 'slow'
		}]
	});
};
```

## setPrompt
[Inquirer](https://github.com/SBoudrias/Inquirer.js) 提供了许多开箱即用的问题类型，但是其也允许开发者构建第三方插件丰富问题类型。如果你需要使用第三方问题差价插件，你可以使用`setPrompt`。更多细节可以查看[Inquirer关于注册问题的官方文档](https://github.com/SBoudrias/Inquirer.js#inquirerregisterpromptname-prompt)。 你也可以查看[plop社区提供的自定问题列表](https://github.com/amwmedia/plop/blob/master/inquirer-prompts.md).

``` javascript
const promptDirectory = require('inquirer-directory');
module.exports = function (plop) {
	plop.setPrompt('directory', promptDirectory);
	plop.setGenerator('test', {
		prompts: [{
			type: 'directory',
			...
		}]
	});
};
```

## setGenerator
这一部分的配置对象需要包含`prompts` 和 `actions`（`description`是可选项）。`Prompts`数组会被传递到[inquirer](https://github.com/SBoudrias/Inquirer.js/#objects)，`actions`数组是一系列将要进行的操作的数组。（详细文档参阅下文）

### *接口* `GeneratorConfig`
参数 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**description** | *[String]* | | 关于generator用提的简要描述
**prompts** | *Array[[InquirerQuestion](https://github.com/SBoudrias/Inquirer.js/#question)]* | | 需要询问用户的问题
**actions** | *Array[[ActionConfig](#interface-actionconfig)]* | | 需要执行的操作

::: tip
  如果你的Action列表有动态需求，你可以查看[使用动态action数组](#using-a-dynamic-actions-array)部分内容。
:::

### *接口* `ActionConfig`
下列参数是plop内部需要使用的基本参数，其他参数的需求取决于action的*类型*，关于这部分可以查看[内置actions](#built-in-actions)。

参数 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**type** | *String* | | action的类型 ([`add`](#add), [`modify`](#modify), [`addMany`](#addmany), [等等](#setactiontype))
**force** | *Boolean* | `false` | 强制执行[forcefully](#running-a-generator-forcefully) (在不同action下有不同表现)
**data** | *Object / Function* | `{}` | 指定需要与用户输入参数进行合并的数据
**abortOnFail** | *Boolean* | `true` | 如果本操作因任何原因失败则取消后续操作
**skip** | *Function* | | 可选项，标记这个action是否会被执行

::: tip
`ActionConfig`的`data`属性也可以为一个返回对象的函数或者一个返回`resolve`内容为函数的`Promise`。
:::

::: tip
`ActionConfig`的`skip`属性方法是可选项，其应该返回一个字符串，内容是逃过action执行的原因。
:::

::: tip
`Action`除了可以使用对象写法，也可以使用[函数写法](/api/builtInActions.html#自定义action方法)
:::


## 其他方法
方法 | 参数 | 返回 | 描述
------ | ---------- | ------- | -----------
**getHelper** | *String* | *Function* | 获取helper函数
**getHelperList** | | *Array[String]* | 获取helper函数名称列表
**getPartial** | *String* | *String* | 通过名称获取handlebars partial
**getPartialList** | | *Array[String]* | 获取partial名称列表
**getActionType** | *String* | *[CustomAction](#函数定义-自定义action)* | 通过名称获取action 类型
**getActionTypeList** | | *Array[String]* | 获取actionType名称列表
**setWelcomeMessage** | *String* | | 自定义运行`plop`时提示选择generator的提示标语
**getGenerator** | *String* | *[GeneratorConfig](#interface-generatorconfig)* | 根据名称获取[GeneratorConfig](#interface-generatorconfig)
**getGeneratorList** | | *Array[Object]* | 获取generator名称和描述的列表
**setPlopfilePath** | *String* | |更改内部用于定位资源和模板文件的`plopfilePath`值
**getPlopfilePath** | | *String* | 返回plopfile的绝对路径
**getDestBasePath** | | *String* | 获取创建文件的基准路径
**setDefaultInclude** | *Object* | *Object* | 设置当被其他文件使用 `plop.load()`载入时的默认设置
**getDefaultInclude** | *String* | *Object* | 获取当被其他文件使用 `plop.load()`载入时的默认设置
**renderString** | *String, Object* | *String* |使用handlebars渲染第一个参数(*String*)的模板，第二个参数(*Object*)作为渲染模板的数据
