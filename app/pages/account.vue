<template>
  <div class="w-full flex flex-col justify-center items-center">
    <UButton
      :disabled="status === 'success'"
      label="Register Wallet"
      class="w-1/2"
      @click="registerWallet"
    />
    <small v-if="status === 'success'" class="text-sm text-gray-200">
      You already own registered wallet
    </small>
  </div>
</template>

<script lang="ts" setup>
const { status, refresh } = useFetch("/api/wallet");
const toast = useToast();
const registerWallet = async () => {
  try {
    await $fetch("/api/wallet", {
      method: "POST",
    });
    toast.add({
      title: "Success",
      description: "Wallet registered successfully.",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to register wallet.",
      color: "error",
    });
    console.error("Error registering wallet:", error);
  }
  await refresh();
};
</script>

<style></style>
