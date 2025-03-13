<template>
  <header class="flex p-4 items-center w-full justify-between bg-slate-700">
    <ULink inactive-class="font-bold text-(--ui-primary)" to="/"> Home </ULink>
    <nav class="flex items-center gap-2">
      <ULink
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/sell"
      >
        Sell Property
      </ULink>
      <ULink
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/buy"
      >
        Buy Property
      </ULink>
      <ULink
        as="button"
        active-class="font-bold text-(--ui-primary)"
        inactive-class="text-(--ui-text-muted)"
        to="/properties"
      >
        My Properties
      </ULink>
      <UButton
        v-if="!user"
        label="Sign in with Google"
        @click="signInWithOAuth"
      />
      <UButton
        v-else
        :label="`Sign out [${user.user_metadata.name}]`"
        @click="signOut"
      />
    </nav>
  </header>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const RUNTIME_CONFIG = useRuntimeConfig();

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${RUNTIME_CONFIG.public.redirectUrl}/auth/confirm`,
    },
  });
  if (error) console.log(error);
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
};
</script>
