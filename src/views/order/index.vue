<template>
  <div class="app-container">
    <el-button v-if="hasPerm('order.header.add')" type="primary" style="margin-left: 45px" @click="openAddDialog">创建订单</el-button>
    <el-button v-if="hasPerm('order.header.cutting')" type="warning" style="margin-left: 45px" @click="openCuttingDialog">裁床加工</el-button>
    <el-button v-if="hasPerm('order.header.finish')" type="warning" style="margin-left: 45px" @click="openSewingDialog">员工缝纫</el-button>
    <el-button style="margin-left: 45px" icon="el-icon-search" @click="searchPane = searchPane!==true">搜索</el-button>
    <el-divider />
    <div v-if="searchPane" style="margin-left: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" />
        </el-form-item>
        <el-form-item label="客户订单号">
          <el-input v-model="searchForm.customerOrderNo" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status">
            <el-option label="已录入" value="0" />
            <el-option label="已裁剪" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="clearSearchForm">清空</el-button>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="#" width="45">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" width="200">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户订单编号" width="200">
        <template slot-scope="scope">
          {{ scope.row.customerOrderNo }}
        </template>
      </el-table-column>
      <el-table-column label="订单名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" width="95">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="95">
        <template slot-scope="scope">
          {{ scope.row.qty }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status|statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTs" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('order.content.detail')" type="primary" size="small" @click="handleDetail(scope.row)">明细</el-button>
          <el-button v-if="hasPerm('order.content.update')" type="warning" size="small" :disabled="editable(scope.row)" @click="handleEdit(scope.row)">修改</el-button>
          <el-button v-if="hasPerm('order.content.delete')" type="text" :disabled="editable(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="paginationData.size"
      :pager-count="11"
      layout="prev, pager, next"
      :total="paginationData.totalCount"
      @current-change="handleCurrentPageChange"
    />
    <el-dialog title="创建订单" :visible.sync="addDialog">
      <el-form ref="addForm" :model="addForm" :rules="addOrderRules">
        <el-form-item prop="orderNo" label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.orderNo" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="customerOrderNo" label="客户订单编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.customerOrderNo" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="qty" label="数量" :label-width="formLabelWidth">
          <el-input v-model="addForm.qty" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item prop="productId" label="产品选择" :label-width="formLabelWidth">
          <el-select :v-model="addForm.productId" placeholder="请选择产品" :value="addForm.productId" @change="selectProduct">
            <el-option v-for="(item, index) in productList" :key="index" :label="item.productName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-divider />
        <el-table
          v-if="productListTable"
          v-loading="listLoading"
          :data="addForm.items"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="#" width="45">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="颜色分类" width="200">
            <template slot-scope="scope">
              {{ scope.row.productLabelDescription }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" width="">
            <template slot-scope="scope">
              <el-input v-model="scope.row.qty" placeholder="请输入数量" clearable @blur="computeTotalQty('add')" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改订单" :visible.sync="updateDialog">
      <el-form ref="updateForm" :model="updateForm" :rules="addOrderRules">
        <el-form-item prop="orderNo" label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="updateForm.orderNo" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="customerOrderNo" label="客户订单编号" :label-width="formLabelWidth">
          <el-input v-model="updateForm.customerOrderNo" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="qty" label="数量" :label-width="formLabelWidth">
          <el-input v-model="updateForm.qty" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item prop="productId" label="产品选择" :label-width="formLabelWidth">
          <el-select :v-model="updateForm.productId" placeholder="请选择产品" :value="updateForm.productId" @change="selectProduct">
            <el-option v-for="(item, index) in productList" :key="index" :label="item.productName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-divider />
        <el-table
          v-loading="listLoading"
          :data="updateForm.items"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="#" width="45">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="颜色分类" width="200">
            <template slot-scope="scope">
              {{ scope.row.productLabelDescription }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" width="">
            <template slot-scope="scope">
              <el-input v-model="scope.row.qty" placeholder="请输入数量" clearable @blur="computeTotalQty('update')" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogCancel">取消</el-button>
        <el-button type="primary" @click="updateDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="订单明细" :visible.sync="viewDialog">
      <el-descriptions class="margin-top" title="基本信息" :column="3">
        <el-descriptions-item label="订单编号">{{ viewDetail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户订单编号">{{ viewDetail.customerOrderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单名称">{{ viewDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ viewDetail.productName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ viewDetail.qty }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewDetail.status|statusFilter }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewDetail.createByName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewDetail.createTs }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ viewDetail.updateTs }}</el-descriptions-item>
      </el-descriptions>

      <span class="el-descriptions__title" style="color: #303133">订单明细</span>
      <el-table :data="viewDetail.items" stripe style="width: 100%">
        <el-table-column prop="productLabelDescription" label="颜色" />
        <el-table-column prop="qty" label="数量" />
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog title="裁床加工" :visible.sync="cuttingDialog">
      <el-form ref="cuttingForm" :model="cuttingForm" :rules="cuttingOrderRules">
        <el-form-item prop="orderId" label="订单选择" :label-width="formLabelWidth">
          <el-select :v-model="cuttingForm.orderId" placeholder="请选择订单" :value="cuttingForm.orderId" @change="selectCuttingOrder">
            <el-option v-for="(item, index) in createdOrderList" :key="index" :label="item.orderNo" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-descriptions class="margin-top" :column="3">
          <el-descriptions-item label="订单编号">{{ cuttingForm.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="客户订单编号">{{ cuttingForm.customerOrderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单名称">{{ cuttingForm.name }}</el-descriptions-item>
          <el-descriptions-item label="产品">{{ cuttingForm.productName }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ cuttingForm.orderQty }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <el-form-item prop="waitProcessQty" label="扎号" label-width="100px">
          <el-input v-model="cuttingForm.packageNo" placeholder="请输入扎号" clearable />
        </el-form-item>
        <el-form-item prop="qty" label="数量" label-width="100px">
          <el-input v-model="cuttingForm.packageQty" placeholder="加工数量" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: 5px" @click="addCuttingRow">添加</el-button>
        </el-form-item>
        <el-divider />
        <el-table
          :data="cuttingForm.items"
          stripe
          style="width: 100%"
        >
          <el-table-column label="扎号">
            <template slot-scope="scope">
              {{ scope.row.packageNo }}
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              {{ scope.row.packageQty }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="removeCuttingRow(scope.row.packageNo)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cuttingDialogCancel">取消</el-button>
        <el-button type="primary" @click="cuttingDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="员工缝纫" :visible.sync="sewingDialog">
      <el-form ref="sewingForm" :model="sewingForm" :rules="sewingOrderRules">
        <el-form-item prop="orderId" label="订单选择" :label-width="formLabelWidth">
          <el-select :v-model="sewingForm.orderId" placeholder="请选择订单" :value="sewingForm.orderId" @change="selectSewingOrder">
            <el-option v-for="(item, index) in createdOrderList" :key="index" :label="item.orderNo" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-descriptions class="margin-top" :column="3">
          <el-descriptions-item label="订单编号">{{ sewingForm.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="客户订单编号">{{ sewingForm.customerOrderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单名称">{{ sewingForm.name }}</el-descriptions-item>
          <el-descriptions-item label="产品">{{ sewingForm.productName }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ sewingForm.orderQty }}</el-descriptions-item>
        </el-descriptions>
        <el-form-item prop="qty" label="数量" label-width="100px">
          <el-input v-model="sewingForm.packageQty" placeholder="加工数量" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: 5px" @click="addSewingRow">添加</el-button>
        </el-form-item>

        <el-divider />

        <el-table
          :data="sewingForm.items"
          stripe
          style="width: 100%"
        >
          <el-table-column label="数量">
            <template slot-scope="scope">
              {{ scope.row.packageQty }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="removeSewingRow(scope.row.packageNo)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="sewingDialogCancel">取消</el-button>
        <el-button type="primary" @click="sewingDialogConfirm">确定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
import order from '@/api/order'
import product from '@/api/product'

export default {
  filters: {
    statusFilter(status) {
      return { 0: '已录入', 1: '已裁出', 2: '已完成' }[status]
    },
    statusTagFilter(status) {
      return { 0: 'warning', 1: 'primary', 2: 'success' }[status]
    }
  },
  data() {
    const validateOrderNo = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z\-]{4,23}$/
      if (value === undefined || value.length === 0 || !reg.test(value)) {
        callback(new Error('请输入订单编号'))
      } else {
        callback()
      }
    }
    const validateCustomerOrderNo = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z\-]{4,23}$/
      if (value === undefined || value.length === 0 || !reg.test(value)) {
        callback(new Error('请输入客户订单编号'))
      } else {
        callback()
      }
    }
    const validateOrderName = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请输入订单名称'))
      } else {
        callback()
      }
    }
    const validateQty = (rule, value, callback) => {
      if (value === undefined || value <= 0) {
        callback(new Error('数量不合法'))
      } else {
        callback()
      }
    }
    const validateCuttingQty = (rule, value, callback) => {
      if (value === undefined || value <= 0) {
        callback(new Error('数量不合法'))
      } else if (Number(value) !== this.cuttingForm.qty) {
        callback(new Error('实裁数必须等于订单数'))
      } else {
        callback()
      }
    }
    const validateProductId = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请选择产品'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      searchPane: false,
      productList: null,
      orderScheduleList: null,
      createdOrderList: null,
      cuttingOrderList: null,
      scheduleOrderList: null,
      orderCraftList: null,
      employeeList: null,
      productLabels: null,

      addDialog: false,
      cuttingDialog: false,
      sewingDialog: false,
      updateDialog: false,
      viewDialog: false,

      productListTable: false,
      addScheduleRowV: false,
      formLabelWidth: '120px',

      addOrderRules: {
        orderNo: [{ required: true, trigger: 'blur', validator: validateOrderNo }],
        customerOrderNo: [{ required: true, trigger: 'blur', validator: validateCustomerOrderNo }],
        name: [{ required: true, trigger: 'blur', validator: validateOrderName }],
        qty: [{ required: true, trigger: 'blur', validator: validateQty }],
        productId: [{ required: true, trigger: 'blur', validator: validateProductId }]
      },
      cuttingOrderRules: {
        cuttingQty: [{ required: true, trigger: 'blur', validator: validateCuttingQty }]
      },
      paginationData: {
        size: 15,
        totalCount: 0
      },
      addScheduleForm: {
        qty: 0
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 15,
        orderNo: '',
        customerOrderNo: '',
        status: ''
      },
      updateForm: {
        id: '',
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        qty: '',
        items: []
      },
      viewDetail: {
        productNo: '',
        productName: '',
        colorLabels: [],
        status: '',
        create_by: '',
        create_ts: '',
        update_ts: ''
      },
      addForm: {
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        qty: '',
        items: []
      },
      cuttingForm: this.emptyCuttingForm(),
      sewingForm: this.emptySewingForm(),
      products: []

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    clearSearchForm() {
      this.searchForm = { pageIndex: 1, pageSize: 15, orderNo: '', customerOrderNo: '', status: '' }
      this.fetchData()
    },
    handleEdit(row) {
      this.updateDialog = true
      this.initProductList()
      this.updateForm = row
    },
    handleDetail(row) {
      console.log(row)
      this.viewDialog = true
      this.viewDetail = row
    },
    deleteRow(row) {
      order.deleteOrder(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.searchForm = {
            orderNo: '',
            customerOrderNo: '',
            status: ''
          }
          this.fetchData()
        } else {
          return false
        }
      })
    },
    addCuttingRow() {
      this.removeCuttingRow(this.cuttingForm.packageNo)
      this.cuttingForm.items.push({ packageNo: this.cuttingForm.packageNo, packageQty: this.cuttingForm.packageQty })
      this.cuttingForm.packageNo = ''
      this.cuttingForm.packageQty = 0
    },
    addSewingRow() {
      this.removeSewingRow(this.sewingForm.packageNo)
      this.sewingForm.items.push({ packageNo: this.sewingForm.packageNo, packageQty: this.sewingForm.packageQty })
      this.sewingForm.packageNo = ''
      this.sewingForm.packageQty = 0
    },
    removeCuttingRow(packageNo) {
      this.cuttingForm.items = this.cuttingForm.items.filter(p => p.packageNo !== packageNo)
    },
    removeSewingRow(packageNo) {
      this.sewingForm.items = this.sewingForm.items.filter(p => p.packageNo !== packageNo)
    },
    handleCurrentPageChange(pageIndex) {
      this.listLoading = true
      this.searchForm.pageIndex = pageIndex
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      order.orderPage(this.searchForm).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },
    openAddDialog() {
      this.addDialog = true
      this.initProductList()
    },
    openCuttingDialog() {
      this.cuttingDialog = true
      this.initCreatedOrderList()
    },
    openSewingDialog() {
      this.sewingDialog = true
      this.initCuttedOrderList()
    },
    selectProduct(value) {
      this.productListTable = true
      this.productList.forEach(p => {
        if (p.id === value) {
          const orderItems = []
          p.labels.forEach(l => {
            orderItems.push({
              productId: p.id,
              productLabelId: l.id,
              productLabelDescription: l.description,
              qty: 0
            })
          })
          this.addForm.productId = p.id
          this.addForm.productNo = p.productNo
          this.addForm.productName = p.productName
          this.addForm.items = orderItems

          this.updateForm.productId = p.id
          this.updateForm.productNo = p.productNo
          this.updateForm.productName = p.productName
          this.updateForm.items = orderItems
        }
      })
    },
    selectCuttingOrder(value) {
      const orders = this.createdOrderList.filter(o => o.id === value)
      if (orders.length !== 1) {
        this.$message({
          type: 'error',
          message: '!!!错误!!!'
        })
      } else {
        const order = orders[0]
        this.cuttingForm = {
          orderId: order.id,
          orderNo: order.orderNo,
          customerOrderNo: order.customerOrderNo,
          name: order.name,
          productId: order.productId,
          productNo: order.productNo,
          productName: order.productName,
          orderQty: order.qty,
          items: [],
          packageNo: '',
          packageQty: 0
        }
      }
    },
    selectSewingOrder(value) {
      const orders = this.createdOrderList.filter(o => o.id === value)
      if (orders.length !== 1) {
        this.$message({
          type: 'error',
          message: '!!!错误!!!'
        })
      } else {
        const order = orders[0]
        this.sewingForm = {
          orderId: order.id,
          orderNo: order.orderNo,
          customerOrderNo: order.customerOrderNo,
          name: order.name,
          productId: order.productId,
          productNo: order.productNo,
          productName: order.productName,
          orderQty: order.qty,
          items: [],
          packageNo: '',
          packageQty: 0
        }
      }
    },
    initProductList() {
      product.getActivatedProduct().then(response => {
        this.productList = response.data
        this.listLoading = false
      })
    },
    initCreatedOrderList() {
      order.getCreatedOrders().then(response => {
        this.createdOrderList = response.data
        this.listLoading = false
      })
    },
    initCuttedOrderList() {
      order.getCuttingOrders().then(response => {
        this.createdOrderList = response.data
        this.listLoading = false
      })
    },
    computeTotalQty(loc) {
      let qty = 0
      if (loc === 'add') {
        this.addForm.items.forEach(item => {
          qty = Number(qty) + Number(item.qty)
        })
        this.addForm.qty = qty
      } else {
        this.updateForm.items.forEach(item => {
          qty = Number(qty) + Number(item.qty)
        })
        this.updateForm.qty = qty
      }
    },
    addDialogCancel() {
      this.addDialog = false
      this.resetAddDialog()
    },
    addDialogConfirm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          const data = {
            'order': {
              'productId': this.addForm.productId,
              'productNo': this.addForm.productNo,
              'productName': this.addForm.productName,
              'orderNo': this.addForm.orderNo,
              'customerOrderNo': this.addForm.customerOrderNo,
              'name': this.addForm.name,
              'qty': this.addForm.qty
            },
            'items': this.addForm.items
          }
          order.createOrder(data).then(response => {
            const { code } = response
            if (code === 20000) {
              this.resetAddDialog()
              this.addDialog = false
              this.fetchData()
            }
          })
        } else {
          return false
        }
      })
    },
    resetAddDialog() {
      this.addForm = {
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        qty: '',
        items: []
      }
    },
    resetUpdateDialog() {
      this.addForm = {
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        qty: '',
        items: []
      }
    },
    updateDialogCancel() {
      this.updateDialog = false
      this.resetUpdateDialog()
    },
    updateDialogConfirm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          const data = {
            'order': {
              'id': this.updateForm.id,
              'productId': this.updateForm.productId,
              'productName': this.updateForm.productName,
              'orderNo': this.updateForm.orderNo,
              'customerOrderNo': this.updateForm.customerOrderNo,
              'name': this.updateForm.name,
              'qty': this.updateForm.qty
            },
            'items': this.updateForm.items
          }
          order.updateOrder(this.updateForm.id, data).then(response => {
            const { code } = response
            if (code === 20000) {
              this.resetUpdateDialog()
              this.updateDialog = false
              this.fetchData()
            }
          })
        } else {
          return false
        }
      })
    },
    editable(row) {
      return row.status !== 0
    },
    cuttingDialogCancel() {
      this.cuttingForm = this.emptyCuttingForm()
      this.cuttingDialog = false
    },
    sewingDialogCancel() {
      this.sewingForm = this.emptySewingForm()
      this.sewingDialog = false
    },
    cuttingDialogConfirm() {
      const totalPackageQty = this.cuttingForm.items.reduce((total, item) => total + parseInt(item.packageQty), 0)

      if (totalPackageQty !== parseInt(this.cuttingForm.orderQty)) {
        this.$message({
          type: 'error',
          message: `裁出数量错误, 当前合计: [${totalPackageQty}], 订单合计: [${this.cuttingForm.orderQty}]`
        })
      } else {
        const data = { qty: totalPackageQty }
        order.finishOrder(this.cuttingForm.orderId, data).then(response => {
          const { code } = response
          if (code === 20000) {
            this.cuttingDialog = false
            this.fetchData()
          }
        }).catch(error => {
          console.error('裁剪订单失败:', error)
          this.$message.error('裁剪订单失败，请稍后重试！')
        })
      }
    },
    sewingDialogConfirm() {
      const totalPackageQty = this.sewingForm.items.reduce((total, item) => total + parseInt(item.packageQty), 0)

      if (totalPackageQty !== parseInt(this.sewingForm.orderQty)) {
        this.$message({
          type: 'error',
          message: `缝纫数量错误, 当前合计: [${totalPackageQty}], 订单合计: [${this.sewingForm.orderQty}]`
        })
      } else {
        const data = { qty: totalPackageQty }
        order.finishOrder(this.sewingForm.orderId, data).then(response => {
          const { code } = response
          if (code === 20000) {
            this.sewingDialog = false
            this.fetchData()
          }
        }).catch(error => {
          console.error('缝纫订单失败:', error)
          this.$message.error('缝纫订单失败，请稍后重试！')
        })
      }
    },
    emptyCuttingForm() {
      return {
        orderId: '',
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        orderQty: '',
        cuttingQty: '',
        items: [],
        packageNo: '',
        packageQty: ''
      }
    },
    emptySewingForm() {
      return {
        orderId: '',
        orderNo: '',
        customerOrderNo: '',
        name: '',
        productId: '',
        productNo: '',
        productName: '',
        orderQty: '',
        cuttingQty: '',
        items: [],
        packageNo: '',
        packageQty: ''
      }
    }
  }
}
</script>
