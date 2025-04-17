<template>
  <div>
    <ModalsCreateProperty />
    <ul>
      <li v-if="status === 'pending'">Loading...</li>
      <li v-if="status === 'error'">Error loading properties</li>
      <li v-if="status === 'success'">
        <div v-for="property in data" :key="property.id">
          <h2>{{ property.name }}</h2>
          <p>{{ property.description }}</p>
          <p>{{ property.propertyAddress }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
const { data, status } = useFetch("/api/properties");
</script>
