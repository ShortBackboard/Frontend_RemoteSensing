const app = new Vue({
    el: '#app',
    data() {
        return {
            adminUsername: 'root',
            adminPassword: 'root',

            loginInfo: {
                no: '',  // 账号
                password: '',
            },

            baseURL: "http://127.0.0.1:8000/",
        }
    },


    methods: {

        //用户登录
        login() {
            if (this.loginInfo.no === '' || this.loginInfo.password === '') {
                alert('账号或密码不能为空');
                return;
            }

            if (this.loginInfo.no === this.adminUsername && this.loginInfo.password === this.adminPassword) {
                window.location.href = 'admin.html'; // 管理员界面

                this.loginInfo.password === '';
            } else {
                // 发送给后端判断

                let that = this; // 保存this

                axios.post(that.baseURL + 'users/login/', that.loginInfo)
                    .then(res => {
                        if (res.data.code === 1) {
                            window.location.href = 'user.html'; // 切换用户界面

                            that.loginInfo.password === '';
                        } else {
                            alert('账号或密码错误');
                        }
                    })
                    .catch(err => {
                        //执行失败
                        alert("登录时获取后端登录结果出现异常！");
                        // that.$message.error("登录时获取后端登录结果出现异常！");
                    })


            }


        },


        register() {
            // 这里可以添加注册逻辑，例如打开注册页面或者显示注册表单
            alert('注册功能尚未实现');
        }
    },

});