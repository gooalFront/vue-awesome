<template>
  <div class="hello">
    <h1 @click="msg = 12312312321">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: 123
    };
  },
  methods: {
    handleColorChange(e) {
      const root = document.documentElement;
      root.style.setProperty("--color", e.target.value);
    }
  }
};
</script>
