const app = new Vue({
    el: '#app',
    data() {
        return {
            msg: '多平台遥感协同叶绿素浓度监测系统',

            activeIndex: '1' // 当前激活的菜单项
        }
    },

    methods: {
        handleSelect(index) {
            this.activeIndex = index
        }
    },

})