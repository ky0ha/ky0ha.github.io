"use strict"
const account = 1842562759

let MyConf = {
    /** 日志等级，默认info (往屏幕打印日志会降低性能，若消息量巨大建议修改此参数或重定向) */
    log_level: "info",
    /** 1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad */
    platform: 5
}

// 库的调用，oicq 为 qq 的 api 库，mysql 为 js 连接 mysql 的库，string-format 为字符串的 format 库
// string-format 库的存在意义已经被反单引号所替代，可以全部将 format 替换为反单引号表达
const bot = require("oicq").createClient(account, MyConf)
var mysql = require('mysql');
var format = require("string-format");

// 无意义，定义连接的格式
let connection = mysql.createConnection({
    host: '121.199.62.144',
    user: 'root',
    password: 'Sh123456!',
    database: 'pixiv',
    multipleStatements: true
});

// 登录监听
bot.on("system.login.qrcode", function(e) {
        this.logger.mark("扫码后按Enter完成登录") //通过扫码二维码登录
        process.stdin.once("data", () => {
            this.login()
        })
    })
    .on("system.login.error", function(e) {
        if (e.code < 0)
            this.login()
    })
    .login()

exports.bot = bot

// 从数据库读取并初始化配置信息，主要为五个读取函数：ctl_command、interaction_command、group_whitelist、admin_list、reply_msg
function get_ctl_command() {
    // 读取控制指令的信息
    let connection = mysql.createConnection({
        host: 'www.xysama.cn',
        user: 'root',
        password: 'Sh123456!',
        database: 'pixiv',
        multipleStatements: true
    });

    connection.connect();
    connection.query('SELECT * from ctl_command', function(error, results, fields) {
        if (error) throw error;
        for (let i in results) {
            ctl_command[results[i]['title']] = {
                title: results[i]['title'],
                create_time: results[i]['create_time'],
                describe: results[i]['describe'],
                help: results[i]['help'],
                permit: results[i]['permit']
            }
        }
    });
    connection.end();
}

function get_interaction_command() {
    // 读取交互指令的信息并更新禁止复读词汇表 ban_word
    let connection = mysql.createConnection({
        host: 'www.xysama.cn',
        user: 'root',
        password: 'Sh123456!',
        database: 'pixiv',
        multipleStatements: true
    });

    connection.connect();
    connection.query('SELECT * from interaction_command', function(error, results, fields) {
        if (error) throw error;
        for (let i in results) {
            interaction_command[results[i]['title']] = {
                title: results[i]['title'],
                create_time: results[i]['create_time'],
                describe: results[i]['describe'],
                help: results[i]['help'],
                permit: results[i]['permit']
            }
            ban_word.push(results[i]['title']);
        }
    });
    connection.end();
}

function get_group_whitelist() {
    // 读取群白名单信息
    let connection = mysql.createConnection({
        host: 'www.xysama.cn',
        user: 'root',
        password: 'Sh123456!',
        database: 'pixiv',
        multipleStatements: true
    });

    connection.connect();
    connection.query('SELECT * from group_whitelist', function(error, results, fields) {
        if (error) throw error;
        for (let i in results) {
            group_whitelist[results[i]['group_id']] = {
                'group_name': results[i]['group_name'],
                'unable_message': '',
                'first_message': '',
                'is_repeating': false
            }
            repeater_group_id.push(results[i]['group_id']);
        }
    });
    connection.end();
}

function get_admin_list() {
    // 读取管理员信息
    let connection = mysql.createConnection({
        host: 'www.xysama.cn',
        user: 'root',
        password: 'Sh123456!',
        database: 'pixiv',
        multipleStatements: true
    });

    connection.connect();
    connection.query('SELECT * from admin_list', function(error, results, fields) {
        if (error) throw error;
        for (let i in results) {
            admin_list[0].push(results[i]['user_id']);
            admin_list[1].push(results[i]['user_name'])
        }
    });
    connection.end();
}

function get_reply_msg(){
    // 读取回复功能的回复触发词信息
    let connection = mysql.createConnection({
        host: 'www.xysama.cn',
        user: 'root',
        password: 'Sh123456!',
        database: 'pixiv',
        multipleStatements: true
    });
    
    connection.connect();
    connection.query('select distinct question from reply;', function(error, results, fields) {
        if (error) throw error;
        for (let i in results) {
            reply_msg.push(results[i]['question'])
        }
    });
    connection.end();
}

// 在初始化之前先对其进行一个 var 声明
var reply_msg = [];
var ban_word = [];
var repeater_group_id = [];
var admin_list = [
    [],
    []
];
var ctl_command = {}
var interaction_command = {}
var group_whitelist = {}

// 运行初始化函数
get_admin_list();
get_ctl_command();
get_group_whitelist();
get_interaction_command();
get_reply_msg();

function is_same(msg1, msg2) {
    // 判断两个 MessageElem 是否相同，用于判断复读条件
    var flag = true;
    for (let index = 0; index < Math.max(msg1.length, msg2.length); index++) {
        // 以两个 MessageElem 中长度最大的长度作为遍历长度，当某个长度比另一个长度小的时候会取到 msg[index] 为 undefined
        if (msg1[index] != undefined && msg2[index] != undefined && msg1[index]['type'] === msg2[index]['type']) {
            // 使用短路判断避免取到 undefined['type'] 而导致程序报错，也可以使用 undefined?.type 避免这种情况，但是此处没有必要
            switch (msg1[index]['type']) {
                case 'text':
                    flag = msg1[index]['text'] === msg2[index]['text'] ? true : false;
                    break;
                case 'image':
                    flag = msg1[index]['file'] === msg2[index]['file'] ? true : false;
                    break;
                case 'json':
                    flag = msg1[index]['data'] === msg2[index]['data'] ? true : false;
                    break;
                case 'face':
                    flag = msg1[index]['id'] === msg2[index]['id'] ? true : false;
                    break;
                default:
                    flag = false;
                    break;
            }
        } else {
            flag = false;
            return flag;
        }
        if (flag === false) {
            return flag;
        }
    }
    return flag;
}
bot.on('message', function(e) {
    // 复读的判断监听
    if (e.message_type === 'group' && repeater_group_id.includes(e.group_id)) {
        // 当接收到的消息为群组消息，并且对应群组在群白名单内进行消息复读的判断
        if (group_whitelist[e.group_id]['is_repeating'] === false) {
            group_whitelist[e.group_id]['first_message'] = e.message;
            if (e.message != group_whitelist[e.group_id]['unable_message']) {
                group_whitelist[e.group_id]['is_repeating'] = true;
            }
        } else if (group_whitelist[e.group_id]['is_repeating'] === true && !ban_word.includes(e.raw_message) && !reply_msg.includes(e.raw_message)) {
            bot.emit('repeater', e);
        }
    }
})

