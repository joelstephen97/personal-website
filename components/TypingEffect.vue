<template>
    <span ref="el"></span>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Typed from 'typed.js'
  
  const props = defineProps({
    strings: {
      type: Array,
      required: true
    },
    typeSpeed: {
      type: Number,
      default: 100
    },
    backSpeed: {
      type: Number,
      default: 25
    },
    loop: {
      type: Boolean,
      default: true
    }
  })
  
  const el = ref(null)
  
  onMounted(() => {
    new Typed(el.value, {
      strings: props.strings,
      typeSpeed: props.typeSpeed,
      backSpeed: props.backSpeed,
      loop: props.loop
    })
  })
  </script>