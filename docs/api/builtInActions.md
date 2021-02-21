# 内置actions

你可以在[GeneratorConfig](/api/plopfile.html#接口-generatorconfig)中通过设置action的`type`属性以及模板名称(路径均为plopfile的相对路径)来使用内置的action。

::: tip
`Add`, `AddMany`和`Modify`actions有一个可选方法`transform`，它可以在模板渲染结果被写入文件之前对结果做出修改。`transform`方法接受字符串类型的文件内容或许安然结果作为参数，同时必须返回一个字符串或者字符串Promise。
:::

## Add
正如其字面意思，`add`action会想你的项目中添加一个问题件。Path参数将会被传入handlebars作为渲染的目标文件名字。文件内容则取决于`template`或 `templateFile` 属性。

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**path** | *String* | | 渲染结果的目标位置
**template** | *String* | | 渲染使用的模板名称
**templateFile** | *String* | | 使用的模板路径
**skipIfExists** | *Boolean* | `false` | 当文件已经存在的时候直接跳过（而不是失败）
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**force** | *Boolean* | `false` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)* (如果文件存在将直接覆盖)
**data** | *Object* | `{}` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*

## AddMany

`addMany`action可以在一个action中向项目添加多个文件。`destination`属性为生成文件的目标文件夹，`base`属性可以用于更改创建文件时需要忽略的文件路径。如果你需要生成特定文件名的文件，你可以在`templateFiles`属性处使用handlebars语法，例如“` { { dashCase name } }.spec.js `” 

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**destination** | *String* | | 渲染结果文件的目标文件夹
**base** | *String* | | 向destination中写入文件㤇被排除的文件路径
**templateFiles** | *[Glob](https://github.com/sindresorhus/globby#globbing-patterns)* | | 用于匹配需要添加的模板
**stripExtensions** | *[String]* | `['hbs']` | 模板文件的后缀名
**globOptions** | *[Object](https://github.com/sindresorhus/globby#options)* | | 改变模板文件匹配方法的glob选项
**verbose** | *Boolean* | `true` | 输出成功添加的文件路径
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**skipIfExists** | *Boolean* | `false` | *继承自[Add](#add)* 当文件已经存在的时候直接跳过（而不是失败）
**force** | *Boolean* | `false` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)* (如果文件存在将直接覆盖)
**data** | *Object* | `{}` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*

## Modify

`modify`action有两种使用方法，你可以使用`pattern`属性来匹配并替换在`path`中指定的文件，同时你可以使用`transform`方法来修改文件内容。`pattern`和 `transform`可以同时使用（`transform`后执行）。更多细节可以查看官方example

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**path** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**pattern** | *RegExp* | _end&#x2011;of&#x2011;file_ | 用以匹配和替换的正则表达式
**template** | *String* | | 模板中需要被匹配替换的内容，可以使用$1, $2等等作为占位符
**templateFile** | *String* | | 包含`template`的文件路径
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**data** | *Object* | `{}` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*

## Append
`append` action 是更常用的`modify`的子集。 他可以在文件的特定位置插入内容。

属性 | 类型 | 默认值 | 描述
-------- | ------ | ------- | -----------
**path** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**pattern** | *RegExp, String* | | 用以匹配和替换的正则表达式
**unique** | *Boolean* | `true` | 相同内容是否需要被移除 
**separator** | *String* | `new line` | 分隔条目的值
**template** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**templateFile** | *String* | | 包含`template`的文件路径
**data** | *Object* | `{}` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](/api/plopfile.html#接口-actionconfig)*

::: warning
此处文档翻译有待推敲，欢迎提出pr进行修正和补充
:::

## 自定义Action方法
`Add`和`Modify`几乎可以完成plop设计的所有功能，不过plop也提供了更加进阶的自定义action方法。在actions数组中填入自定义的action函数即可使用这一功能。
- 自行以action在执行时与官方action使用相同的[函数接口](/api/plopfile.html#函数定义-自定义action)
- Plop会等待自定义action方法执行完毕后才会继续执行下一个action
- 函数必须返回一个Plop可以理解的确切值，如果返回了一个`promise`，那么在这个promise完成之前plop不会进行任何操作。如果函数返回了一个字符串类型的消息(*String*), plop便可得知action已经成功执行，并将此信息输出到action的状态提示信息上。
- 当返回的promise被reject，会程序抛出了一个异常，plop会视为action执行失败

_你也可以查看官方提供的 [同步自定义action案例](https://github.com/amwmedia/plop/blob/master/example/plopfile.js)_

## Comments
通过添加一个字符串来代替 action config 对象，可以将注释行添加到 actions 数组中。当plop执行这一action时，注释就会被打印到屏幕上，这一action本身不会进行其他任何操作。
