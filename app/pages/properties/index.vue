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
    <div v-if="data && account" class="flex gap-y-2">
      <property-card
        v-for="{ realEstate } in data"
        :key="realEstate.id"
        :property="realEstate"
        :mine="true"
        :owner="account.address"
        sellable
        @remove-offer="removeOffer(realEstate.tokenId)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data, status, refresh } = useFetch("/api/properties/my");
const { data: account } = useFetch("/api/wallet");

const toast = useToast();
const loading = ref(false);

const removeOffer = async (id: string) => {
  if (loading.value) return;
  loading.value = true;
  toast.add({
    title: "Removing",
    description: "Requesting to remove offer...",
    color: "info",
  });
  try {
    const resp = await $fetch(`/api/properties/${id}/offer`, {
      method: "DELETE",
    });
    await refresh();
    toast.add({
      title: "Success",
      description: `Offer removed! - Tx hash: ${resp}`,
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: `Failed to remove offer - ${error}`,
      color: "error",
    });
  }
  loading.value = false;
};
</script>