// bot.on('message', function(e) {
//     if (e.raw_message === 'test1') {
//         e.reply([
//             { type: 'text', text: '1' },
//             { type: 'face', id: 14, text: '微笑' },
//             { type: 'text', text: '2' }
//           ]
//           )
//     }
//     if (e.raw_message === 'test2') {
//         e.reply([{ type: 'text', text: '1' },{ type: 'face', id: 14, text: '微笑' },{ type: 'text', text: '2' }])
//     }
// })

bot.on('repeater', function(e) {
    // 自动复读功能的监听，监听是否满足自动复读条件，当满足时触发该事件
    if (is_same(e.message, group_whitelist[e.group_id]['first_message']) && !(is_same(e.message, group_whitelist[e.group_id]['unable_message']))) {
        e.reply(e.message);
        group_whitelist[e.group_id]['unable_message'] = group_whitelist[e.group_id]['first_message'];
        group_whitelist[e.group_id]['first_message'] = '';
    } else {
        group_whitelist[e.group_id]['first_message'] = e.message;
    }
})

// // 调用事件库 events
// var events = require('events');
// var eventEmitter = new events.EventEmitter();
// 创建删除图片成功或失败的两个事件监听，原本使用到这两个监听的在下面被注释掉的函数 del_sql 内，现在已经失去意义
// eventEmitter.on('deleted', function(e) {
//     e.reply("删除图片成功 ！(^_−)☆");
// })
// eventEmitter.on('faild', function(e, err) {
//     e.replay("删除失败 o(╥﹏╥)o ： [DELETE ERROR] - " + err);
// })

// function del_sql(pid, e) {
//     let connection = mysql.createConnection({
//         host: '121.199.62.144',
//         user: 'root',
//         password: 'Sh123456!',
//         database: 'pixiv',
//         multipleStatements: true
//     });
//     connection.connect();
//     var sql_command = 'delete from info where pid=' + pid + ';alter table info drop id;alter table info add id int unsigned not null first;alter table info modify column id int unsigned not null auto_increment, add primary key( id );'
//     connection.query(sql_command, function(err, result) {
//         if (err) {
//             console.log('[DELETE ERROR] - ', err.message);
//             eventEmitter.emit('faild', e, err.message);
//             return;
//         }
//         eventEmitter.emit('deleted', e);
//     });
//     connection.end();
// }

