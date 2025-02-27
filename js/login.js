const app = new Vue({
    el: '#app',
    data() {
        // 校验账号是否已经存在
        const rulesNo = (rule, value, callback) => {
            if (this.isEdit) {
                callback();
            }
            //使用Axios进行校验 
            axios.post(
                this.baseURL + 'no/check/',
                {
                    no: value,
                }
            )
                .then((res) => {
                    //请求成功
                    if (res.data.code === 1) {
                        if (res.data.exists) {
                            callback(new Error("账号已存在！"));
                        } else {
                            callback();
                        }
                    } else {
                        //请求失败
                        callback(new Error("校验账号后端出现异常！"))
                    }
                })
                .catch((err) => {
                    //如果请求失败在控制台打印
                    console.log(err);
                });
        }

        return {
            adminUsername: 'root',
            adminPassword: 'root',

            loginInfo: {
                no: '',  // 账号
                password: '',
            },

            baseURL: "http://127.0.0.1:8000/",

            dialogRegisterVisible: false,  // 注册对话框
            dialogTitle: "", // 模态框标题

            registerInfo: { // 用户注册信息
                no: "",
                name: "",
                gender: "",
                birthday: "",
                mobile: "",
                email: "",
                password: "",
                address: "",
                career: "",
            },

            //用户注册的表单信息提交前的校验
            rules: {
                no: [
                    { required: true, message: '账号不能为空', trigger: 'blur' },
                    { pattern: /\d{5}$/, message: '账号必须是五位数', trigger: 'blur' },
                    { validator: rulesNo, trigger: 'blur' }, //校验账号是否已经存在
                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须是2-5个汉字', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ],
                gender: [
                    { required: true, message: '性别不能为空', trigger: 'change' },
                ],
                birthday: [
                    { required: true, message: '出生日期不能为空', trigger: 'change' },
                ],
                mobile: [
                    { required: true, message: '手机号码不能为空', triggler: 'blur' },
                    { pattern: /^[1][35789]\d{9}$/, message: '手机号码必须要符合规范', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
                    { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱地址必须要符合规范', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '家庭住址不能为空', trigger: 'blur' },
                ],
                career: [
                    { required: true, message: '研究领域不能为空', trigger: 'blur' },
                ]
            }

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
                            // 切换到用户界面，同时传递账号
                            localStorage.setItem('currentUser', that.loginInfo.no); 
                            window.location.href = 'user.html'; 

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

            this.dialogRegisterVisible = true;
        },

        //关闭模态框时清空表单数据
        closeDialogForm(formName) {
            // 重置表单的校验
            this.$refs[formName].resetFields();

            this.registerInfo.no = '';
            this.registerInfo.name = '';
            this.registerInfo.password = '';
            this.registerInfo.gender = '';
            this.registerInfo.birthday = '';
            this.registerInfo.email = '';
            this.registerInfo.mobile = '';
            this.registerInfo.address = '';
            this.registerInfo.career = '';


            this.dialogRegisterVisible = false;
        },

        //提交用户信息的表单（添加、修改）
        submitUserForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    this.submitRegisterUser();

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        //用户注册
        submitRegisterUser() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'users/register/', that.registerInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //提示：
                        that.$message({
                            message: '注册成功！',
                            type: 'success'
                        });
                        //关闭窗体
                        this.closeDialogForm('registerInfo');
                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("获取后端查询结果出现异常！");
                })
        },


    },

});