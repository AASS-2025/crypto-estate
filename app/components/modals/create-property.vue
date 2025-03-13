<template>
  <UModal class="w-full flex items-center justify-center">
    <UButton label="Register new property" />
    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 p-4"
        @submit="onSubmit"
      >
        <UFormField label="Property address" name="propertyAddress">
          <UInput v-model="state.propertyAddress" class="w-full" />
        </UFormField>
        <UFormField label="Year built" name="yearBuilt">
          <UInput v-model="state.yearBuilt" type="number" class="w-full" />
        </UFormField>
        <UFormField label="Legal document hash" name="legalDocumentHash">
          <UInput v-model="state.legalDocumentHash" class="w-full" />
        </UFormField>
        <UFormField label="Longitude" name="longitude">
          <UInput v-model="state.longitude" type="number" class="w-full" />
        </UFormField>
        <UFormField label="Latitude" name="latitude">
          <UInput v-model="state.latitude" type="number" class="w-full" />
        </UFormField>
        <UFormField label="Square meters" name="squareMeters">
          <UInput v-model="state.squareMeters" type="number" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full cursor-pointer text-center">
          <p class="w-full text-center">Submit</p>
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  propertyAddress: z.string(),
  yearBuilt: z.number(),
  legalDocumentHash: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  squareMeters: z.number(),
});

type Schema = z.output<typeof schema>;

// We need to create form to create a property

const state = reactive<Schema>({
  propertyAddress: "",
  yearBuilt: 0,
  legalDocumentHash: "",
  longitude: 0,
  latitude: 0,
  squareMeters: 0,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
  $fetch("/api/properties", {
    method: "POST",
    body: event.data,
  });
}
</script>
