<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="staticAvatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="openUpdatePwdDialog">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form ref="updatePwdForm" :model="updatePwdForm" :rules="updatePwdRules">
        <el-form-item prop="oldPassword" label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="updatePwdForm.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码" :label-width="formLabelWidth">
          <el-input v-model="updatePwdForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPasswordConfirm" label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="updatePwdForm.newPasswordConfirm" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdatePassword">取 消</el-button>
        <el-button type="primary" @click="confirmUpdatePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须超过6位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须超过6位'))
      } else if (this.updatePwdForm.newPassword !== this.updatePwdForm.newPasswordConfirm) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须超过6位'))
      } else if (this.updatePwdForm.newPasswordConfirm !== this.updatePwdForm.newPassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      updatePwdForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      updatePwdRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validateOldPassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPasswordConfirm: [{ required: true, trigger: 'blur', validator: validatePasswordConfirm }]
      },
      formLabelWidth: '120px',
      staticAvatar: require('@/assets/images/avatar.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    cancelUpdatePassword() {
      this.updatePwdForm = {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
      this.dialogFormVisible = false
    },
    confirmUpdatePassword() {
      this.$refs.updatePwdForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/updatePwd', this.updatePwdForm).then(() => {
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
        } else {
          return false
        }
      })
    },
    openUpdatePwdDialog() {
      this.updatePwdForm = {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
