<template>
    <div class="tab">
       <router-link v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path"  class="tags-view-item" :class="isActive(tag)?'active':''">
        <Tag class="tag" closable  @on-close.prevent.stop="handleClose(tag)">{{tag.title}}</Tag>
         <!-- <span class='el-icon-close' @click.prevent.stop="delSelectTag(tag)"></span> -->
      </router-link>
      <!-- <router-link to="/">
      <Tag type="border" closable>标签四</Tag>
      </router-link> -->
    </div>
</template>
<script>
export default {
    data () {
        return {
            params: {},
            tabName: []
        }
    },
    computed: {
        visitedViews () { // store中取值
            return this.$store.getters.visitedviews
        }
    },
    mounted () {
        // var arr = document.getElementsByClassName('ivu-icon-ios-close-empty')
        // console.log(arr, 'kkl')
        // console.log(arr.length, 'kkl')
        // for (let index of arr) {
        //     index.classList.remove('ivu-icon-ios-close-empty')
        // }
        console.log(this.$route, 'route')
    },
    watch: {
        $route () {
            this.addViewTags()
        },
        visitedViews () {
            console.log('1qq')
            let that = this
            this.tabName = []
            this.visitedViews.forEach((val) => {
                that.tabName.push(val.tabName)
            })
        }
    },
    methods: {
        addViewTags () { // 路由改变时执行的方法
            if (this.$route.name) {
                console.log('11')
                let route = this.$route
                // debugger
                this.$store.dispatch('addVisitedViews', route)
            }
        },
        isActive (route) {
            // console.log('bb')
            return route.path === this.$route.path
        },
        handleClose (route) {
            console.log(route, 'route')
            this.params = route
            // console.log(this.visitedViews, 'visitedViews')
            // console.log(this.isActive(route), '006')
            this.$store.dispatch('delVisitedViews', this.params).then((vale) => {
                if (this.isActive(route)) { // 只有在关闭当前打开的标签页才会有影响
                    // console.log(views, '004')
                    // let lastView = vale.slice(-1)[0] // 选取路由数组中的最后一位
                    let lastView = this.visitedViews.slice(-1)[0] // 选取路由数组中的最后一位
                    if (lastView) {
                        this.$router.push(lastView)
                    } else {
                        this.$router.push('/index/home')
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.tab {
    height: 45px;
    /* line-height: 35px; */
    padding: 10px 10px;
}
/* Tag {
    height: 35px;
    line-height: 35px;
    padding: 0px 10px 0px 15px;
    font-size: 14px;
} */
.ivu-tag {
    display: inline-block;
    height: 35px;
    line-height: 35px;
    margin: 0;
    padding: 0 10px 0 15px;
    border: none;
    border-radius: 3px;
    background: none;
    font-size: 14px;
    }
    .ivu-icon-ios-close-empty:before {
    content: " ";
}
.ivu-icon-ios-close-empty:before {
    content: " ";
}
.active {
   background: white;
   height: 35px;
//    color: #e54a49!important;
   .ivu-tag{
       .tag{
   .ivu-tag-text{
       color: #e54a49!important;
       font-size: 20px;
   }
       }
   }
   display: inline-block;
}
</style>
