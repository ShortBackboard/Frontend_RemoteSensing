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
            
            users: [], // 所有用户信息

            baseURL: "http://127.0.0.1:8000/",
            inputStr: "", // 搜索框输入内容
            selectUsers: [], // 被选中批量删除的用户

            msg: "多平台遥感协同叶绿素浓度监测系统",

            // 分页相关的变量
            total: 0, // 数据总数, 从后端获取
            currentpage: 1, // 当前页码
            pagesize: 10, // 每页显示条数
            pageUsers: [], // 当前页用户信息

            // 模态框相关变量
            dialogTitle: "", // 模态框标题
            dialogVisible: false, // 控制用户信息对话框的显示
            isView: false, // 是否为查看模式
            isEdit: false, // 是否为修改模式

            userInfo: { // 用户信息
                no: "",
                name: "",
                gender: "",
                birthday: "",
                mobile: "",
                email: "",
                address: "",
                career: "",
            },

            //添加用户的表单信息提交前的校验
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


    mounted() {
        // 打开页面自动加载所有用户信息
        this.getUsers()
    },

    methods: {
        // 获取所有用户信息
        getUsers: function () {
            // 记录this的地址，因为axios使用过程中this的地址会改变
            let true_this = this;

            // 使用Axios实现Ajas请求
            axios.get(true_this.baseURL + "users/")
                .then(function (res) {
                    // 执行成功的回调函数
                    if (res.data.code === 1) {
                        // # 后端返回
                        // return JsonResponse({'code': 1, 'data': users})
                        true_this.users = res.data.data;

                        // 总数据数量
                        true_this.total = res.data.data.length;
                        true_this.getPageUsers();

                        // 提示
                        true_this.$message({
                            message: '用户信息加载成功！',
                            type: 'success'
                        });

                    }
                    else {
                        // 失败的提示
                        true_this.$message.error('res.data.msg');
                    }
                })
                .catch(function (err) {
                    // 执行失败的回调函数
                    console.log(err)
                })
        },

        // 获取当前页的用户信息
        getPageUsers() {
            this.pageUsers = []; // 先清空数组

            // 获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                this.pageUsers.push(this.users[i]);

                // 如果当前页的数据已经达到pagesize，则退出循环
                if (this.pageUsers.length == this.pagesize) {
                    break;
                }
            }
        },


        // 分页时修改每页的行数
        handleSizeChange(size) {
            this.pagesize = size;

            // 数据重新分页
            this.getPageUsers();
        },

        // 分页时修改当前页
        handleCurrentChange(currentpage) {
            this.currentpage = currentpage;

            // 数据重新分页
            this.getPageUsers();
        },

        // 用户信息查询
        queryUsers() {
            //使用Ajax请求--POST-->传递InputStr
            let true_this = this;

            //开始Ajax请求
            axios
                .post(
                    true_this.baseURL + "users/query/",
                    {
                        inputstr: true_this.inputStr, // 对于后端的inpustr
                    }
                )
                .then(function (res) {
                    if (res.data.code === 1) {
                        //把数据给users
                        true_this.users = res.data.data;
                        //获取返回记录的总行数
                        true_this.total = res.data.data.length;

                        //查询数据为空
                        if (true_this.users.length === 0) {

                            true_this.$message({
                                message: '查询数据为空！',
                                type: 'warning'
                            });

                            true_this.users = []; //清空数组
                            //获取当前页的数据
                            true_this.getPageUsers();

                        } else {
                            //获取当前页的数据
                            true_this.getPageUsers();
                            //提示：
                            true_this.$message({
                                message: '查询数据加载成功！',
                                type: 'success'
                            });
                        }


                    } else {
                        //失败的提示！
                        true_this.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    true_this.$message.error("获取后端查询结果出现异常！");
                });
        },

        //显示全部用户信息按钮
        getAllUsers() {
            this.inputStr = '';
            this.getUsers();
        },

        //添加用户，打开表单（模态框）
        addUser() {
            this.dialogTitle = '添加用户信息';
            this.dialogVisible = true;
        },

        //查看用户信息，所有输入框禁用
        viewUser(row) {
            this.dialogTitle = '查看用户信息';
            this.dialogVisible = true;

            //深拷贝
            this.userInfo = JSON.parse(JSON.stringify(row));

            this.isView = true;
        },

        //关闭模态框时清空表单数据
        closeDialogForm(formName) {
            // 重置表单的校验
            this.$refs[formName].resetFields();

            this.userInfo.no = '';
            this.userInfo.name = '';
            this.userInfo.gender = '';
            this.userInfo.birthday = '';
            this.userInfo.email = '';
            this.userInfo.mobile = '';
            this.userInfo.address = '';
            this.userInfo.career = '';
            this.userInfo.iamge = '';
            this.userInfo.imageUrl = '';

            this.dialogVisible = false;

            this.isEdit = false;
            this.isView = false;
        },

        //修改用户信息，账号不能修改
        updateUser(row) {
            this.dialogTitle = '修改用户信息';
            this.dialogVisible = true;

            this.isEdit = true;



            //深拷贝
            this.userInfo = JSON.parse(JSON.stringify(row));
        },

        //提交用户信息的表单（添加、修改）
        submitUserForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                    //校验成功后，执行添加或者修改
                    if (this.isEdit) {
                        this.submitUpdateUser();
                    } else {
                        this.submitAddUser();
                    }
                        

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        //添加到数据库的函数
        submitAddUser() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'users/add/', that.userInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有用户的信息
                        that.users = res.data.data;
                        //获取记录条数
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageUsers();
                        //提示：
                        that.$message({
                            message: '数据添加成功！',
                            type: 'success'
                        });
                        //关闭窗体
                        this.closeDialogForm('userInfo');
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

        //修改更新到数据库
        submitUpdateUser() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'users/update/', that.userInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有用户的信息
                        that.users = res.data.data;
                        //获取记录条数
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageUsers();
                        //提示：
                        that.$message({
                            message: '数据修改成功！',
                            type: 'success'
                        });
                        //关闭窗体
                        this.closeDialogForm('userInfo');
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

        //删除一条用户记录 
        deleteUser(row) {
            //等待确认
            this.$confirm('是否确认删除用户信息【账号：' + row.no + '，姓名：' + row.name + '】信息？',
                '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认删除响应事件
                let that = this
                //调用后端接口
                axios.post(that.baseURL + 'user/delete/', { no: row.no })
                    .then(res => {
                        if (res.data.code === 1) {
                            //获取所有用户信息
                            that.users = res.data.data;
                            //获取记录数
                            that.total = res.data.data.length;
                            //分页 
                            that.getPageUsers();
                            //提示
                            that.$message({
                                message: '数据删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(res.data.msg);
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //批量删除
        deleteUsers() {
            //等待确认
            this.$confirm("是否确认批量删除" + this.selectUsers.length + "个用户信息吗？",
                '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认删除响应事件
                let that = this
                //调用后端接口
                axios.post(that.baseURL + 'users/delete/', { user: that.selectUsers })
                    .then(res => {
                        if (res.data.code === 1) {
                            //获取所有用户信息
                            that.users = res.data.data;
                            //获取记录数
                            that.total = res.data.data.length;
                            //分页 
                            that.getPageUsers();
                            //提示
                            that.$message({
                                message: '数据批量删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(res.data.msg);
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //选择复选框时触发的操作，用于批量删除
        handleSelectionChange(data) {
            this.selectUsers = data;
        },


    }
})