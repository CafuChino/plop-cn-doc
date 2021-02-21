# 进阶使用

以下是一些常见的进阶用法

## 使用动态构建的actions数组
[GeneratorConfig](/api/plopfile.html#接口-generatorconfig)的`actions`属性可以是一个函数，他接受answers作为传入参数并且返回actions数组，这使你可以根据输入的答案动态调整actions数组

``` javascript
module.exports = function (plop) {
	plop.setGenerator('test', {
		prompts: [{
			type: 'confirm',
			name: 'wantTacos',
			message: 'Do you want tacos?'
		}],
		actions: function(data) {
			var actions = [];

			if(data.wantTacos) {
				actions.push({
					type: 'add',
					path: 'folder/{{dashCase name}}.txt',
					templateFile: 'templates/tacos.txt'
				});
			} else {
				actions.push({
					type: 'add',
					path: 'folder/{{dashCase name}}.txt',
					templateFile: 'templates/burritos.txt'
				});
			}

			return actions;
		}
	});
};
```

## 向社区第三方Prompt直接传入数据

如果你编写了一个inquirer问题插件，并想要提供plop支持，实现起来很简单。你只需要为你的问题插件导出对象添加一个`bypass`方法。这一方法会被plop执行，执行时传入的第一个参数为用户的输入，第二个参数为prompt设置对象。这个函数的返回值会被作为该问题的答案保存到data对象中。

``` javascript
// My confirmation inquirer plugin
module.exports = MyConfirmPluginConstructor;
function MyConfirmPluginConstructor() {
	// ...your main plugin code
	this.bypass = (rawValue, promptConfig) => {
		const lowerVal = rawValue.toString().toLowerCase();
		const trueValues = ['t', 'true', 'y', 'yes'];
		const falseValues = ['f', 'false', 'n', 'no'];
		if (trueValues.includes(lowerVal)) return true;
		if (falseValues.includes(lowerVal)) return false;
		throw Error(`"${rawValue}" is not a valid ${promptConfig.type} value`);
	};
	return this;
}
```
> 在这个案例中，函数将用户输入解析为布尔值并存入data对象中

### 直接在plopfile中提供直接传入参数支持
如果你的第三方插件不支持直接传入参数，你可以直接在你的问题设置对象中加入`bypass`方法，plop会自动将其用于解析参数。

## 对Plop进行包装

Plop额外提供了很多非常强大的功能，你甚至可以基于这些功能对`plop`进行进一步的包装，将其打包成你自己的cli。你只需要一个`plopfile.js`，一个`package.json`，和一个用于参考的模板文件。

你可以这样编写你的`index.js`:

```javascript
#!/usr/bin/env node
const path = require('path');
const args = process.argv.slice(2);
const {Plop, run} = require('plop');
const argv = require('minimist')(args);

Plop.launch({
  cwd: argv.cwd,
  // In order for `plop` to always pick up the `plopfile.js` despite the CWD, you must use `__dirname`
  configPath: path.join(__dirname, 'plopfile.js'),
  require: argv.require,
  completion: argv.completion
// This will merge the `plop` argv and the generator argv.
// This means that you don't need to use `--` anymore
}, env => run(env, undefined, true));
```

> 如果你选择了`env => run(env, undefined, true))`写法，你可能会在直接传入参数时
>遇到指令执行问题
>
> 如果你想放弃使用这一特性而使用类似plop使用的方法 (需要在向generator传入参数之前加上`--`)
> 只要将箭头函数`env =>`替换成`run`即可:
>
>```javascript
>Plop.launch({}, run);
>```

你的 `package.json` 可能将会类似如下格式:

```json
{
  "name": "create-your-name-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "plop",
  },
  "bin": {
    "create-your-name-app": "./index.js"
  },
  "preferGlobal": true,
  "dependencies": {
    "plop": "^2.6.0"
  }
}
```

### 为你的自定义程序设定基准路径

当进一步打包plop时，你可能需要基于命令行执行cwd生成目标路径，你可以这样设置基准路径`dest`：


```javascript
Plop.launch({
	// config like above
}, env => {
	const options = {
		...env,
		dest: process.cwd() // this will make the destination path to be based on the cwd when calling the wrapper
	}
	return run(options, undefined, true)
})
```

### 添加自动CLI Actions

许多CLI都会自动帮你进行某些人物,比如说项目生成完成后自动运行 `git init` 或 `npm install`

这些操作非常普遍，但是我们处于保持核心功能简洁的目的并没有默认添加。即便如此，我们维护了一个 [功能集](https://github.com/plopjs/awesome-plop)来方便用户在使用Plop时方便的提供这些功能。你可以在这里寻找你需要的action，或者将你编写的action添加到这个列表。

### 更加进阶的自定义

虽然`plop`已经提供了高度可自定义的CLI包装支持，但也可能有些场景下你可能需要在借助模板代码生成功能的基础上更进一步的掌控CLI工作体验。

幸运的是, [`node-plop`](https://github.com/plopjs/node-plop/) 可能更适合你! `plop` CLI本身就是基于此构建的你可以基于此构建其他功能更加丰富的CLI。只是这部分的文档可能有待更进一步的完善，不过风险往往与机会并存 :)

>我们注意到关于`node-plop` 集成的乏善可陈的文档可能是我们的一项短板。如果您希望为项目贡献文档，欢迎您积极参与进来！