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
        v-for="{ realEstate, price, seller } in data"
        :key="realEstate.id"
        :property="realEstate"
        :price="price"
        :mine="seller === account?.address.toLowerCase()"
        :owner="seller"
        buyable
        @buy="buy(realEstate.tokenId, price)"
        @remove-offer="removeOffer(realEstate.tokenId)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data, status, refresh } = useFetch("/api/properties");
const { data: account } = useFetch("/api/wallet");

const toast = useToast();
const loading = ref(false);
const buy = async (id: string, price: string) => {
  if (loading.value) return;
  loading.value = true;
  toast.add({
    title: "Buying",
    description: "Requesting to buy property...",
    color: "info",
  });
  try {
    const resp = await $fetch(`/api/properties/${id}/offer/buy`, {
      method: "POST",
      body: {
        price,
      },
    });
    await refresh();
    toast.add({
      title: "Success",
      description: `Property bought! - Tx hash: ${resp}`,
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: `Failed to buy property - ${error}`,
      color: "error",
    });
  }
  loading.value = false;
};

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
