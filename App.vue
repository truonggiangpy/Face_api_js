<template>
  <div id="app">
    <CompTop/>
    <CompContent/>
  </div>
</template>

<script>
import CompTop from './components/compTop'
import CompContent from './components/compContent'
import "regenerator-runtime"
export default {
  name: 'Face-api-js',
  components: {
    CompTop,
    CompContent
  },
 
}


</script>

<style >

body{
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}

</style>
