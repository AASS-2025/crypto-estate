<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex justify-between">
        <b>{{ property.name ?? "Missing property name" }}</b>
        <span class="flex gap-x-2 items-center">
          <UBadge v-if="mine">Mine</UBadge>
          <UBadge v-if="property.verified" color="secondary">Verified</UBadge>
          <UBadge v-if="property.offers.length > 0" color="warning">
            Listed
          </UBadge>
        </span>
      </div>
    </template>
    <div class="flex flex-col gap-y-4">
      <div
        class="w-full bg-gray-400/10 rounded-xl flex items-center justify-center p-2"
      >
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <img
          :src="imageUrl"
          alt="Property image"
          class="max-h-[200px] size-fit"
        />
      </div>
      <div class="grid grid-cols-2">
        <!-- Info col -->
        <div class="flex flex-col gap-y-2">
          <span class="flex gap-2">
            <b>Description:</b>
            <p>
              {{ property.description ?? "Missing description" }}
            </p>
          </span>
          <span class="flex gap-2">
            <b>Size:</b>
            <p>{{ property.squareMeters ?? "Missing size" }} m2</p>
          </span>
          <span class="flex gap-2">
            <b>Owner:</b>
            <p>{{ owner }}</p>
          </span>
        </div>
        <!-- Image col -->
        <div class="w-full flex justify-center">
          <iframe
            width="300"
            height="250"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            :src="`https://www.openstreetmap.org/export/embed.html?bbox=17.1047,48.1466,17.1107,48.1506&marker=${property.latitude},${property.longitude}`"
          />
        </div>
      </div>
      <UButton
        v-if="buyable && !mine && price"
        class="mt-8 w-full text-center cursor-pointer"
        color="primary"
        @click="emit('buy')"
      >
        <p class="text-center w-full">Buy {{ weiToEth(price) }} ETH</p>
      </UButton>
      <UButton
        v-if="mine && property.offers.length > 0"
        class="mt-8 w-full text-center cursor-pointer"
        color="error"
        @click="emit('remove-offer')"
      >
        <p class="text-center w-full">Remove offer</p>
      </UButton>
      <ModalsSellProperty
        v-if="mine && property.offers.length < 1"
        :token-id="Number(property.tokenId)"
      />
    </div>
    <template #footer>
      <small> Token ID: {{ property.tokenId }} </small>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { RealEstate } from "~~/shared/types/property";
import { weiToEth } from "~~/shared/utils/eth";

const emit = defineEmits<{
  (e: "buy"): void;
  (e: "sell"): void;
  (e: "remove-offer"): void;
}>();

const props = defineProps<{
  property: RealEstate;
  price?: string;
  mine?: boolean;
  buyable?: boolean;
  sellable?: boolean;
  owner: string;
}>();

const imageUrl = computed(() => {
  if (
    !props.property.image ||
    props.property.image.startsWith("https://www.google.com")
  ) {
    return "https://athena.thesims.com/v1/images/2/0x0000237b/0D71F253-F1D9-11E9-843A-267D47C7ADE4/00.jpg";
  }
  return props.property.image;
});
</script>
