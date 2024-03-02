<template>
  <div class="app-container">
    <el-button v-if="hasPerm('order.header.add')" type="primary" style="margin-left: 45px" @click="openAddDialog">添加员工</el-button>
    <el-button style="margin-left: 45px" icon="el-icon-search" @click="searchPane = searchPane!==true">搜索</el-button>
    <el-divider />
    <div v-if="searchPane" style="margin-left: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="员工号">
          <el-input v-model="searchForm.employeeNo" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.employeeName" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status">
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="clearSearchForm">清空</el-button>
          <el-button type="primary" @click="searchFormCommit">查询</el-button>
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
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工号" width="220">
        <template slot-scope="scope">
          {{ scope.row.employeeNo }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.employeeName }}
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleId|roleNameFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status|statusTagFilter">{{ scope.row.status|statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTs" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('employee.content.detail')" type="primary" size="small" @click="handleDetail(scope.row)">明细</el-button>
          <el-button v-if="hasPerm('employee.content.update')" type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <div v-if="hasPerm('employee.content.delete')" style="display: inline; margin-left: 8px">
            <el-button v-if="scope.row.status===1" slot="reference" type="text" size="small" @click="handleInactive(scope.row)">停用</el-button>
            <el-button v-else slot="reference" type="text" size="small" @click="handleActive(scope.row)">启用</el-button>
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

    <el-dialog title="添加员工" :visible.sync="addDialog">
      <el-form ref="addForm" :model="addForm" :rules="addEmployeeRules">
        <el-form-item prop="employeeNo" label="员工号" :label-width="formLabelWidth">
          <el-input v-model="addForm.employeeNo" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="employeeName" label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="addForm.employeeName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="gender" label="性别" :label-width="formLabelWidth">
          <el-radio v-model="addForm.gender" label="1" value="1">男</el-radio>
          <el-radio v-model="addForm.gender" label="2" value="2">女</el-radio>
        </el-form-item>
        <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.tel" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="roleId" label="角色" :label-width="formLabelWidth">
          <el-select v-model="addForm.roleId" placeholder="请选择角色">
            <el-option label="管理员" value="1" />
            <el-option label="人事" value="2" />
            <el-option label="裁床" value="3" />
            <el-option label="员工" value="4" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改员工" :visible.sync="updateDialog">
      <el-form :model="updateForm" :rules="addEmployeeRules">
        <el-form-item prop="employeeNo" label="员工号" :label-width="formLabelWidth">
          <el-input v-model="updateForm.employeeNo" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item prop="employeeName" label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="updateForm.employeeName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="gender" label="性别" :label-width="formLabelWidth">
          <el-radio v-model="updateForm.gender" :label="1">男</el-radio>
          <el-radio v-model="updateForm.gender" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
          <el-input v-model="updateForm.tel" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="roleId" label="角色" :label-width="formLabelWidth">
          <el-select v-model="updateForm.roleId" placeholder="请选择角色">
            <el-option label="管理员" :value="1" />
            <el-option label="人事" :value="2" />
            <el-option label="裁床" :value="3" />
            <el-option label="员工" :value="4" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogCancel">取消</el-button>
        <el-button type="primary" @click="updateDialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="员工明细" :visible.sync="viewDialog">
      <el-descriptions>
        <el-descriptions-item label="员工号">{{ viewDetail.employeeNo }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ viewDetail.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ viewDetail.gender|genderNameFilter }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ viewDetail.roleId|roleNameFilter }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ viewDetail.tel }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewDetail.status|statusNameFilter }}</el-descriptions-item>
        <el-descriptions-item label="入职时间">{{ viewDetail.createTs }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import employee from '@/api/employee'
import { validPhone } from '@/utils/validate'

export default {
  filters: {
    statusTagFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusNameMap = {
        1: '启用',
        0: '停用'
      }
      return statusNameMap[status]
    },
    genderNameFilter(status) {
      const genderNameMap = {
        1: '男',
        2: '女'
      }
      return genderNameMap[status]
    },
    roleNameFilter(roleId) {
      const roleNameMap = {
        1: '管理员',
        2: '人事',
        3: '裁床师傅',
        4: '员工'
      }
      return roleNameMap[roleId]
    }
  },
  data() {
    const validateEmployeeNo = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z]{4,23}$/
      if (value === undefined || value.length === 0 || !reg.test(value)) {
        callback(new Error('请输入员工号'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === undefined || value.length === 0) {
        callback(new Error('请输入员工姓名'))
      } else {
        callback()
      }
    }
    const validateGender = (rule, value, callback) => {
      if (value === undefined || value < 1 || value > 2) {
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    const validateRoleId = (rule, value, callback) => {
      if (value === undefined || value < 1 || value > 4) {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    const validateTel = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的电话号码'))
      } else {
        callback()
      }
    }

    return {
      list: null,
      listLoading: true,
      searchPane: false,
      formLabelWidth: '120px',
      searchForm: { employeeNo: '', employeeName: '', status: '' },
      paginationData: { size: 15, totalCount: 0 },
      addEmployeeRules: {
        employeeNo: [{ required: true, trigger: 'blur', validator: validateEmployeeNo }],
        employeeName: [{ required: true, trigger: 'blur', validator: validateName }],
        gender: [{ required: true, trigger: 'blur', validator: validateGender }],
        tel: [{ required: false, trigger: 'blur', validator: validateTel }],
        roleId: [{ required: true, trigger: 'blur', validator: validateRoleId }]
      },
      addForm: {
        employeeNo: '',
        employeeName: '',
        gender: '1',
        tel: '',
        roleId: ''
      },
      updateForm: {
        employeeNo: '',
        employeeName: '',
        gender: '1',
        tel: '',
        roleId: ''
      },
      viewDetail: {
        employeeNo: '',
        employeeName: '',
        roleId: '',
        status: '',
        create_ts: ''
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
    clearSearchForm() {
      this.searchForm = { employeeNo: '', employeeName: '', status: '' }
      this.searchFormCommit()
    },
    searchFormCommit() {
      const params = {
        pageIndex: 1,
        pageSize: 15,
        employeeNo: this.searchForm.employeeNo,
        employeeName: this.searchForm.employeeName,
        status: this.searchForm.status
      }
      employee.employeePage(params).then(response => {
        this.listLoading = true
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    },
    resetAddDialog() {
      this.addForm = {
        employeeNo: '',
        employeeName: '',
        gender: '1',
        tel: '',
        role: ''
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
            'employee': {
              'employeeNo': this.addForm.employeeNo,
              'employeeName': this.addForm.employeeName,
              'gender': this.addForm.gender,
              'tel': this.addForm.tel
            },
            'user': {
              'username': this.addForm.tel,
              'password': '888888',
              'nickname': this.addForm.employeeName,
              'avatar': '',
              'age': '',
              'tel': this.addForm.tel,
              'gender': this.addForm.gender,
              'email': ''
            },
            'role': {
              'id': this.addForm.roleId
            }
          }
          employee.createEmployee(data).then(response => {
            this.resetAddDialog()
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
      employee.updateEmployee(this.updateForm.id, this.updateForm).then(response => {
        const { code } = response
        if (code === 20000) {
          this.updateDialog = false
        }
      })
    },
    deleteRow(row) {
      employee.deleteEmployee(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.fetchData()
        }
      })
    },
    handleEdit(row) {
      this.updateDialog = true
      this.updateForm = row
    },
    handleDetail(row) {
      this.viewDialog = true
      this.viewDetail = row
    },
    handleCurrentPageChange(pageIndex) {
      this.listLoading = true
      const params = {
        pageIndex: pageIndex,
        pageSize: 15
      }
      employee.employeePage(params).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },
    openAddDialog() {
      this.addDialog = true
      this.resetAddDialog()
    },
    handleInactive(row) {
      employee.inactiveEmployee(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.searchForm = { employeeNo: '', employeeName: '', status: '' }
          this.fetchData()
        }
      })
    },
    handleActive(row) {
      employee.activeEmployee(row.id).then(response => {
        const { code } = response
        if (code === 20000) {
          this.searchForm = { employeeNo: '', employeeName: '', status: '' }
          this.fetchData()
        }
      })
    },
    fetchData() {
      this.listLoading = true
      const params = {
        pageIndex: 1,
        pageSize: 15
      }
      employee.employeePage(params).then(response => {
        const { code, data } = response
        if (code === 20000) {
          this.list = data.records
          this.paginationData.totalCount = data.total
        }
        this.listLoading = false
      })
    }
  }
}
</script>
