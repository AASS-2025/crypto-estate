<template>
  <div class="w-full flex justify-center items-center">
    <UButton label="Register Wallet" class="w-1/2" @click="registerWallet" />
  </div>
</template>

<script lang="ts" setup>
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
};
</script>

<style></style>
