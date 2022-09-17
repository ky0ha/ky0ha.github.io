// var mysql = require('mysql');

var username = ''
var password = ''
var vcode = '176747'

window.onload = function() {
    var item = document.getElementsByClassName("item");
    var it = item[0].getElementsByTagName("div");

    var content = document.getElementsByClassName("content");
    var con = content[0].getElementsByTagName("div");

    for (let i = 0; i < it.length; i++) {
        it[i].onclick = function() {
            for (let j = 0; j < it.length; j++) {
                it[j].className = '';
                con[j].style.display = "none";
            }
            this.className = "active";
            it[i].index = i;
            con[i].style.display = "block";
        }
    }
}

var sent_email = function(){
    var buttom = document.getElementById("get_vcode")
    buttom.onclick = function(){
        var item = document.getElementById("email_address")
        var address = item.value

        // who = prompt("Enter recipient's email address:","antispammer@earthling.net");
        // what = prompt("Enter the subject:","none");
        // if (confirm("Are u sure to sent mail to "+who+" with the subject of "+what+"?")==true){
        //     parent.location.href='mailto:'+who+'?subject='+what;
        // }
        subject = "176747%20是你的%20注册%20验证码"
        body = "在创建账号之前，你需要完成一个简单的步骤。让我们确保这是正确的邮件地址。%0d%0a%0d%0a请输入此验证码以开始注册账号：%0d%0a 176747 %0d%0a%0d%0a验证码两小时后过期。%0d%0a"
        parent.location.href='mailto:'+address+'?subject='+subject+'&body='+body;
    }
}

var register = function(){
    var _code = document.getElementById("vcode").value;
    if (_code==vcode) {
        console.log("vcode is true!");
        username = document.getElementById("register_username").value;
        password = document.getElementById("register_password").value;
        console.log("successful! username is:"+username+" and the password is:"+password);
        window.alert("注册成功！");
    } else {
        window.alert("验证码错误");
    }
}

var login = function(){
    var login_username = document.getElementById("login_username").value;
    var login_password = document.getElementById("login_password").value;

    // var connect = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '123456',
    //     database: 'account_db'
    // });
    if (login_username==username && login_password==password){
        window.alert("登陆成功！");
    }
    else{
        window.alert("登录失败，用户名或密码错误！");
    }
}