const app = new Vue ({
    el:'#app',
    data: {
        users:[], // 所有用户信息

        baseURL: "http://127.0.0.1:8000/",
        inputStr: "", // 搜索框输入内容
        
        msg: "多平台遥感协同叶绿素浓度监测系统",
            

        // 分页相关的变量
        total:0, // 数据总数, 从后端获取
        currentpage:1, // 当前页码
        pagesize:10, // 每页显示条数
        pageUsers:[], // 当前页用户信息

        dialogVisible: false, // 控制用户信息对话框的显示

        userInfo: { // 用户信息
            no: "",
            name: "",
            gender: "",
            birthday: "",
            mobile: "",
            email: "",
            address: "",
            career: "",
            image: "",  // 头像
        }
    },

    mounted() {
        // 打开页面自动加载所有用户信息
        this.getUsers()
    },

    methods: {
        // 获取所有用户信息
        getUsers:function() {
            // 记录this的地址，因为axios使用过程中this的地址会改变
            let true_this = this;

            // 使用Axios实现Ajas请求
            axios.get(true_this.baseURL + "users/")
            .then(function(res) {
                // 执行成功的回调函数
                if(res.data.code === 1) {
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
            .catch(function(err) {
                // 执行失败的回调函数
                console.log(err)
            })
        },

        // 获取当前页的用户信息
        getPageUsers() {
            this.pageUsers=[]; // 先清空数组

            // 获得当前页的数据
            for(let i = (this.currentpage-1)*this.pagesize; i < this.total; i++) {
                this.pageUsers.push(this.users[i]);

                // 如果当前页的数据已经达到pagesize，则退出循环
                if(this.pageUsers.length == this.pagesize) {
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
            this.dialogVisible = true;
        },

        //查看用户信息
        viewUser(row) {
            this.dialogVisible = true;

            //深拷贝
            this.userInfo = JSON.parse(JSON.stringify(row));
        },

        //关闭模态框时清空表单数据
        closeDialogForm() {
            this.userInfo.no = '';
            this.userInfo.name = '';
            this.userInfo.gender = '';
            this.userInfo.birthday = '';
            this.userInfo.email = '';
            this.userInfo.mobile = '';
            this.userInfo.address = '';
            this.userInfo.carer = '';
            this.userInfo.iamge = '';

            this.dialogVisible = false;
        }
        
    }
})