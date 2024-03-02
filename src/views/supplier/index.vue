<template>
  <div class="app-container">
    <el-button
      v-if="hasPerm('supplier.header.add')"
      type="primary"
      style="margin-left: 45px"
      @click="openAddDialog"
    >添加供应商</el-button>
    <el-button style="margin-left: 45px" icon="el-icon-search" @click="toggleSearchPane">搜索</el-button>
    <el-divider />
    <div v-if="searchPane" style="margin-left: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="供应商名称">
          <el-input v-model="searchForm.supplierName" />
        </el-form-item>
        <el-form-item label="经营范围">
          <el-input v-model="searchForm.manageRange" />
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
      <el-table-column align="center" label="供应商名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          {{ scope.row.contactPerson }}
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="供应商地址">
        <template slot-scope="scope">
          {{ scope.row.supplierAddress }}
        </template>
      </el-table-column>
      <el-table-column label="经营范围" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.manageRange }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: space-between;">
            <el-button
              v-if="hasPerm('supplier.content.detail')"
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
            >明细</el-button>
            <el-button v-if="hasPerm('supplier.content.update')" type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              v-if="hasPerm('supplier.content.delete')"
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

    <el-dialog title="添加供应商" :visible.sync="addDialog">
      <el-form ref="addForm" :model="addForm" :rules="addSupplierRules">
        <el-form-item prop="supplierName" label="供应商名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.supplierName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="contactPerson" label="负责人" :label-width="formLabelWidth">
          <el-input v-model="addForm.contactPerson" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="phone" label="负责人电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-form-item prop="supplierAddress" label="供应商地址" :label-width="formLabelWidth">
            <el-input v-model="addForm.supplierAddress" autocomplete="off" />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="manageRange" label="经营范围" :label-width="formLabelWidth">
          <el-input v-model="addForm.manageRange" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改供应商信息" :visible.sync="updateDialog">
      <el-form :model="updateForm" :rules="addSupplierRules">
        <el-form-item prop="supplierName" label="供应商名称" :label-width="formLabelWidth">
          <el-input v-model="updateForm.supplierName" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item prop="contactPerson" label="负责人" :label-width="formLabelWidth">
          <el-input v-model="updateForm.contactPerson" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="phone" label="负责人电话" :label-width="formLabelWidth">
          <el-input v-model="updateForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="supplierAddress" label="供应商地址" :label-width="formLabelWidth">
          <el-input v-model="updateForm.supplierAddress" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="manageRange" label="经营范围" :label-width="formLabelWidth">
          <el-input v-model="updateForm.manageRange" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogCancel">取消</el-button>
        <el-button type="primary" @click="updateDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="供应商明细" :visible.sync="viewDialog">
      <el-descriptions>
        <el-descriptions-item label="供应商名称">{{ viewDetail.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ viewDetail.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="负责人电话">{{ viewDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="供应商地址">{{ viewDetail.supplierAddress }}</el-descriptions-item>
        <el-descriptions-item label="经营范围">{{ viewDetail.manageRange }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import supplier from '@/api/supplier'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      searchPane: false,
      formLabelWidth: '120px',
      searchForm: { supplierName: '', manageRange: '' },
      paginationData: { size: 15, totalCount: 0 },
      addSupplierRules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        contactPerson: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
      },
      addForm: {
        supplierName: '',
        contactPerson: '',
        phone: '',
        supplierAddress: '',
        manageRange: ''
      },
      updateForm: {
        id: '',
        supplierName: '',
        contactPerson: '',
        phone: '',
        supplierAddress: '',
        manageRange: ''
      },
      viewDetail: {
        supplierName: '',
        contactPerson: '',
        phone: '',
        supplierAddress: '',
        manageRange: ''
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
      this.searchForm = { supplierName: '', manageRange: '' }
      this.searchFormCommit()
    },
    searchFormCommit() {
      const params = {
        pageIndex: 1,
        pageSize: 15,
        supplierName: this.searchForm.supplierName,
        manageRange: this.searchForm.manageRange
      }
      supplier.getSuppliers(params).then(response => {
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
          supplier.createSupplier(this.addForm).then(response => {
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
      supplier.updateSupplier(this.updateForm.supplierId, this.updateForm).then(response => {
        const { code } = response
        if (code === 20000) {
          this.updateDialog = false
          location.reload()
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
      this.$confirm('确认删除该供应商吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        supplier.deleteSupplier(row.supplierId).then(() => {
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
      supplier.getSuppliers(params).then(response => {
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
      supplier.getSuppliers(params).then(response => {
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
