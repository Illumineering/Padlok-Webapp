<script setup>
import Code from './Code.vue'

// Numeral & i18n for localized floor ordinal formatting
import numeral from 'numeral'
// All supported locales must be imported
import "numeral/locales/fr";
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
numeral.locale(locale.value)

const props = defineProps({
  data: Object
})
</script>

<template>
    <!-- Title section -->
    <h2 v-if="data.name" class="font-hkgrotesk-semibold mb-0">{{ data.name }}</h2>
    <h4 v-if="data.name && data.address" class="font-hkgrotesk-semibold">{{ data.address }}</h4>
    <h3 v-else-if="data.address" class="font-hkgrotesk-semibold">{{ data.address }}</h3>
    <!-- Information -->
    <dl>
        <template v-for="(door, index) in data.doors" :key="index">
            <dt v-if="door.label.door">{{ $t('address.label.door') }}</dt>
            <dt v-if="door.label.gate">{{ $t('address.label.gate') }}</dt>
            <dt v-if="door.label.portal">{{ $t('address.label.portal') }}</dt>
            <dt v-if="door.label.custom">{{ door.label.custom.string }}</dt>
            <dd><Code :code="door.code"></Code></dd>
        </template>
        <template v-if="data.building">
            <dt>{{ $t('address.building') }}</dt>
            <dd>{{ data.building }}</dd>
        </template>
        <template v-if="data.intercom">
            <dt>{{ $t('address.intercom') }}</dt>
            <dd>{{ data.intercom }}</dd>
        </template>
        <template v-if="data.staircase">
            <dt>{{ $t('address.staircase') }}</dt>
            <dd>{{ data.staircase }}</dd>
        </template>
        <template v-if="data.floor">
            <dt>{{ $t('address.floor') }}</dt>
            <dd>{{ numeral(props.data.floor).format('0o') }}</dd>
        </template>
        <template v-if="data.flat">
            <dt>{{ $t('address.flat') }}</dt>
            <dd>{{ data.flat }}</dd>
        </template>
        <template v-if="data.moreInfos">
            <dd class="full-width">{{ data.moreInfos }}</dd>
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