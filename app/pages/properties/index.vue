<template>
  <div>
    <ModalsCreateProperty />
    <h2 v-if="status === 'pending'">Loading...</h2>
    <h2 v-else-if="status === 'error'">Error loading properties</h2>
    <h2 v-else>My Properties</h2>
    <p v-if="data && data.length === 0">
      You have not listed any properties yet
    </p>
    <ul v-if="data">
      <li v-for="property in data" :key="property.realEstate.id">
        <h2>{{ property.realEstate.name }}</h2>
        <p>{{ property.realEstate.description }}</p>
        <p>{{ property.realEstate.propertyAddress }}</p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
const { data, status } = useFetch("/api/properties");
</script>
