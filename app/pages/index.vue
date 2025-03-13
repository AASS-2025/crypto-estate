<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">Crypto Estate</h1>

    <div class="flex items-center gap-2">
      <UButton label="Sell" icon="mdi:cash" to="/sell" />

      <UButton
        label="Buy"
        color="neutral"
        variant="outline"
        icon="mdi:home-plus-outline"
        to="/buy"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});
</script>
