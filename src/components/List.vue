<script setup>
import { reactive } from 'vue'
import http from '@/utils/http.js'

const props = defineProps({
  url: {
    required: true,
    default: ''
  }
})

const list = reactive({
  filters: {
    _index: 1
  },
  data: [],
  loading: false,
  finished: false,
  refreshing: false
})

let paged = {
  count: 0,
  index: 1,
  limit: 10,
  offset: 0,
  page: 0,
  size: 10
}

const setFilters = filters => {
  list.filters = { ...list.filters, ...filters }
}

const onLoad = params => {
  if (paged.index < paged.page) {
    list.filters._index = paged.index + 1
  }
  http.get(props.url, list.filters).then(res => {
    if (list.refreshing) {
      list.data = []
      list.refreshing = false
    }
    if (res.data?.items?.length) {
      list.data = list.data.concat(res.data.items)
    }
    if (res.data?.paged) {
      paged = res.data.paged
    }

    list.loading = false
    if (list.data.length >= paged.count) {
      list.finished = true
    }
  })
}

const onRefresh = () => {
  paged = {
    count: 0,
    index: 1,
    limit: 10,
    offset: 0,
    page: 0,
    size: 10
  }
  list.refreshing = true

  // 清空列表数据
  list.finished = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  list.loading = true
  onLoad()
}

defineExpose({ setFilters, onLoad, onRefresh })
</script>

<template>
  <div class="list f1 flex-col">
    <slot name="header"></slot>

    <van-pull-refresh class="f1" v-model="list.refreshing" @refresh="onRefresh">
      <div class="content">
        <van-list v-model:loading="list.loading" :finished="list.finished" @load="onLoad">
          <template v-if="!list.data.length && list.finished">
            <div class="flex-col items-center com-empty">
              <img class="img-empty" src="/images/empty.svg" alt="">
              <p class="black-9 font-14">暂无数据</p>
            </div>
          </template>
          <template v-for="item in list.data">
            <slot name="item" :item="item"></slot>
          </template>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="less">
.com-empty{
  padding: 50px 0;
}
.img-empty{
  width: 150px;

}
</style>
