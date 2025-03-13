<script setup>
import { computed } from 'vue'

const props = defineProps({
  code: String
})

const characters = computed(() => props.code.split(''))
</script>

<template>
    <span class="font-mono" v-for="(char, index) in characters" :key="index">
        <span class="text-padlok-blue" v-if="isNaN(char - parseFloat(char))">{{ char }}</span>
        <template v-else>{{ char }}</template>
    </span>
</template>
