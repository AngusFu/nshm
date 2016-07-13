
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var yargs = require('yargs');

var cmdSource = require('./data.json');
var cmdSrcKeys = Object.keys(cmdSource);

var argvs = Array.from(process.argv).slice(2);

// 提取参数
var tmplRegex = /\$\{([a-zA-Z0-9]+)\}/gm;
var cmdName = argvs[0];
var appName = argvs[1];
var params = [];
var cmd;

/**
 * ======================================================================
 */
var dataPath = path.resolve(__dirname, 'data.json');
var argv = null;

/**
 * get version num
 */
if (cmdName === '-v' || cmdName === '--version') {
    console.log(require('../package.json').version);
}

/**
 * add new source
 *   > nshm add git -f ./c.sh
 *   > nshm add commit -t 'git add . -A && git commit ...'
 */

if (cmdName === 'add') {
    if (!appName)  {
        console.warn('Usage: nshm add [commandName] [-f|-t] [source]'.red);
        return;
    };

    argv = yargs.alias('f', 'file').alias('t', 'text').argv;

    if (argv.file) {
        cmdSource[appName] = fs.readFileSync(path.resolve(process.cwd(), argv.file)).toString();
    }

    if (argv.text) {
        cmdSource[appName] = argv.text;
    }

    fs.writeFileSync(dataPath, JSON.stringify(cmdSource, null, 4));

    return;
}

/**
 * combo source(s)
 *   > nshm co git commit pull
 */
if (cmdName === 'co') {
    if (!appName)  {
        console.warn('Usage: nshm co [commandName] [source]'.red);
        return;
    };
    cmdSource[appName] = argvs.slice(2);
    fs.writeFileSync(dataPath, JSON.stringify(cmdSource, null, 4));
    return;
}


/**
 * rm source(s)
 *   > nshm rm git
 * 
 */
if (cmdName === 'rm') {
    if (!appName)  {
        console.warn('Usage: nshm rm [commond] [commond] [...]'.red);
        return;
    };

    argvs.slice(1).forEach(function(item) {
        delete cmdSource[item];
    });
    fs.writeFileSync(dataPath, JSON.stringify(cmdSource, null, 4));
    return;
}

/**
 * rm source(s)
 *   > nshm clean
 */
if (cmdName === 'clean') {
    fs.writeFileSync(dataPath, '{}');
    cmdSource = null;
    cmdSrcKeys = null;
    return;
}

/**
 * list all sources
 *   > nshm ls
 */
if (cmdName === 'ls') {
    if (argvs[1] === '-a') {
        console.log(JSON.stringify(cmdSource, null, 4));
    } else {
        console.log(JSON.stringify(cmdSrcKeys, null, 4));
    }
    return;
}




/**
 * ======================================================================
 */

/**
 * 
 * 定义规则
 *
 * 如果`cmd`是字符串 则认为是命令
 *     e.g.: "pull": "git pull"
 * 如果是数组 则认为是其他命令集合
 *     e.g.: "git": ["commit", "pull"]
 * 
 */
if (cmd = cmdSource[cmdName]) {

    if (Array.isArray(cmd)) {
        cmd = getCmdTmpl(cmd, cmdSource);    
    }

    params = getMatchGroup(cmd, tmplRegex);
} else (!cmd) {
    // 如果连命令名称都不输入 或者命令名称输入错误
    console.error('\nError: your command name is INVALID\n'.red);
}

// 提示文字
var usageText = params.reduce(function(accu, item) {
    return `${accu} --${item} [${item}..] `;
}, 'Usage: nshm <cmdName> ');

if (!cmd || !cmdName) {
    params.unshift('cmdName');
}
 
// yargs 初始化
argv = yargs
    .usage(usageText)
    .demand(params)
    .choices('cmdName', cmdSrcKeys)
    .argv;

writeCommand(cmdName, cmdSource, argv);
console.log('done!!');

/**
 * ============================================================================
 */
/**
 * 
 * 从字符串中捕获匹配的第一个组的集合
 * 
 * @param  {String} mString 要处理的字符串
 * @param  {RegExp} regex   正则表达式
 * @return {Array}
 * 
 */
function getMatchGroup(mString, regex) {
    var temp;
    var result = [];

    while (temp = regex.exec(mString)) {
        result.push(temp[1]);
    }

    return result;
}

/**
 * 
 * 获取命令字符串
 * 
 * @param  {String|Array} cmd
 * @param  {Object}       cmdSource
 * @return {String}
 * 
 */
function getCmdTmpl(cmd, cmdSource) {
    var temp = '';

    if (typeof cmd === 'string') {
        return cmd;
    }

    return cmd.reduce(function(accu, item) {
        return accu + '\n\n' + getCmdTmpl(cmdSource[item] || item, cmdSource);
    }, '');
}


/**
 *
 * 替换掉模板
 * 写入文件
 * 
 */
function writeCommand(name, cmdSource, argv) {
    var cmd = cmdSource[name];
    var cmdText = '';

    if (Array.isArray(cmd)) {
        
        cmd.forEach(function(item) {
            writeCommand(item, cmdSource);
        });

        return;
    }

    cmdText = (cmdSource[name] || name).replace(tmplRegex, function(m, g1) {
        return argv[g1];
    });

    fs.writeFileSync(`./${name}.sh`, cmdText, 'utf-8');

}
