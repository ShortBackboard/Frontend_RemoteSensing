const app = new Vue ({
    el:'#app',
    data: {
            msg: '多平台遥感协同叶绿素浓度监测系统',
            users : [
                {
                    id: 95001,name: '小a',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95002,name: '小b',gender: '女',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95003,name: '小c',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {   
                    id: 95004,name: '小d',gender: '女',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95005,name: '小e',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95001,name: '小a',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95002,name: '小b',gender: '女',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95003,name: '小c',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {   
                    id: 95004,name: '小d',gender: '女',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                },
                {
                    id: 95005,name: '小e',gender: '男',birthday: '2000-01-01',tel: '12345678901',
                    email: '12345678901@qq.com',address: '北京市',career: '园林遥感'
                }
            ],

            total:100, // 数据总数
            currentpage:1, // 当前页码
            pagesize:10, // 每页显示条数
        }
})