<template>
  <UModal class="flex items-center justify-center">
    <UButton class="cursor-pointer" label="Sell" />
    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 p-4"
        @submit="onSubmit"
      >
        <UFormField label="Property price (ETH)" name="propertyAddress">
          <UInput v-model="state.propertyPrice" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full cursor-pointer text-center">
          <p class="w-full text-center">Confirm</p>
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  tokenId?: string;
}>();

const schema = z.object({
  propertyPrice: z.number().min(0),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  propertyPrice: 0,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!props.tokenId) {
    toast.add({
      title: "Error",
      description: "No token ID provided.",
      color: "error",
    });
    return;
  }
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
  $fetch(`/api/properties/${props.tokenId}/sell`, {
    method: "POST",
    body: event.data,
  });
}
</script>
