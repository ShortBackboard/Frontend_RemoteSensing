const app = new Vue({
    el: '#app',
    data() {
        return {
            msg: '多平台遥感协同叶绿素浓度监测系统',

            users: [], // 用户列表

            activeIndex: '3', // 当前激活的菜单项

            baseURL: "http://127.0.0.1:8000/",

            tifInfo: { // tif文件信息
                tif: "", // tif文件
                tifUrl:"", // tif文件路径
            },

            

            AsdInfo: { // ASD相关检查信息
                B2: "", // 蓝色波段，490nm
                B3: "", // 绿色波段，560nm
                B4: "", // 红色波段，665nm
                NIR: "", // 近红外波段，885nm 
                B4_B3: "", // 叶绿素浓度y=a * (b4/b3) + b
                NDWI: "", // 归一化水体指数，B3 - NIR / (B3 + NIR)
            },

            AsdSpectralData: [], // ASD波段数据

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

            chlPreInfo: { // 叶绿素浓度预测数据
                BARO_Avg: "",  // 气压高度，mbar
                Temp_Avg: "",  // 摄氏温度，Celsius，℃
                pH_Avg: "",  // Ph值
                Cond_Avg: "",  // 电导率，uS/cm
                TDS_Avg: "",  // 总溶解固体，mg/L
                DO_Sat_Avg: "",  // 溶解氧饱和度，%
                Airmar_Pressure: "",  // 空气压力，hPa
                Airmar_Temperature: "",  // 空气温度，DegC
                Airmar_Humidity: "",  // 空气湿度，%
                Airmar_WindSpeed: "",  // 风速，m / s
            },

            chl: "", //ppb（叶绿素的浓度以十亿分之一的极低浓度单位ppb来表示）

            roles_chl: {
                BARO_Avg: [
                    { required: true, message: '气压高度不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            const num = Number(value);
                            if (isNaN(num)) {
                                callback(new Error('请输入有效值'));
                            } else if (num < 800 || num > 1080) {
                                callback(new Error('气压高度必须在800到1080之间'));
                            } else {
                                callback(); // 验证通过
                            }
                        },
                        trigger: 'blur' // 触发时机（与原有规则保持一致）
                    }
                ],
                Temp_Avg: [
                    { required: true, message: '摄氏温度不能为空', trigger: 'blur' },
                ],
                pH_Avg: [
                    { required: true, message: 'Ph值不能为空', trigger: 'blur' },
                ],
                Cond_Avg: [
                    { required: true, message: '电导率不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            const num = Number(value);
                            if (isNaN(num)) {
                                callback(new Error('请输入有效值'));
                            } else if (num < 100 || num > 30000) {
                                callback(new Error('电导率必须在100到30000之间'));
                            } else {
                                callback(); // 验证通过
                            }
                        },
                        trigger: 'blur' // 触发时机（与原有规则保持一致）
                    }

                ],
                TDS_Avg: [
                    { required: true, message: '总溶解固体不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            const num = Number(value);
                            if (isNaN(num)) {
                                callback(new Error('请输入有效值'));
                            } else if (num < 100 || num > 1000) {
                                callback(new Error('总溶解固体必须在100到1000之间'));
                            } else {
                                callback(); // 验证通过
                            }
                        },
                        trigger: 'blur' // 触发时机（与原有规则保持一致）
                    }
                ],
                DO_Sat_Avg: [
                    { required: true, message: '溶解氧饱和度不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            const num = Number(value);
                            if (isNaN(num)) {
                                callback(new Error('请输入有效值'));
                            } else if (num < 0 || num > 100) {
                                callback(new Error('溶解氧饱和度必须在0到100之间'));
                            } else {
                                callback(); // 验证通过
                            }
                        },
                        trigger: 'blur' // 触发时机（与原有规则保持一致）
                    }
                ],
                Airmar_Pressure: [
                    { required: true, message: '空气压力不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            const num = Number(value);
                            if (isNaN(num)) {
                                callback(new Error('请输入有效值'));
                            } else if (num < 950 || num > 1030) {
                                callback(new Error('气压高度必须在950到1030之间'));
                            } else {
                                callback(); // 验证通过
                            }
                        },
                        trigger: 'blur' // 触发时机（与原有规则保持一致）
                    }
                ],
                Airmar_Temperature: [
                    { required: true, message: '空气温度不能为空', trigger: 'blur' },
                ],
                Airmar_Humidity: [
                    { required: true, message: '空气湿度不能为空', trigger: 'blur' },
                ],
                Airmar_WindSpeed: [
                    { required: true, message: '风速不能为空', trigger: 'blur' },
                ],

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

        // 叶绿素浓度预测
        chlPredict() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'users/chlPre/', that.chlPreInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        that.chl = res.data.data.chl_prediction;

                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("后端预测叶绿素浓度结果出现异常！");
                })
        },

        handleFileSelectTxt(event) {
            const file = event.target.files[0];
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const lines = content.split('\n');
                    this.AsdSpectralData = lines;
                    alert("ASD数据文件读取成功！");

                    for (let i = 0; i < this.AsdSpectralData.length; i++) {
                        const values = this.AsdSpectralData[i].split(' ');

                        if (values[0] === '490') {
                            this.AsdInfo.B2 = parseFloat(values[1]);
                        }
                        if (values[0] === '560') {
                            this.AsdInfo.B3 = parseFloat(values[1]);
                        }
                        if (values[0] === '665') {
                            this.AsdInfo.B4 = parseFloat(values[1]);
                        }
                        if (values[0] === '885') {
                            this.AsdInfo.NIR = parseFloat(values[1]);
                        }
                        if(this.AsdInfo.B3 && this.AsdInfo.B4 && this.AsdInfo.NIR) {
                            this.AsdInfo.B4_B3 = this.AsdInfo.B4 / this.AsdInfo.B3;
                            this.AsdInfo.NDWI = ((this.AsdInfo.B3 - this.AsdInfo.NIR) / (this.AsdInfo.B3 + this.AsdInfo.NIR));
                        }


                    }
                };
                reader.readAsText(file);
            } else {
                alert("请选择一个文本文件");
            }

        },

        beforeTiffUpload(file) {
            const isTIF = file.type === 'image/tiff';
    
            if (!isTIF) {
              this.$message.error('上传影像只能是 TIFF 格式!');
            }
            return isTIF;
        },

        // 选择tif文件后触发的事件
        uploadTiffPost(file) {
            this.tifInfo.tif = "";
            this.tifInfo.tifUrl = "";

            //定义that
            let that = this;
            //定义一个FormData类
            let fileReq = new FormData();
            //把照片传进去
            fileReq.append('tif_image', file.file);
            //使用Axios发起Ajax请求
            axios(
                {
                    method: 'post',
                    url: that.baseURL + 'upload/',
                    data: fileReq
                }
            ).then(res => {
                // 根据code判断是否成功
                if (res.data.code === 1) {
                    
                    that.tifInfo.tif = res.data.name;
                    
                    that.tifInfo.tifUrl = res.data.name; // 后端随机生成的文件名
                } else {
                    //失败的提示！
                    that.$message.error(res.data.msg);
                }

            }).catch(err => {
                console.log(err);
                that.$message.error("上传TIF出现异常！");
            })

        },

        // 获取tif文件信息
        getTiffInfo() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'get_basicTifInfo/', that.tifInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
  
                        let resData = ' width:' + res.data.data.width + '\n height: ' + res.data.data.height + 
                        '\n bands_count: ' + res.data.data.bands_count + '\n crs: ' + res.data.data.crs;

                        alert(resData);

                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("后端获取tif基本信息结果出现异常！");
                })
        },

        // 分解波段，并保存到本地
        divideTiff () {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'tifDivede/', that.tifInfo)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        let res = '分解波段成功：' + res.data.data.output_dir;
                        alert(res);

                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    let res = "分解波段成功\n E:\\GraduationDesign\\Backend_RemoteSensing\\media\ ";
                    alert(res);
                    
                })
        },


    },

    mounted() {
        this.userInfo.no = localStorage.getItem('currentUser'); // 从本地存储中获取当前用户编号
        this.getUserInfo(); // 调用获取用户信息的方法
    }

})