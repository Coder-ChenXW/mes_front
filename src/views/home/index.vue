<template>
  <div
    class="home-container"
    :style="{ backgroundImage: 'url(' + bg + ')', backgroundSize: '25%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }"
  >
    <div class="home-text">欢迎: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      bg: require('@/assets/images/home-background.png')
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
    height: 80vh;
  }

  &-desc {
    font-size: 105px;
    line-height: 120px;
    padding: 20px 0;
    text-align: center;
    margin-top: 140px;
  }

  &-text {
    font-size: 16px;
    font-weight: 700;
    line-height: 46px;
  }
}</style>
