<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl">My Properties</h2>
      <ModalsCreateProperty />
    </div>
    <h2 v-if="status === 'pending'">Loading...</h2>
    <h2 v-else-if="status === 'error'">Error loading properties</h2>
    <p v-if="data && data.length === 0">
      You have not listed any properties yet
    </p>
    <div v-if="data" class="flex gap-y-2">
      <property-card
        v-for="{ realEstate } in data"
        :key="realEstate.id"
        :property="realEstate"
        sellable
      />
    </div>
    <!-- <modals-sell-property /> -->
  </div>
</template>
<script lang="ts" setup>
const { data, status } = useFetch("/api/properties/my");
</script>
