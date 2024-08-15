<script setup>
import CodeView from './CodeView.vue'

// Numeral & i18n for localized floor ordinal formatting
import numeral from 'numeral'
// All supported locales must be imported
import 'numeral/locales/fr'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })
numeral.locale(locale.value)

const props = defineProps({
  address: Object
})
</script>

<template>
  <!-- Title section -->
  <h2 v-if="address.name" class="font-hkgrotesk-semibold mb-0">{{ address.name }}</h2>
  <h4 v-if="address.name && address.address" class="font-hkgrotesk-semibold">{{ address.address }}</h4>
  <h3 v-else-if="address.address" class="font-hkgrotesk-semibold">{{ address.address }}</h3>
  <!-- Information -->
  <dl>
    <template v-for="(door, index) in address.doors" :key="index">
      <dt v-if="door.label.door">{{ $t('address.label.door') }}</dt>
      <dt v-if="door.label.gate">{{ $t('address.label.gate') }}</dt>
      <dt v-if="door.label.portal">{{ $t('address.label.portal') }}</dt>
      <dt v-if="door.label.padlock">{{ $t('address.label.padlock') }}</dt>
      <dt v-if="door.label.custom">{{ door.label.custom.string }}</dt>
      <dd><CodeView :code="door.code"></CodeView></dd>
    </template>
    <template v-if="address.building">
      <dt>{{ $t('address.building') }}</dt>
      <dd>{{ address.building }}</dd>
    </template>
    <template v-if="address.intercom">
      <dt>{{ $t('address.intercom') }}</dt>
      <dd>{{ address.intercom }}</dd>
    </template>
    <template v-if="address.staircase">
      <dt>{{ $t('address.staircase') }}</dt>
      <dd>{{ address.staircase }}</dd>
    </template>
    <template v-if="address.floor">
      <dt>{{ $t('address.floor') }}</dt>
      <dd>{{ numeral(props.address.floor).format('0o') }}</dd>
    </template>
    <template v-if="address.flat">
      <dt>{{ $t('address.flat') }}</dt>
      <dd>{{ address.flat }}</dd>
    </template>
    <template v-if="address.moreInfos">
      <dd class="full-width">{{ address.moreInfos }}</dd>
    </template>
  </dl>
</template>

<style scoped>
dl {
  @apply overflow-visible flex flex-row flex-wrap
}

dl dt, dl dd {
  @apply overflow-hidden text-ellipsis grow-0 shrink-0 pb-3 mb-3 border-b-2
}

dl dt {
  @apply font-medium text-gray-500 basis-1/3
}

dl dd {
  @apply text-right ml-auto basis-2/3
}

dl dd.full-width {
  @apply basis-full text-center border-0
}
</style>
