<template>
  <UModal v-model="modalState" class="flex items-center justify-center">
    <UButton class="cursor-pointer w-full" label="Sell" />
    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 p-4"
        @error="
          (error) => {
            toast.add({
              title: 'Error',
              description: error.errors.map((e) => e.message).join(', '),
              color: 'error',
            });
          }
        "
        @submit="onSubmit"
      >
        <UFormField label="Property price (ETH)" name="propertyAddress">
          <UInput
            v-model="state.propertyPrice"
            :disabled="loading"
            type="number"
            class="w-full"
          />
        </UFormField>
        <UButton
          type="submit"
          :disabled="loading"
          :loading="loading"
          class="w-full cursor-pointer text-center"
        >
          <p class="w-full text-center">Confirm</p>
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { ethToWei } from "~~/shared/utils/eth";

const props = defineProps<{
  tokenId?: number;
}>();

const modalState = ref(false);

const schema = z.object({
  tokenId: z.number().positive({
    message: "Token ID must be a positive number",
  }),
  propertyPrice: z.number().gt(0, {
    message: "Property price must be greater than 0 ETH",
  }),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  tokenId: props.tokenId || 1,
  propertyPrice: 0,
});

const toast = useToast();
const loading = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  console.log(props.tokenId);
  loading.value = true;
  toast.add({
    title: "Creating",
    description: "Creating offer...",
    color: "info",
  });
  // BigInt amount from ETH to Wei
  const amount = ethToWei(event.data.propertyPrice);
  try {
    const res = await $fetch(`/api/properties/${event.data.tokenId}/sell`, {
      method: "POST",
      body: {
        amount,
      },
    });
    toast.add({
      title: "Success",
      description: `Offer was created! - Tx hash: ${res}`,
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: `Failed to sell property - ${error}`,
      color: "error",
    });
  }
  loading.value = false;
  modalState.value = false;
}
</script>
