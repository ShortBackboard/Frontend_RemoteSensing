const app = new Vue({
    el: '#app',
    data() {
        return {
            msg: '多平台遥感协同叶绿素浓度监测系统',

            users: [], // 用户列表

            activeIndex: '6', // 当前激活的菜单项

            baseURL: "http://127.0.0.1:8000/",

            userInfo: { // 用户注册信息
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

            rules: {
                no: [
                    { required: true, message: '账号不能为空', trigger: 'blur' },
                    { pattern: /\d{5}$/, message: '账号必须是五位数', trigger: 'blur' },
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
        handleSelect(index) {
            this.activeIndex = index
        },

        // 获取用户信息
        getUserInfo() {
            // 记录this的地址，因为axios使用过程中this的地址会改变
            let that = this;

            // 使用Axios实现Ajas请求
            axios.get(that.baseURL + "users/")
                .then(function (res) {
                    // 执行成功的回调函数
                    if (res.data.code === 1) {
                        // # 后端返回
                        // return JsonResponse({'code': 1, 'data': users})
                        that.users = res.data.data;

                        for (let i = 0; i < that.users.length; i++) {
                            if (that.users[i].no == that.userInfo.no) {
                                that.userInfo = that.users[i];
                                break;
                            }
                        }

                        // 提示
                        that.$message({
                            message: '用户信息加载成功！',
                            type: 'success'
                        });

                    }
                    else {
                        // 失败的提示
                        that.$message.error('res.data.msg');
                    }
                })
                .catch(function (err) {
                    // 执行失败的回调函数
                    console.log(err)
                })
        },

        updateUser() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'users/update_login/', that.userInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有用户的信息
                        that.users = res.data.data;

                        for (let i = 0; i < that.users.length; i++) {
                            if (that.users[i].no == that.userInfo.no) {
                                that.userInfo = that.users[i];
                                break;
                            }
                        }
                        
                        //提示：
                        that.$message({
                            message: '数据修改成功！',
                            type: 'success'
                        });
                       
                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("修改时获取后端查询结果出现异常！");
                })

        },
    },

    mounted() {
        this.userInfo.no = localStorage.getItem('currentUser'); // 从本地存储中获取当前用户编号
        this.getUserInfo(); // 调用获取用户信息的方法
    }

})