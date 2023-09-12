<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Función para redirigir a la página 'cart'
function redirectToCart() {
  router.push({ name: 'cart' });
}
</script>

<style scoped>

</style>
