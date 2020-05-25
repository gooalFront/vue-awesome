<template>
  <div class="about">
    <h1 @click="msg = 'asd'">{{ msg }}</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "This is an about page"
    };
  }
};
</script>
