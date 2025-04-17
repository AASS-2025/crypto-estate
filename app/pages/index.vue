<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">Crypto Estate</h1>

    <div v-if="user" class="flex items-center gap-2">
      <UButton
        class="cursor-pointer"
        label="Buy"
        icon="mdi:home-plus-outline"
        to="/buy"
      />
      <UButton
        label="My properties"
        color="neutral"
        class="cursor-pointer"
        variant="outline"
        icon="mdi:cash"
        to="/properties"
      />
    </div>
    <div v-else class="flex items-center gap-2">
      <UButton
        label="Sign in with Google"
        class="cursor-pointer"
        icon="mdi:google"
        @click="signInWithOAuth"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const RUNTIME_CONFIG = useRuntimeConfig();

const signInWithOAuth = async () => {
  console.log(`${RUNTIME_CONFIG.public.redirectUrl}/auth/confirm`);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${RUNTIME_CONFIG.public.redirectUrl}/auth/confirm`,
    },
  });
  if (error) console.log(error);
};
</script>
