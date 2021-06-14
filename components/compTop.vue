<template>
  <div id="container_top">
    
    <div id="title">
    <div> </div>
      <div id="logoTop"><img id="logotop" src="../image/logoTop.png"></div>
    <div>
    </div> </div>
    </div>
</template>

<script>
export default {
  name: 'Control',
  data () {
    return {
      search: '',
      msg: '',
      Temlate: '',
      isModalVisible: 'true'
    }
  },
  watch: {

  },

  methods: {


    // SortData (e) {
    //   this.$emit('SortData', this.isModalVisible)
    // },

    
  }
}

</script>
<style scoped>
#container_top{
  background: mediumblue;
  text-align: center;
}
#logotop{
  height: 5rem;
}

</style>
