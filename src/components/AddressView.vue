<script setup>
import { computed } from 'vue'
import CodeView from './CodeView.vue'
import { hasFloor, segments, telURL } from '../info'

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

const phoneURL = computed(() => props.address.phoneNumber && telURL(props.address.phoneNumber))
const moreInfos = computed(() => segments(props.address.moreInfos ?? ''))
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
    <template v-if="hasFloor(address.floor)">
      <dt>{{ $t('address.floor') }}</dt>
      <dd v-if="address.floor === 0">{{ $t('address.groundFloor') }}</dd>
      <dd v-else>{{ numeral(address.floor).format('0o') }}</dd>
    </template>
    <template v-if="address.flat">
      <dt>{{ $t('address.flat') }}</dt>
      <dd>{{ address.flat }}</dd>
    </template>
    <template v-if="address.phoneNumber">
      <dt>{{ $t('address.phoneNumber') }}</dt>
      <dd>
        <a v-if="phoneURL" :href="phoneURL">{{ address.phoneNumber }}</a>
        <template v-else>{{ address.phoneNumber }}</template>
      </dd>
    </template>
    <template v-if="address.moreInfos">
      <dd class="full-width text-sm whitespace-pre-line break-words"><template v-for="(segment, index) in moreInfos" :key="index"><a v-if="segment.href" :href="segment.href" target="_blank" rel="noopener noreferrer">{{ segment.text }}</a><template v-else>{{ segment.text }}</template></template></dd>
    </template>
  </dl>
</template>
