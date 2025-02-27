const app = new Vue({
    el: '#app',
    data() {
        return {
            msg: '多平台遥感协同叶绿素浓度监测系统',

            activeIndex: '6', // 当前激活的菜单项

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
        }
    },

    mounted() {
        this.userInfo.no = localStorage.getItem('currentUser'); // 从本地存储中获取当前用户编号
    }

})