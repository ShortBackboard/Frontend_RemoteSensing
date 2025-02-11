const app = new Vue ({
    el:'#app',
    data: {
            msg: '多平台遥感协同叶绿素浓度监测系统',
            users : [
                {
                    id: 95001,
                    name: '小a',
                    gender: '男',
                    birthday: '2000-01-01',
                    tel: '12345678901',
                    email: '12345678901@qq.com',
                    address: '北京市',
                    career: '园林遥感'
                },
                {
                    id: 95002,
                    name: '小b',
                    gender: '女',
                    birthday: '2000-02-02',
                    tel: '12345678902',
                    email: '12345678902@qq.com',
                    address: '上海市',
                    career: '水色遥感'
                },
                {
                    id: 95003,
                    name: '小c',
                    gender: '男',
                    birthday: '2000-03-03',
                    tel: '12345678903',
                    email: '12345678903@qq.com',
                    address: '广州市',
                    career: '植被遥感'
                }
            ]
        }
})