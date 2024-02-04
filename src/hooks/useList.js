import { ref } from 'vue'
import http from '@/utils/http.js'

export function useList(url, filter = {}) {
  const data = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)

  let query = filter
  let paged = {
    count: 0,
    index: 1,
    limit: 10,
    offset: 0,
    page: 0,
    size: 10
  }

  const onLoad = (params) => {
    query = {...query, ...params}
    if (paged.index < paged.page) {
      query._index = paged.index + 1
    }
    console.log(query)
    http.get(url, query).then(res => {
      if (refreshing.value) {
        data.value = []
        refreshing.value = false
      }
      if (res.data?.items?.length) {
        data.value = data.value.concat(res.data.items)
      }
      if (res.data?.paged) {
        paged = res.data.paged
      }

      loading.value = false
      if (data.value.length >= paged.count) {
        finished.value = true
      }
    })
  }

  const onRefresh = () => {
    // 清空列表数据
    finished.value = false

    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    onLoad()
  }

  return { data, loading, finished, refreshing, onLoad, onRefresh }
}


// const list = reactive(useList('/pay/payer/owner'))

// <!--    <div class="list f1 flex-col">-->
// <!--      <div class="head flex-row items-center">-->
// <!--        <p class="f3 text-l">扣款人</p>-->
// <!--        <p class="f2 text-l">手机号</p>-->
// <!--        <p class="f3 text-r">操作</p>-->
// <!--      </div>-->
//
// <!--      <van-pull-refresh class="f1" v-model="list.refreshing" @refresh="list.onRefresh">-->
//   <!--        <van-list v-model:loading="list.loading" :finished="list.finished" @load="list.onLoad">-->
//   <!--          <div class="content">-->
// <!--            <div v-for="item in list.data" :key="item.id" class="item flex-row items-center border-b">-->
// <!--            </div>-->
// <!--          </div>-->
// <!--        </van-list>-->
// <!--      </van-pull-refresh>-->
// <!--    </div>-->
