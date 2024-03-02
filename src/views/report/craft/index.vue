<template>
  <div class="app-container">
    <el-button type="warning" @click="exportExcel">导出</el-button>
    <el-divider />

    <el-table v-loading="listLoading" :data="orderList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="orderNo" label="订单编号" />
      <el-table-column prop="craftName" label="加工工艺" />
      <el-table-column prop="unitPrice" label="单价" width="120px">
        <template slot-scope="scope">{{ scope.row.unitPrice }} 元</template>
      </el-table-column>
      <el-table-column prop="qty" label="预期数量" width="120px" />
      <el-table-column prop="totalPrice" label="总价" width="120px">
        <template slot-scope="scope">{{ scope.row.totalPrice }} 元</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import report from '@/api/report'

export default {
  data() {
    return {
      orderList: [],
      listLoading: false
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    fetchOrders() {
      this.listLoading = true
      report.getOrderReportAll().then(response => {
        const { data } = response
        this.orderList = data
      }).catch(error => {
        console.error('Error fetching order report:', error)
      }).finally(() => {
        this.listLoading = false
      })
    },
    exportExcel() {
      report.exportOrderReport().then(response => {
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
        const fileName = 'order_report.xlsx'
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
      }).catch(error => {
        console.error('Error exporting order report:', error)
      })
    }
  }
}
</script>
