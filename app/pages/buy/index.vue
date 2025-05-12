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
        v-for="{ realEstate, price, seller, id } in data"
        :key="realEstate.id"
        :property="realEstate"
        :price="price"
        :mine="seller === account?.address.toLowerCase()"
        :owner="seller"
        buyable
        @buy="buy(id, price)"
        @remove-offer="removeOffer(realEstate.tokenId)"
      />
    </div>
    <UModal v-model:open="loading">
      <template #header>
        <h2 class="text-2xl text-center w-full"> 
          Processing transaction
        </h2>
      </template>
      <template #body>
        <div class="flex flex-col gap-y-2">
          <div class="flex justify-center">
            <UIcon name="i-lucide-loader-circle" class="animate-spin size-10"/>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script lang="ts" setup>
const { data, status, refresh } = useFetch("/api/properties");
const { data: account } = useFetch("/api/wallet");
const config = useRuntimeConfig();
const toast = useToast();
const loading = ref(false);
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null);

const pollProcessStatus = async (processInstanceId: string) => {
  if (!processInstanceId) return;
  
  try {
    const resp = await $fetch(`/api/transactions/${processInstanceId}/process-id`, {
      method: "GET",
    });
    console.log("Polling response:", resp);
    if (!resp) return;
    if (resp.status=='success') {
      stopPolling();
      loading.value = false;
      await refresh();

      toast.add({
        title: "Transaction Complete",
        description: "Property purchase was successful!",
        color: "success",
      });
    } 
    else{
      stopPolling();
      loading.value = false;
      
      toast.add({
        title: "Transaction Failed",
        description: "Property purchase failed. Please try again.",
        color: "error",
      });
    }
  } catch (error) {
    console.error("Error polling process status:", error);
  }
};

const startPolling = (processInstanceId: string) => {
  // Make sure to clear any existing interval first
  stopPolling();
  // Create a closure that captures the processInstanceId
  pollingInterval.value = setInterval(() => {
    pollProcessStatus(processInstanceId);
  }, 500);
};

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

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
    
    if (resp && resp.processInstanceId) {
      startPolling(resp.processInstanceId);
    } else {
      // If we don't get a process ID, close the modal and show generic success
      loading.value = false;
      await refresh();
      
      toast.add({
        title: "Success",
        description: "Property purchase initiated successfully",
        color: "success",
      });
    }
  } catch (error) {
    loading.value = false;
    
    toast.add({
      title: "Error",
      description: `Failed to buy property - ${error}`,
      color: "error",
    });
  }
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

watch(loading, (newVal) => {
  if (!newVal) {
    stopPolling();
  }
});

// Clean up intervals when component is unmounted
onUnmounted(() => {
  stopPolling();
});
</script>