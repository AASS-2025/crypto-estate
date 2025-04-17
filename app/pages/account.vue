<template>
  <div class="w-full flex flex-col gap-y-4 justify-center items-center">
    <h2 class="text-4xl">{{ user?.user_metadata.name }}</h2>
    <UButton
      :disabled="status === 'success'"
      :label="
        status === 'success'
          ? 'You already own registered wallet'
          : 'Register Wallet'
      "
      @click="registerWallet"
    />
  </div>
</template>

<script lang="ts" setup>
const { status, refresh } = useFetch("/api/wallet");
const user = useSupabaseUser();
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
