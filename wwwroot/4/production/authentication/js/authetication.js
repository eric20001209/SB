
//预加载 remember me
$(function () {//check if Remember Password is checked

    if (localStorage.chkbox && localStorage.chkbox != '') {
        $('#remembermeckb').attr('checked', 'checked');
        $('#inputEmail').val(localStorage.loginemail);
        $('#inputPassword').val(localStorage.password);
    } else {
        $('#remembermeckb').removeAttr('checked');
        $('#inputEmail').val('');
        $('#inputPassword').val('');
    }

    $('#remembermeckb').click(function () {

        if ($('#remembermeckb').is(':checked')) {
            // save username and password
            localStorage.loginemail = $('#inputEmail').val();
            localStorage.password = $('#inputPassword').val();
            localStorage.chkbox = $('#remembermeckb').val();
        } else {
            localStorage.loginemail = '';
            localStorage.password = '';
            localStorage.chkbox = '';
        }
    });
})

//function doLogin1() {
//    $("#myform").ajaxSend(function (message) {
//        dologin();
//    });
//    return true;
//}

//login
function doLogin() {
    doLogout();
    var preUrl = window.location.href;
 //   alert(preUrl);
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    var uri = "https://localhost:44398/api/login/login"
    var someJsonString = {
        "login_email": email,
        "password": password
    };
    {
        $.ajax({
            url: uri,//相对应的esb接口地址
            type: 'post',
            data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
            contentType: "application/json",
            dataType: "json",
            success: function (data) {//服务器（接口）返回来的数据
                var Token = data.token;
                var userID = data.id;
                var name = data.name;
                var email = data.login_email;
                var password = data.password;

                //add data to localstorage and session
                sessionStorage.token = Token;
                sessionStorage.userId = userID;
                sessionStorage.userName = name;
                sessionStorage.loginemail = email;
                sessionStorage.password = password;

                localStorage.setItem("token", Token);
                localStorage.setItem("userId", userID);
                localStorage.setItem("name", name);
                localStorage.setItem("loginemail", email);
                localStorage.setItem("password", password);

                document.getElementById("success").innerHTML = 'success!';
                $('#errorPanel').slideUp('slow');
                $('#successPanel').slideDown('slow');

                //setTimeout("window.location.href='itemReportTop10.html'", 3000);
                if (preUrl.indexOf('login.html', 0))
                    setTimeout("window.location.href='index.html'", 2000);
                 //   setTimeout("window.open(" + preUrl + ")", 2000);
                else
                    setTimeout("window.location.href=" + preUrl + "", 2000);

            },
            error: function (data) {
                $('successPanel').hide();
                document.getElementById("error").innerHTML = JSON.parse(data.responseText).error;
                $('#successPanel').slideUp('slow');
                $('#errorPanel').slideDown('slow');

            }
        });
    };
}

//register
function doRegister() {
    var name = document.getElementById("firstName").value;
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var uri = "https://localhost:44398/api/register/md5"
    var someJsonString = {
        "name": name,
        "email": email,
        "password": password,
        "type": 4,
        "accesslevel": 10
    };
    if (email == "" || password == "") {//判断两个均不为空（其他判断规则在其输入时已经判断） 
        alert("login email or password cannot be blank！")
        return false;
    }
    else if (password != confirmPassword)
    {
        alert("confirm password not same as password!")
        return false;
    }
    else {
        $.ajax({
            url: uri,//相对应的esb接口地址
            type: 'post',
            data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                //注册成功之后登陆 创建token
                var uri = "https://localhost:44398/api/login/login"
                var someJsonString = {
                    "login_email": email,
                    "password": password
                };
                $.ajax({
                    url: uri,//相对应的esb接口地址
                    type: 'post',
                    data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {//服务器（接口）返回来的数据
                        var Token = data.token;
                        var userID = data.id;
                        var name = data.name;

                        sessionStorage.token = Token;
                        sessionStorage.userId = userID;
                        sessionStorage.userName = name;

                        localStorage.setItem("token", Token);
                        localStorage.setItem("userId", userID);
                        localStorage.setItem("name", name);

                        console.log(sessionStorage.token);
                        console.log(sessionStorage.userId);
                        console.log(localStorage.token);
                        console.log(localStorage.userId);

                        self.location = 'index.html';

                    },
                    error: function () {
                        $('#notice').show();
                        console.log('error');
                    }
                })

            },
            error: function (data) {
                console.log(data.responseText); // responeText contain errorMSG
                console.log('error');
                alert(data.responseText);
            }

        })
    }
}

function checkemail(eid) {
    var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
    var obj = document.getElementById(eid); //要验证的对象
    if (!reg.test(obj.value)) {
        alert('llllll');
    }
    else {
        alert('23232');
    }
}

//JWT验证
function doAuthetication() {
 //   alert('1222');
    $.ajaxSetup({
        beforeSend: function (xhr) {
            if (localStorage.getItem("token") != null) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
                document.getElementById("username").innerHTML = localStorage.getItem("name");
                document.getElementById("username2").innerHTML = localStorage.getItem("name");
            }
            else {
                //alert('invalid token, please re-login');
            }
        }
    });
}

//resend pw
function doSendPw()
{
    var email = document.getElementById("inputEmail").value;
    var uri = "https://localhost:44398/api/login/sendPw/" + email;

    var someJsonString = {};
    //alert('2');

        $.ajax({
            url: uri,//相对应的esb接口地址
            type: 'post',
            //asycn:false,
            data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
            contentType: "application/json",
            dataType: "json",
            success: function () {
                //alert('Password reset sucessfully! \r\n Please check your email!');
                document.getElementById("success").innerHTML = 'success! \r\n Redirect to login page :)';
                $('#errorPanel').slideUp('slow');
                $('#successPanel').slideDown('slow');

                setTimeout("window.location.href='forgot-password-notice.html'", 3000);
                setTimeout("window.location.href='login.html'", 3000);
            },
            error: function (data) {
                console.log(data.responseText); // responeText contain errorMSG
                console.log('error');
                //alert(data.responseText);
                $('successPanel').hide();
                document.getElementById("error").innerHTML = JSON.parse(data.responseText).error;
                $('#successPanel').slideUp('slow');
                $('#errorPanel').slideDown('slow');
            }
        })
}

//reset pw
function doResetPw() { }

//退出 delete token
function doLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}
