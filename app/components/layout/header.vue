<template>
  <header class="flex p-4 items-center w-full justify-between bg-slate-700">
    <ULink inactive-class="font-bold text-(--ui-primary)" to="/">
      Crypto-Estate
    </ULink>
    <nav class="flex items-center gap-2">
      <ULink
        v-if="status === 'success'"
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/buy"
      >
        Buy Property
      </ULink>
      <ULink
        v-if="status === 'success'"
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/properties"
      >
        My Properties
      </ULink>
      <ULink
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/account"
      >
        Account
      </ULink>
      <UButton
        v-if="!user"
        class="cursor-pointer"
        label="Sign in with Google"
        @click="signInWithOAuth"
      />
      <div v-else class="items-center flex flex-row gap-2">
        <UButton class="cursor-pointer" label="Sign out" @click="signOut">
          <template #leading>
            <UAvatar
              :src="user.user_metadata.avatar_url"
              :alt="user.user_metadata.name"
              size="sm"
              class="rounded-full"
            />
          </template>
        </UButton>
        <div v-if="status === 'error'" class="bg-red-500 size-2 rounded-full" />
        <div
          v-else-if="status === 'pending'"
          class="bg-yellow-500 size-2 rounded-full"
        />
        <div
          v-else-if="status === 'success'"
          class="bg-green-500 size-2 rounded-full"
        />
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const RUNTIME_CONFIG = useRuntimeConfig();

const { status, refresh } = useFetch("/api/wallet");

const route = useRoute();
watch(
  () => route.path,
  () => {
    refresh();
  }
);

const signInWithOAuth = async () => {
  console.log(`${RUNTIME_CONFIG.public.redirectUrl}/auth/confirm`);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${RUNTIME_CONFIG.public.redirectUrl}/auth/confirm`,
    },
  });
  if (error) console.log(error);
  await refresh();
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
  navigateTo("/");
};
</script>
