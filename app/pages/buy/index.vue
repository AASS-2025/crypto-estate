<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl">Available Properties</h2>
    </div>
    <h2 v-if="status === 'pending'">Loading...</h2>
    <h2 v-else-if="status === 'error'">Error loading properties</h2>
    <p v-if="data && data.length === 0">
      Currently there are no listed properties
    </p>
    <div v-if="data" class="flex flex-col gap-y-2">
      <property-card
        v-for="{ realEstate } in data"
        :key="realEstate.id"
        :property="realEstate"
        buyable
        @buy="buy(realEstate.tokenId)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data, status } = useFetch("/api/properties");

const buy = async (id: string) => {
  console.log(`Buying property with id ${id}`);
  const resp = $fetch(`/api/properties/${id}/buy`, {
    method: "POST",
  });
  console.log(resp);
};
</script>
