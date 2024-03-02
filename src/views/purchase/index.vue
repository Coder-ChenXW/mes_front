<template>
  <div class="app-container">
    <el-button
      v-if="hasPerm('purchase.header.add')"
      type="primary"
      style="margin-left: 45px"
      @click="openAddDialog"
    >采购入库</el-button>
    <el-button style="margin-left: 45px" icon="el-icon-search" @click="toggleSearchPane">搜索</el-button>
    <el-divider />
    <div v-if="searchPane" style="margin-left: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="材料编号">
          <el-input v-model="searchForm.materialCode" />
        </el-form-item>
        <el-form-item label="厂家">
          <el-input v-model="searchForm.vender" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="clearSearchForm">清空</el-button>
          <el-button type="primary" @click="searchFormCommit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="#" width="45">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="材料编号" width="200">
        <template slot-scope="scope">
          {{ scope.row.materialCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="材料名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.materialName }}
        </template>
      </el-table-column>
      <el-table-column label="厂家">
        <template slot-scope="scope">
          {{ scope.row.vender }}
        </template>
      </el-table-column>
      <el-table-column label="采购价格" width="95">
        <template slot-scope="scope">
          {{ scope.row.purchasePrice }}
        </template>
      </el-table-column>
      <el-table-column label="采购数量" width="95">
        <template slot-scope="scope">
          {{ scope.row.purchaseQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="采购总金额" width="95">
        <template slot-scope="scope">
          {{ scope.row.purchasePrice * scope.row.purchaseQuantity }}元
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: space-between;">
            <el-button
              v-if="hasPerm('purchase.content.detail')"
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
            >明细</el-button>
            <el-button
              v-if="hasPerm('purchase.content.update')"
              type="warning"
              size="small"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              v-if="hasPerm('purchase.content.delete')"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </div>
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

    <el-dialog title="采购入库" :visible.sync="addDialog">
      <el-form ref="addForm" :model="addForm" :rules="addPurchaseRules">
        <el-form-item prop="materialCode" label="材料编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.materialCode" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="materialName" label="材料名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.materialName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="vender" label="厂家" :label-width="formLabelWidth">
          <el-input v-model="addForm.vender" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="purchasePrice" label="采购价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.purchasePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="purchaseQuantity" label="采购数量" :label-width="formLabelWidth">
          <el-input v-model="addForm.purchaseQuantity" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改采购记录" :visible.sync="updateDialog">
      <el-form ref="updateForm" :model="updateForm" :rules="addPurchaseRules">
        <el-form-item prop="materialCode" label="材料编号" :label-width="formLabelWidth">
          <el-input v-model="updateForm.materialCode" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item prop="materialName" label="材料名称" :label-width="formLabelWidth">
          <el-input v-model="updateForm.materialName" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item prop="vender" label="厂家" :label-width="formLabelWidth">
          <el-input v-model="updateForm.vender" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item prop="purchasePrice" label="采购价格" :label-width="formLabelWidth">
          <el-input v-model="updateForm.purchasePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="purchaseQuantity" label="采购数量" :label-width="formLabelWidth">
          <el-input v-model="updateForm.purchaseQuantity" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogCancel">取消</el-button>
        <el-button type="primary" @click="updateDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="采购记录明细" :visible.sync="viewDialog">
      <el-descriptions>
        <el-descriptions-item label="材料编号">{{ viewDetail.materialCode }}</el-descriptions-item>
        <el-descriptions-item label="材料名称">{{ viewDetail.materialName }}</el-descriptions-item>
        <el-descriptions-item label="厂家">{{ viewDetail.vender }}</el-descriptions-item>
        <el-descriptions-item label="采购价格">{{ viewDetail.purchasePrice }}</el-descriptions-item>
        <el-descriptions-item label="采购数量">{{ viewDetail.purchaseQuantity }}</el-descriptions-item>
        <el-descriptions-item label="采购总金额">{{ viewDetail.purchasePrice * viewDetail.purchaseQuantity
        }}元</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import purchase from '@/api/purchase'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      searchPane: false,
      formLabelWidth: '120px',
      searchForm: { materialCode: '', vender: '' },
      paginationData: { size: 15, totalCount: 0 },
      addPurchaseRules: {
        materialCode: [{ required: true, message: '请输入材料编号', trigger: 'blur' }],
        materialName: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        vender: [{ required: true, message: '请输入厂家名称', trigger: 'blur' }],
        purchasePrice: [{ required: true, message: '请输入采购价格', trigger: 'blur' }],
        purchaseQuantity: [{ required: true, message: '请输入采购数量', trigger: 'blur' }]
      },
      addForm: {
        materialCode: '',
        materialName: '',
        vender: '',
        purchasePrice: '',
        purchaseQuantity: ''
      },
      updateForm: {
        materialCode: '',
        materialName: '',
        vender: '',
        purchasePrice: '',
        purchaseQuantity: ''
      },
      viewDetail: {
        materialCode: '',
        materialName: '',
        vender: '',
        purchasePrice: '',
        purchaseQuantity: ''
      },
      addDialog: false,
      viewDialog: false,
      updateDialog: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toggleSearchPane() {
      this.searchPane = !this.searchPane
    },
    clearSearchForm() {
      this.searchForm = { materialCode: '', vender: '' }
      this.searchFormCommit()
    },
    searchFormCommit() {
      const params = {
        pageIndex: 1,
        pageSize: 15,
        materialCode: this.searchForm.materialCode,
        vender: this.searchForm.vender
      }
      purchase.getPurchaseRecords(params).then(response => {
        this.listLoading = true
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },
    addDialogCancel() {
      this.addDialog = false
      this.resetAddForm()
    },
    addDialogConfirm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          purchase.createPurchase(this.addForm).then(response => {
            this.resetAddForm()
            this.addDialog = false
            this.fetchData()
          })
        } else {
          return false
        }
      })
    },
    updateDialogCancel() {
      this.updateDialog = false
    },
    updateDialogConfirm() {
      purchase.updatePurchase(this.updateForm.purchaseId, this.updateForm).then(response => {
        const { code } = response
        if (code === 20000) {
          this.updateDialog = false
          this.fetchData()
        }
      })
    },
    handleDetail(row) {
      this.viewDialog = true
      this.viewDetail = row
    },
    handleEdit(row) {
      this.updateDialog = true
      this.updateForm = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('确认删除该采购记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        purchase.deletePurchase(row.purchaseId).then(() => {
          this.fetchData()
        })
      }).catch(() => { })
    },
    handleCurrentPageChange(pageIndex) {
      this.listLoading = true
      const params = {
        pageIndex: pageIndex,
        pageSize: 15
      }
      purchase.getPurchaseRecords(params).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.listLoading = false
        }
      })
    },
    openAddDialog() {
      this.addDialog = true
    },
    fetchData() {
      this.listLoading = true
      const params = {
        pageIndex: 1,
        pageSize: 15
      }
      purchase.getPurchaseRecords(params).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },
    resetAddForm() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style>
.app-container {
  padding: 20px;
}
</style>
