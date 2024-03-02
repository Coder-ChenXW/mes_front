<template>
  <div class="app-container">
    <el-form ref="selectOrderForm" :model="selectOrderForm">
      <el-form-item prop="orderId" label="订单选择" label-width="80px">
        <el-select :v-model="selectOrderForm.orderId" placeholder="请选择订单" :value="selectOrderForm.orderId" @change="selectOrder">
          <el-option v-for="(item, index) in orderList" :key="index" :label="item.orderNo" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="warning" @click="exportExcel">导出</el-button>
    <el-divider />

    <el-table
      v-loading="listLoading"
      :data="orderInfo.items"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        fixed="left"
        width="210px"
        :label="'款式: ' + orderInfo.productName"
      >
        <el-table-column
          prop="date"
          width="60px"
          label="序号"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="craftName"
          width="150px"
          label="工序 \ 姓名"
        />
      </el-table-column>
      <el-table-column :label="'款号: ' + orderInfo.productNo">
        <template>
          {{ orderInfo.productNo }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="300px"
        label="合计"
      >
        <el-table-column
          prop="qty"
          width="150px"
          label="预期数量"
        />
        <el-table-column
          prop="totalQty"
          width="150px"
          label="实际数量"
        />
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import report from '@/api/report'
import order from '@/api/order'

export default {
  filters: {
    qtyRender(value) {
      if (value === 0) {
        return ''
      }
      return value
    }
  },
  data() {
    return {
      list: null,
      orderInfo: {
        productName: '',
        productNo: ''
      },
      orderList: null,
      employees: null,
      listLoading: true,
      searchPane: false,
      selectOrderForm: { orderId: '' },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.initOrderList()
  },
  methods: {
    initOrderList() {
      order.getProcessingOrders().then(response => {
        this.orderList = response.data
        this.listLoading = false
      })
    },
    selectOrder(value) {
      this.selectOrderForm.orderId = value
      this.fetchData(value)
    },
    exportExcel() {
      console.log(this.selectOrderForm.orderId)
      if (this.selectOrderForm.orderId === undefined || this.selectOrderForm.orderId === null || this.selectOrderForm.orderId === '') {
        this.$message({
          type: 'error',
          message: '请选择订单'
        })
        return false
      }
      report.orderReportBlob(this.selectOrderForm.orderId).then(response => {
        const reg = /^attachment.*filename="(.+)"$/
        const filename = reg.exec(response.headers['content-disposition'])[1]
        console.log(reg.exec(response.headers['content-disposition'])[1])
        this.downloadUrl(response.data, filename)
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    downloadUrl(res, name) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const fileName = name
      const eLink = document.createElement('a')
      eLink.download = fileName
      eLink.style.display = 'none'
      eLink.href = URL.createObjectURL(blob)
      document.body.appendChild(eLink)
      eLink.click()
      URL.revokeObjectURL(eLink.href)
      document.body.removeChild(eLink)
    },
    fetchData(orderId) {
      this.listLoading = true
      report.orderReport(orderId).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.orderInfo = data
        }
        this.listLoading = false
      })
    }
  }
}
</script>
