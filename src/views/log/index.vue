<template>
  <div class="app-container">
    <el-divider />

    <div style="margin-left: 15px">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名" required>
          <el-input v-model="searchForm.username" placeholder="请输入用户名" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAllLogsByUsername">查询用户日志</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="日期" width="300">
        <template slot-scope="scope">
          {{ scope.row.logDate }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.logInfo }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="list.length > 0"
      :page-size="paginationData.pageSize"
      :current-page="paginationData.pageIndex"
      :pager-count="10"
      layout="prev, pager, next"
      :total="paginationData.totalCount"
      @current-change="handleCurrentPageChange"
    />
    <div v-else class="no-data-text">No data available</div>
  </div>
</template>

<script>
import log from '@/api/log'

export default {
  data() {
    return {
      listLoading: false,
      list: [],
      paginationData: {
        pageSize: 8,
        pageIndex: 1,
        totalCount: 0
      },
      searchForm: {
        username: ''
      }
    }
  },
  created() {
    this.getAllLogs()
  },
  methods: {
    handleSearchByUsername() {
      this.getAllLogsByUsername()
    },
    handleCurrentPageChange(pageIndex) {
      this.paginationData.pageIndex = pageIndex
      this.getAllLogs()
    },
    getAllLogs() {
      this.listLoading = true
      const { pageIndex, pageSize } = this.paginationData
      log.getAllLogs(pageIndex, pageSize)
        .then(response => {
          this.list = response.data.records
          this.paginationData.totalCount = response.data.total
        })
        .catch(error => {
          console.error('Error fetching all logs:', error)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    getAllLogsByUsername() {
      this.listLoading = true
      const { username } = this.searchForm
      if (username.trim() === '') {
        this.getAllLogs()
      } else {
        log.queryLogsByUsername(username)
          .then(response => {
            this.list = response.data
            this.paginationData.totalCount = response.data.totalCount
          })
          .catch(error => {
            console.error('Error fetching logs by username:', error)
          })
          .finally(() => {
            this.listLoading = false
          })
      }
    }
  }
}
</script>

<style>
.app-container {
  padding: 20px;
}

.no-data-text {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>
