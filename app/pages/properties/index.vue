<template>
  <div>
    <ModalsCreateProperty />
    <ul>
      <li v-if="status === 'pending'">Loading...</li>
      <li v-if="status === 'error'">Error loading properties</li>
      <li v-if="status === 'success' && data">
        <h2>My Properties</h2>
        <p>Here are the properties you have listed:</p>
        <p v-if="data.length === 0">You have not listed any properties yet</p>
        <div v-for="property in data" :key="property.realEstate.id">
          <h2>{{ property.realEstate.name }}</h2>
          <p>{{ property.realEstate.description }}</p>
          <p>{{ property.realEstate.propertyAddress }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
const { data, status } = useFetch("/api/properties");
</script>