bot.on('message', function(e) {
    // 命令的监听，监听控制命令（需要 @bot 的命令）和直接触发的交互命令
    // console.log(e.message);
    // console.log(e.raw_message);
    if (e.message[0]['type'] === 'at' && e.message[0]['qq'] === account) {
        // 以下为控制命令，分为是否为 bot 管理员两种
        if (e.message[1] === undefined) {
            e.reply("不要乱@我qwq，我的@是有用的 (•́へ•́╬)");
        } else {
            switch (e.message[1]['type']) {
                case 'text':
                    var msg_command = e.message[1]['text'].split(' ');
                    if (msg_command[0] === '') {
                        msg_command = msg_command.slice(1);
                    }
                    if (admin_list[0].includes(e.user_id)) {
                        switch (msg_command[0]) {
                            case "删除图片":
                                switch (msg_command[1]) {
                                    case undefined:
                                        e.reply("不是这样用滴~ 使用：@bot 删除图片 -h，查看使用方法");
                                        break;
                                    case '-h':
                                        e.reply(format("使用方法：{}", ctl_command['删除图片']['help']));
                                        break;
                                    default:
                                        if (/^ *\d+$/.test(msg_command[1])) {
                                            let sql_command = 'delete from info where pid=' + msg_command[1] + ';alter table info drop id;alter table info add id int unsigned not null first;alter table info modify column id int unsigned not null auto_increment, add primary key( id );'
                                            let connection = mysql.createConnection({
                                                host: '121.199.62.144',
                                                user: 'root',
                                                password: 'Sh123456!',
                                                database: 'pixiv',
                                                multipleStatements: true
                                            });
                                            connection.connect();
                                            connection.query(sql_command, function(error, results, fields){
                                                if (error){
                                                    e.reply(`删除失败！原因：${error}`);
                                                } else {
                                                    if (results[0]['affectedRows'] != 0) {
                                                        e.reply(`删除图片(${msg_command[1]})成功 ！(^_−)☆`);
                                                    } else {
                                                        e.reply(`⊙(・◇・)？奇怪？好像没有pid为${msg_command[1]}的图片哎？`);
                                                    }
                                                }
                                            });
                                            connection.end();
                                        } else {
                                            e.reply("指定的图片pid必须为数字")
                                        }
                                        break;
                                }
                                break;
                            case "禁言":
                                switch (e.message[2]?.type) {
                                    case 'at':
                                        try {
                                            if (/^ *\d+(\.\d+)? *$/.test(parseInt(e.message[3]['text'].replace(/ /g, '')))) {
                                                if (parseInt(e.message[3]['text'].replace(/ /g, '')) >= 1) {
                                                    if (info['role'] != 'member') {
                                                        bot.getGroupMemberInfo(e.group_id, e.message[2]['qq']).then(function(target) {
                                                            if (/^ *\d+(\.\d+)? *$/.test(e.message[3]['text'])) {
                                                                switch (target['role']) {
                                                                    case 'owner':
                                                                        e.reply("？！我可不敢禁言群主 !!!∑(ﾟДﾟノ)ノ");
                                                                        break;
                                                                    case 'admin':
                                                                        e.reply(format("管理员之间可没法相互禁言 (눈‸눈)"));
                                                                        break;
                                                                    default:
                                                                        if (parseInt(msg_command[1]) < 1) {
                                                                            e.reply("禁言单次下限时间为1分钟 (。-ω-)zzz")
                                                                        } else {
                                                                            bot.setGroupBan(e.group_id, e.message[2]['qq'], parseInt(e.message[3]['text'].replace(/ /g, '')) * 60);
                                                                            e.reply(format("成功禁言 {}({}) {}分钟 (✪ω✪)", e.message[2]['text'], e.message[2]['qq'], e.message[3]['text']));
                                                                        }
                                                                        break;
                                                                }
                                                            } else {
                                                                e.reply(format("格式错误！格式为：{} o(´^｀)o", ctl_command['禁言']['help']));
                                                            }
                                                        });
                                                    } else {
                                                        e.reply("机器人权限不足，当前权限等级为" + info['role'] + " (〃＞＿＜;〃)");
                                                    }
                                                } else {
                                                    e.reply("时间必须是正数而且要大于1哦~");
                                                }
                                            } else {
                                                e.reply("时间长度必须是数字，单位是分钟哦~");
                                            }
                                        } catch (TypeError) {
                                            e.reply(format("格式错误！格式为：{} o(´^｀)o", ctl_command['禁言']['help']));
                                        }
                                        break;
                                    case undefined:
                                        if (msg_command[1] === '-h') {
                                            e.reply(format("使用方法：{}", ctl_command['禁言']['help']));
                                        }
                                        break;
                                    default:
                                        e.reply("不是这样用滴~ 使用：@bot 禁言 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case "解除禁言":
                                switch (e.message[2]?.type) {
                                    case 'at':
                                        bot.setGroupBan(e.group_id, e.message[2]['qq'], 0);
                                        e.reply(format("成功解除 {}({}) 的禁言 (*^▽^*)", e.message[2]['text'], e.message[2]['qq']));
                                        break;
                                    case undefined:
                                        if (msg_command[1] === '-h') {
                                            e.reply(format("使用方法：{}", ctl_command['解除禁言']['help']));
                                        }
                                        break;
                                    default:
                                        e.reply("不是这样用滴~ 使用：@bot 解除禁言 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case "查看帮助":
                                let show_msg = ''
                                switch (msg_command[1]) {
                                    case 'command':
                                        show_msg = "控制命令："
                                        for (let key in ctl_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}\n", ctl_command[key]['title'], ctl_command[key]['describe'], ctl_command[key]['help'], ctl_command[key]['create_time'], ctl_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case 'interaction':
                                        show_msg = "交互命令："
                                        for (let key in interaction_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}\n", interaction_command[key]['title'], interaction_command[key]['describe'], interaction_command[key]['help'], interaction_command[key]['create_time'], interaction_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case undefined:
                                        show_msg = "交互命令：";
                                        for (let key in interaction_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}：\n", interaction_command[key]['title'], interaction_command[key]['describe'], interaction_command[key]['help'], interaction_command[key]['create_time'], interaction_command[key]['permit']);
                                        }
                                        show_msg += "\n控制命令:"
                                        for (let key in ctl_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}：\n", ctl_command[key]['title'], ctl_command[key]['describe'], ctl_command[key]['help'], ctl_command[key]['create_time'], ctl_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case '-h':
                                        e.reply(format("使用方法：{}", ctl_command['查看帮助']['help']));
                                        break;
                                    default:
                                        e.reply("不是这样用滴~使用：@bot 查看帮助 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case '群白名单':
                                switch (msg_command[1]) {
                                    case undefined:
                                        e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        break;
                                    case '-h':
                                        e.reply(`使用方法：${ctl_command['群白名单']['help']}\n${ctl_command['群白名单']['describe']}`);
                                        break;
                                    case '-ls':
                                        let show_msg = `群白名单：`;
                                        for (let i in group_whitelist){
                                            show_msg += `\n-- ${group_whitelist[i]['group_name']} (${i})`
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case '-a':
                                        if (/^\d*$/.test(msg_command[2])){
                                            bot.getGroupInfo(parseInt(msg_command[2])).then(function(info) {
                                                let connection = mysql.createConnection({
                                                    host: '121.199.62.144',
                                                    user: 'root',
                                                    password: 'Sh123456!',
                                                    database: 'pixiv',
                                                    multipleStatements: true
                                                });
                                                connection.connect();
                                                connection.query(`insert into \`group_whitelist\` (\`group_id\`, \`group_name\`) values ('${info['group_id']}', '${info['group_name']}')`, function(error, results, fields){
                                                    if (error){
                                                        e.reply(`写入失败！原因：${error}`);
                                                    } else {
                                                        group_whitelist[info['group_id']] = info['group_name'];
                                                        e.reply(`写入群 ${info['group_name']}（${info['group_id']}） 成功！`);
                                                    }
                                                });
                                                connection.end();
                                            })
                                        } else {
                                            e.reply('为什么你的群号不是数字哎？');
                                        }
                                        break;
                                    case '-rm':
                                        if (/^\d*$/.test(msg_command[2])){
                                            let connection = mysql.createConnection({
                                                host: '121.199.62.144',
                                                user: 'root',
                                                password: 'Sh123456!',
                                                database: 'pixiv',
                                                multipleStatements: true
                                            });
                                            connection.connect();
                                            connection.query(`delete from group_whitelist where group_id=${msg_command[2]}`, function(error, results, fields){
                                                if (error){
                                                    e.reply(`删除失败！原因：${error}`);
                                                } else {
                                                    delete group_whitelist[msg_command];
                                            e.reply(`删除群 ${info['group_name']}（${info['group_id']}） 成功！`);
                                                }
                                            });
                                            connection.end();
                                        } else {
                                            e.reply('为什么你的群号不是数字哎？');
                                        }
                                        break;
                                    case '-update':
                                        if (/^\d*$/.test(msg_command[2]) && /^\d*$/.test(msg_command[3])){
                                            bot.getGroupInfo(parseInt(msg_command[3])).then(function(info) {
                                                let connection = mysql.createConnection({
                                                    host: '121.199.62.144',
                                                    user: 'root',
                                                    password: 'Sh123456!',
                                                    database: 'pixiv',
                                                    multipleStatements: true
                                                });
                                                connection.connect();
                                                connection.query(`update group_whitelist set group_id=${msg_command[3]}, group_name='${info['group_name']}' where group_id=${msg_command[2]}`, function(error, results, fields){
                                                    if (error){
                                                        e.reply(`写入失败！原因：${error}`);
                                                    } else {
                                                        group_whitelist[info['group_id']] = info['group_name'];
                                                        e.reply(`写入群 ${info['group_name']}（${info['group_id']}） 成功！`);
                                                    }
                                                });
                                                connection.end();
                                            })
                                        } else {
                                            e.reply('为什么你的群号不是数字哎？或者说你忘了要两个群号？');
                                        }
                                        break;
                                    default:
                                        e.reply("不是这样用滴~使用：@bot 群白名单 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case '管理员':
                                switch (msg_command[1]) {
                                    case undefined:
                                        e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        break;
                                    case '-h':
                                        e.reply(`使用方法：${ctl_command['管理员']['help']}\n${ctl_command['管理员']['describe']}`);
                                        break;
                                    case '-ls':
                                        let show_msg = `管理员名单：`;
                                        for (let i = 0; i < admin_list[0].length; i++) {
                                            show_msg += `\n--${admin_list[1][i]}（${admin_list[0][i]}）`;
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case '-a':
                                        if (e.message[2]?.type === 'at'){
                                            bot.getGroupMemberInfo(e.group_id, e.message[2]['qq']).then(function(info) {
                                                let connection = mysql.createConnection({
                                                    host: '121.199.62.144',
                                                    user: 'root',
                                                    password: 'Sh123456!',
                                                    database: 'pixiv',
                                                    multipleStatements: true
                                                });
                                                connection.connect();
                                                connection.query(`insert into \`admin_list\` (\`user_id\`, \`user_name\`) values ('${info['user_id']}', '${info['nickname']}')`, function(error, results, fields){
                                                    if (error){
                                                        e.reply(`写入失败！原因：${error}`);
                                                    } else {
                                                        admin_list[0].push(info['user_id']);
                                                        admin_list[1].push(info['nickname']);
                                                        e.reply(`写入管理员 ${info['nickname']}（${info['user_id']}） 成功！`);
                                                    }
                                                });
                                                connection.end();
                                            });
                                           } else {
                                            e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        }
                                        break;
                                    case '-rm':
                                        if (e.message[2]?.type === 'at'){
                                            let connection = mysql.createConnection({
                                                host: '121.199.62.144',
                                                user: 'root',
                                                password: 'Sh123456!',
                                                database: 'pixiv',
                                                multipleStatements: true
                                            });
                                            connection.connect();
                                            connection.query(`delete from admin_list where user_id=${e.message[2]['qq']}`, function(error, results, fields){
                                                if (error){
                                                    e.reply(`删除失败！原因：${error}`);
                                                } else {
                                                    for (let index = 0; index < admin_list[0].length; index++) {
                                                        if (admin_list[0][index] == e.message[2]['qq']){
                                                            e.reply(`删除管理员 ${admin_list[1][index]}（${admin_list[0][index]}） 成功！`);
                                                            delete admin_list[0][index];
                                                            delete admin_list[1][index];
                                                            break;
                                                        }
                                                    }
                                                }
                                            });
                                            connection.end();
                                        } else {
                                            e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        }
                                        break;
                                    default:
                                        e.reply("不是这样用滴~使用：@bot 管理员 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case "回复":
                                switch (msg_command[1]) {
                                    case '-h':
                                        e.reply(`使用方法：${ctl_command['回复']['help']}\n${ctl_command['回复']['describe']}`);
                                        break;
                                    case '-a':
                                        if (msg_command[2] != undefined && msg_command[2] != ''){
                                            if (msg_command[3] != undefined && msg_command[3] != ''){
                                                bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                    let connection = mysql.createConnection({
                                                        host: '121.199.62.144',
                                                        user: 'root',
                                                        password: 'Sh123456!',
                                                        database: 'pixiv',
                                                        multipleStatements: true
                                                    });
                                                    connection.connect();
                                                    connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${msg_command[3]}','text','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                        if (error){
                                                            e.reply(`添加失败！原因：${error}`);
                                                        } else {
                                                            e.reply(`٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => ${msg_command[3]}`);
                                                            reply_msg.push(msg_command[2]);
                                                        }
                                                    });
                                                    connection.end();
                                                });
                                            } else {
                                                switch (e.message[2]?.type) {
                                                    case 'image':
                                                        bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                            let connection = mysql.createConnection({
                                                                host: '121.199.62.144',
                                                                user: 'root',
                                                                password: 'Sh123456!',
                                                                database: 'pixiv',
                                                                multipleStatements: true
                                                            });
                                                            connection.connect();
                                                            connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${e.message[2]['file']}','image','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                                if (error){
                                                                    e.reply(`添加失败！原因：${error}`);
                                                                } else {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    reply_msg.push(msg_command[2]);
                                                                }
                                                            });
                                                            connection.end();
                                                        });
                                                        break;
                                                    case 'face':
                                                        bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                            let connection = mysql.createConnection({
                                                                host: '121.199.62.144',
                                                                user: 'root',
                                                                password: 'Sh123456!',
                                                                database: 'pixiv',
                                                                multipleStatements: true
                                                            });
                                                            connection.connect();
                                                            connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${e.message[2]['id']}','face','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                                if (error){
                                                                    e.reply(`添加失败！原因：${error}`);
                                                                } else {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    reply_msg.push(msg_command[2]);
                                                                }
                                                            });
                                                            connection.end();
                                                        });
                                                        break;
                                                    default:
                                                        e.reply("格式错误或者回复消息的类型不支持（只支持图片、文字、表情）٩( 'ω' )و ")
                                                        break;
                                                }
                                            }
                                        }
                                        break;
                                    case '-rm':
                                        if (msg_command[2] != undefined && msg_command[2] != '') {
                                            if (msg_command[3] != undefined && msg_command[3] != '') {
                                                let connection = mysql.createConnection({
                                                    host: '121.199.62.144',
                                                    user: 'root',
                                                    password: 'Sh123456!',
                                                    database: 'pixiv',
                                                    multipleStatements: true
                                                });
                                                connection.connect();
                                                connection.query(`delete from reply where question='${msg_command[2]}' and answer='${msg_command[3]}'`, function(error, results, fields){
                                                    if (error){
                                                        e.reply(`删除失败！原因：${error}`);
                                                    } else {
                                                        e.reply(`٩( 'ω' )و 成功删除消息回复： ${msg_command[2]} => ${msg_command[3]}`);
                                                        for (let index = 0; index < reply_msg.length; index++) {
                                                            if (reply_msg[index] === msg_command[2]){
                                                                delete reply_msg[index];
                                                            }
                                                        }
                                                    }
                                                });
                                                connection.end();
                                            } else{
                                                switch (e.message[2]?.type) {
                                                    case 'image':
                                                        var connection = mysql.createConnection({
                                                            host: '121.199.62.144',
                                                            user: 'root',
                                                            password: 'Sh123456!',
                                                            database: 'pixiv',
                                                            multipleStatements: true
                                                        });
                                                        connection.connect();
                                                        connection.query(`delete from reply where question='${msg_command[2]}' and answer='${e.message[2]['file']}'`, function(error, results, fields){
                                                            if (error){
                                                                e.reply(`删除失败！原因：${error}`);
                                                            } else {
                                                                e.reply([
                                                                    {
                                                                        type: 'text',
                                                                        text: `٩( 'ω' )و 成功删除消息回复： ${msg_command[2]} => `
                                                                    },
                                                                    e.message[2]
                                                                ]);
                                                                for (let index = 0; index < reply_msg.length; index++) {
                                                                    if (reply_msg[index] === msg_command[2]){
                                                                        delete reply_msg[index];
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        connection.end();
                                                        break;
                                                    case 'face':
                                                        var connection = mysql.createConnection({
                                                            host: '121.199.62.144',
                                                            user: 'root',
                                                            password: 'Sh123456!',
                                                            database: 'pixiv',
                                                            multipleStatements: true
                                                        });
                                                        connection.connect();
                                                        connection.query(`delete from reply where question='${msg_command[2]}' and answer='${e.message[2]['id']}'`, function(error, results, fields){
                                                            if (error){
                                                                console.log(4);
                                                                e.reply(`删除失败！原因：${error}`);
                                                            } else {
                                                                e.reply([
                                                                    {
                                                                        type: 'text',
                                                                        text: `٩( 'ω' )و 成功删除消息回复： ${msg_command[2]} => `
                                                                    },
                                                                    e.message[2]
                                                                ]);
                                                                for (let index = 0; index < reply_msg.length; index++) {
                                                                    if (reply_msg[index] === msg_command[2]){
                                                                        delete reply_msg[index];
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        connection.end();
                                                        break;
                                                    default:
                                                        e.reply("格式错误或者回复消息的类型不支持（只支持图片、文字、表情）٩( 'ω' )و ")
                                                        break;
                                                }
                                            }
                                        }
                                        break;
                                    case '-find':
                                        if (msg_command[2] != undefined && msg_command[2] != ''){
                                            let show_msg = [
                                                {
                                                    type: 'text',
                                                    text: `消息 <${msg_command[2]}> 的回复消息为：`
                                                }
                                            ]
                                            let connection = mysql.createConnection({
                                                host: '121.199.62.144',
                                                user: 'root',
                                                password: 'Sh123456!',
                                                database: 'pixiv',
                                                multipleStatements: true
                                            });
                                            connection.connect();
                                            connection.query(`select * from reply where question='${msg_command[2]}'`, function(error, results, fields){
                                                if (error){
                                                    e.reply(`查询失败！原因：${error}`);
                                                } else {
                                                    for (let index = 0; index < results.length; index++) {
                                                        switch (results[index]['msg_type']) {
                                                            case 'text':
                                                                show_msg.push({
                                                                    type: 'text',
                                                                    text: `\n--<${results[index]['answer']}> 被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                });
                                                                break;
                                                            case 'image':
                                                                show_msg.push({
                                                                    type: 'image',
                                                                    file: results[index]['answer']
                                                                });
                                                                show_msg.push({
                                                                    type: 'text',
                                                                    text: `被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                });
                                                                break;
                                                            case 'face':
                                                                show_msg.push({
                                                                    type: 'text',
                                                                    text: `\n--<`
                                                                });
                                                                show_msg.push({
                                                                    type: 'face',
                                                                    id: results[index]['answer']
                                                                });
                                                                show_msg.push({
                                                                    type: 'text',
                                                                    text: `> 被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                });
                                                                break;
                                                            default:
                                                                e.reply(`输出错误，数据库返回信息为：${results[index]}`)
                                                                break;
                                                        }
                                                    }
                                                    e.reply(show_msg);
                                                }
                                            });
                                            connection.end();
                                        }
                                        break
                                    default:
                                        e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        break;
                                }
                                break;
                            default:
                                e.reply('无法识别命令⊙(・◇・)？ 使用：@bot 查看帮助 [type? command | interaction]，查看命令的使用方法');
                                break;
                        }
                        break;
                    } else {
                        switch (msg_command[0]) {
                            case '禁言':
                                e.reply(`禁言的权限等级要求是${ctl_command['禁言']['permit']}，而您的权限等级为：customer`);
                                break;
                            case '解除禁言':
                                e.reply(`禁言的权限等级要求是${ctl_command['解除禁言']['permit']}，而您的权限等级为：customer`);
                                break;
                            case '删除图片':
                                e.reply(`禁言的权限等级要求是${ctl_command['删除图片']['permit']}，而您的权限等级为：customer`);
                                break;
                            case '群白名单':
                                e.reply(`禁言的权限等级要求是${ctl_command['群白名单']['permit']}，而您的权限等级为：customer`);
                                break;
                            case '管理员':
                                e.reply(`禁言的权限等级要求是${ctl_command['管理员']['permit']}，而您的权限等级为：customer`);
                                break;
                            case "查看帮助":
                                let show_msg = '';
                                switch (msg_command[1]) {
                                    case 'command':
                                        show_msg = "控制命令："
                                        for (let key in ctl_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}\n", ctl_command[key]['title'], ctl_command[key]['describe'], ctl_command[key]['help'], ctl_command[key]['create_time'], ctl_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case 'interaction':
                                        show_msg = "交互命令："
                                        for (let key in interaction_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}\n", interaction_command[key]['title'], interaction_command[key]['describe'], interaction_command[key]['help'], interaction_command[key]['create_time'], interaction_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case undefined:
                                        show_msg = "交互命令："
                                        for (let key in interaction_command) {
                                            let command_info = interaction_command[index];
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}：\n", interaction_command[key]['title'], interaction_command[key]['describe'], interaction_command[key]['help'], interaction_command[key]['create_time'], interaction_command[key]['permit']);
                                        }
                                        show_msg += "\n控制命令:"
                                        for (let key in ctl_command) {
                                            show_msg += format("\n--{}\n----命令描述：{}\n----命令格式：{}\n----命令创建日期：{}\n----使用权限等级：{}：\n", ctl_command[key]['title'], ctl_command[key]['describe'], ctl_command[key]['help'], ctl_command[key]['create_time'], ctl_command[key]['permit']);
                                        }
                                        e.reply(show_msg);
                                        break;
                                    case '-h':
                                        e.reply(format("使用方法：{}", ctl_command['查看帮助']['help']));
                                        break;
                                    default:
                                        e.reply("不是这样用滴~ 使用：@bot 查看帮助 -h，查看使用方法");
                                        break;
                                }
                                break;
                            case "回复":
                                switch (msg_command[1]) {
                                    case '-h':
                                        e.reply(`使用方法：${ctl_command['回复']['help']}\n${ctl_command['回复']['describe']}`);
                                        break;
                                    case '-a':
                                        if (msg_command[2] != undefined && msg_command[2] != ''){
                                            if (msg_command[3] != undefined && msg_command[3] != ''){
                                                bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                    let connection = mysql.createConnection({
                                                        host: '121.199.62.144',
                                                        user: 'root',
                                                        password: 'Sh123456!',
                                                        database: 'pixiv',
                                                        multipleStatements: true
                                                    });
                                                    connection.connect();
                                                    connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${msg_command[3]}','text','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                        if (error){
                                                            e.reply(`添加失败！原因：${error}`);
                                                        } else {
                                                            e.reply(`٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => ${msg_command[3]}`);
                                                            reply_msg.push(msg_command[2]);
                                                        }
                                                    });
                                                    connection.end();
                                                });
                                            } else {
                                                switch (e.message[2]?.type) {
                                                    case 'image':
                                                        bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                            let connection = mysql.createConnection({
                                                                host: '121.199.62.144',
                                                                user: 'root',
                                                                password: 'Sh123456!',
                                                                database: 'pixiv',
                                                                multipleStatements: true
                                                            });
                                                            connection.connect();
                                                            connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${e.message[2]['file']}','image','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                                if (error){
                                                                    e.reply(`添加失败！原因：${error}`);
                                                                } else {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    reply_msg.push(msg_command[2]);
                                                                }
                                                            });
                                                            connection.end();
                                                        });
                                                        break;
                                                    case 'face':
                                                        bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(info) {
                                                            let connection = mysql.createConnection({
                                                                host: '121.199.62.144',
                                                                user: 'root',
                                                                password: 'Sh123456!',
                                                                database: 'pixiv',
                                                                multipleStatements: true
                                                            });
                                                            connection.connect();
                                                            connection.query(`insert into reply (\`question\`,\`answer\`,\`msg_type\`,\`user_id\`,\`user_name\`) values ('${msg_command[2]}','${e.message[2]['id']}','face','${info['user_id']}','${info['nickname']}')`, function(error, results, fields){
                                                                if (error){
                                                                    e.reply(`添加失败！原因：${error}`);
                                                                } else {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    reply_msg.push(msg_command[2]);
                                                                }
                                                            });
                                                            connection.end();
                                                        });
                                                        break;
                                                    default:
                                                        e.reply("格式错误或者回复消息的类型不支持（只支持图片、文字、表情）٩( 'ω' )و ")
                                                        break;
                                                }
                                            }
                                        }
                                        break;
                                    case '-rm':
                                        if (msg_command[2] != undefined && msg_command[2] != '') {
                                            if (msg_command[3] != undefined && msg_command[3] != '') {
                                                let connection = mysql.createConnection({
                                                    host: '121.199.62.144',
                                                    user: 'root',
                                                    password: 'Sh123456!',
                                                    database: 'pixiv',
                                                    multipleStatements: true
                                                });
                                                connection.connect();
                                                connection.query(`delete from reply where question='${msg_command[2]}' and answer='${msg_command[3]}' and user_id='${e.user_id}'`, function(error, results, fields){
                                                    if (error){
                                                        e.reply(`删除失败！原因：${error}`);
                                                    } else {
                                                        if (results['affectedRows'] != 0) {
                                                            e.reply(`٩( 'ω' )و 成功删除消息回复： ${msg_command[2]} => ${msg_command[3]}`);
                                                            for (let index = 0; index < reply_msg.length; index++) {
                                                                if (reply_msg[index] === msg_command[2]){
                                                                    delete reply_msg[index];
                                                                }
                                                            }
                                                        } else {
                                                            e.reply("没有该消息或者你无权删除该消息");
                                                        }
                                                    }
                                                });
                                                connection.end();
                                            } else{
                                                switch (e.message[2]?.type) {
                                                    case 'image':
                                                        let connection = mysql.createConnection({
                                                            host: '121.199.62.144',
                                                            user: 'root',
                                                            password: 'Sh123456!',
                                                            database: 'pixiv',
                                                            multipleStatements: true
                                                        });
                                                        connection.connect();
                                                        connection.query(`delete from reply where question='${msg_command[2]}' and answer='${e.message[2]['file']}' and user_id='${e.user_id}'`, function(error, results, fields){
                                                            if (error){
                                                                e.reply(`删除失败！原因：${error}`);
                                                            } else {
                                                                if (results['affectedRows'] != 0) {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功删除消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    for (let index = 0; index < reply_msg.length; index++) {
                                                                        if (reply_msg[index] === msg_command[2]){
                                                                            delete reply_msg[index];
                                                                        }
                                                                    }
                                                                } else {
                                                                    e.reply("没有该消息或者你无权删除该消息");
                                                                }
                                                            }
                                                        });
                                                        connection.end();
                                                        break;
                                                    case 'face':
                                                        // let connection = mysql.createConnection({
                                                        //     host: '121.199.62.144',
                                                        //     user: 'root',
                                                        //     password: 'Sh123456!',
                                                        //     database: 'pixiv',
                                                        //     multipleStatements: true
                                                        // });
                                                        connection.connect();
                                                        connection.query(`delete from reply where question='${msg_command[2]}' and answer='${e.message[2]['id']}' and user_id='${e.user_id}'`, function(error, results, fields){
                                                            if (error){
                                                                e.reply(`删除失败！原因：${error}`);
                                                            } else {
                                                                if (results['affectedRows'] != 0) {
                                                                    e.reply([
                                                                        {
                                                                            type: 'text',
                                                                            text: `٩( 'ω' )و 成功添加消息回复： ${msg_command[2]} => `
                                                                        },
                                                                        e.message[2]
                                                                    ]);
                                                                    for (let index = 0; index < reply_msg.length; index++) {
                                                                        if (reply_msg[index] === msg_command[2]){
                                                                            delete reply_msg[index];
                                                                        }
                                                                    }
                                                                } else {
                                                                    e.reply("没有该消息或者你无权删除该消息");
                                                                }
                                                            }
                                                        });
                                                        connection.end();
                                                        break;
                                                    default:
                                                        e.reply("格式错误或者回复消息的类型不支持（只支持图片、文字、表情）٩( 'ω' )و ")
                                                        break;
                                                }
                                            }
                                        }
                                        break;
                                    case '-find':
                                        if (msg_command[2] != undefined && msg_command[2] != ''){
                                            let show_msg = [
                                                {
                                                    type: 'text',
                                                    text: `消息 <${msg_command[2]}> 的且由您创建的回复消息为：`
                                                }
                                            ]
                                            let connection = mysql.createConnection({
                                                host: '121.199.62.144',
                                                user: 'root',
                                                password: 'Sh123456!',
                                                database: 'pixiv',
                                                multipleStatements: true
                                            });
                                            connection.connect();
                                            connection.query(`select * from reply where question='${msg_command[2]}' and user_id=${e.user_id}`, function(error, results, fields){
                                                if (error){
                                                    e.reply(`查询失败！原因：${error}`);
                                                } else {
                                                    if (results != []){
                                                        for (let index = 0; index < results.length; index++) {
                                                            switch (results[index]['msg_type']) {
                                                                case 'text':
                                                                    show_msg.push({
                                                                        type: 'text',
                                                                        text: `\n--<${results[index]['answer']}> 被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                    });
                                                                    break;
                                                                case 'image':
                                                                    show_msg.push({
                                                                        type: 'image',
                                                                        file: results[index]['answer']
                                                                    });
                                                                    show_msg.push({
                                                                        type: 'text',
                                                                        text: `被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                    });
                                                                    break;
                                                                case 'face':
                                                                    show_msg.push({
                                                                        type: 'text',
                                                                        text: `\n--<`
                                                                    });
                                                                    show_msg.push({
                                                                        type: 'face',
                                                                        id: results[index]['answer']
                                                                    });
                                                                    show_msg.push({
                                                                        type: 'text',
                                                                        text: `> 被 ${results[index]['user_name']}（${results[index]['user_id']}） 创建}`
                                                                    });
                                                                default:
                                                                    e.reply(`输出错误，数据库返回信息为：${results}`)
                                                                    break;
                                                            }
                                                        }
                                                        e.reply(show_msg);
                                                    } else {
                                                        e.reply(`未查询到结果，您可能没有在 <${msg_command[2]}> 下创建过回复词条记录`);
                                                    }
                                                }
                                            });
                                            connection.end();
                                        }
                                        break
                                    default:
                                        e.reply(`不是这样用滴~ 添加-h选项查看一下怎么用这个命令吧(*^▽^*)`);
                                        break;
                                }
                                break;
                            default:
                                e.reply("无法识别命令⊙(・◇・)？ 使用：@bot 查看帮助 [type? command | interaction]，查看命令的使用方法");
                                break;
                        }
                    }
                    break;
                default:
                    e.reply("无法识别命令⊙(・◇・)？ 使用：@bot 查看帮助 [type? command | interaction]，查看命令的使用方法");
                    break;
            }
        }
    } else {
        msg_command = e.raw_message.split(' ')
        switch (msg_command[0]) {
            case '自助禁言':
                switch (msg_command[1]) {
                    case undefined:
                        e.reply("不是这样用滴~ 使用：自助禁言 -h，查看使用方法");
                        break;
                    case '-h':
                        e.reply(format("使用方法：{}", interaction_command['自助禁言']['help']));
                        break;
                    default:
                        bot.getGroupMemberInfo(e.group_id, account).then(function(info) {
                            if (info['role'] != 'member') {
                                bot.getGroupMemberInfo(e.group_id, e.user_id).then(function(target) {
                                    // [+-]?(\d+\.\d*|\d*\.\d+|\d+)(e\d+)?
                                    if (/^ *\d+(\.\d+)?$/.test(msg_command[1])) {
                                        switch (target['role']) {
                                            case 'owner':
                                                e.reply("？！我可不敢禁言群主 !!!∑(ﾟДﾟノ)ノ");
                                                break;
                                            case 'admin':
                                                e.reply(format("管理员之间可没法相互禁言 (눈‸눈)"));
                                                break;
                                            default:
                                                if (parseInt(msg_command[1]) < 1) {
                                                    e.reply("自助禁言单次下限时间为1分钟 (。-ω-)zzz")
                                                } else {
                                                    if (parseInt(msg_command[1]) <= 720) {
                                                        bot.setGroupBan(e.group_id, e.user_id, parseInt(msg_command[1]) * 60);
                                                        e.reply(format("成功领取 {} 分钟禁言", msg_command[1]));
                                                    } else {
                                                        e.reply("自助禁言单次上限时间为12小时（720分钟）(。-ω-)zzz");
                                                    }
                                                }
                                                break;
                                        }
                                    } else {
                                        e.reply("格式错误！格式为：自助禁言 时间（分钟）o(´^｀)o");
                                    }
                                })
                            } else {
                                e.reply("机器人权限不足，当前权限等级为" + info['role'] + " (〃＞＿＜;〃)");
                            }
                        })
                        break;
                }
                
                break;
            case '来点颜色':
                switch (msg_command[1]) {
                    case undefined:
                        let connection = mysql.createConnection({
                            host: '121.199.62.144',
                            user: 'root',
                            password: 'Sh123456!',
                            database: 'pixiv',
                            multipleStatements: true
                        });    
                        connection.connect();
                        var sql_command = 'SELECT t1.* FROM `info` AS t1 JOIN (SELECT ROUND(RAND() * ((SELECT MAX(id) FROM `info`)-(SELECT MIN(id) FROM `info`))+(SELECT MIN(id) FROM `info`)) AS id) AS t2 WHERE t1.id >= t2.id ORDER BY t1.id LIMIT 1;'
                        connection.query(sql_command, function(err, result) {
                            if (err) {
                                e.reply(err);
                            } else {
                                var pixiv_image = result[0];
                                e.reply([{
                                        type: 'image',
                                        file: pixiv_image['local'],
                                        url: pixiv_image['original'],
                                        asface: false
                                    },
                                    {
                                        type: 'text',
                                        text: '图片pid：' + pixiv_image['pid'] + '\n' + '画师：' + pixiv_image['author'] + '\n' + '画师uid：' + pixiv_image['uid']
                                    }
                                ])
                            }
                        });
                        connection.end();
                        break;
                    case '-h':
                        e.reply(format("使用方法：{}", interaction_command['来点颜色']['help']));
                        break;
                    default:
                        e.reply("不是这样用滴~ 使用：来点颜色 -h，查看使用方法");
                        break;
                }
                break;
            default:
                if (e.message[0]['type'] === 'text'){
                    if (reply_msg.includes(e.message[0]['text'])){
                        let connection = mysql.createConnection({
                            host: 'www.xysama.cn',
                            user: 'root',
                            password: 'Sh123456!',
                            database: 'pixiv',
                            multipleStatements: true
                        });
                        connection.connect();
                        connection.query(`select answer, msg_type from (select * from reply where question='${e.message[0]['text']}' order by rand() limit 1) a`, function(error, results, fields) {
                            if (error) {
                                e.reply(error);
                            } else {
                                switch (results[0]['msg_type']) {
                                    case 'text':
                                        e.reply(results[0]['answer']);
                                        break;
                                    case 'image':
                                        e.reply([
                                            {
                                                type: 'image',
                                                file: results[0]['answer']
                                            }
                                        ])
                                        break;
                                    case 'face':
                                        e.reply([
                                            {
                                                type: 'face',
                                                id: parseInt(results[0]['answer'])
                                            }
                                        ])
                                        break;
                                    default:
                                        e.reply(`回复发生错误，数据库返回信息为${results}`)
                                        break;
                                }
                            }
                        });
                        connection.end();
                    }
                }
                break;
        }
    }
})