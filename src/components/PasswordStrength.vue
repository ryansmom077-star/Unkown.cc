<template>
  <div v-if="password" style="margin-top:8px">
    <div style="display:flex;gap:4px;margin-bottom:6px">
      <div v-for="i in 4" :key="i" :style="{
        flex: 1,
        height: '4px',
        borderRadius: '2px',
        background: i <= strengthLevel ? strengthColor : '#2a3a45',
        transition: 'background 0.3s'
      }"></div>
    </div>
    <div :style="{color: strengthColor, fontSize: '12px', fontWeight: '600'}">
      {{ strengthText }}
    </div>
    <div v-if="feedback.length" style="margin-top:6px">
      <div v-for="(item, index) in feedback" :key="index" 
           :style="{fontSize: '11px', color: item.met ? '#51cf66' : '#ff6b6b', marginTop: '2px'}">
        {{ item.met ? '✓' : '✗' }} {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  password: {
    type: String,
    required: true
  }
})

const feedback = computed(() => {
  const pwd = props.password
  return [
    { text: 'At least 8 characters', met: pwd.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(pwd) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(pwd) },
    { text: 'Contains number', met: /\d/.test(pwd) },
    { text: 'Contains special character (@$!%*?&#)', met: /[@$!%*?&#]/.test(pwd) }
  ]
})

const strengthLevel = computed(() => {
  const metCount = feedback.value.filter(f => f.met).length
  if (metCount === 5) return 4 // Strong
  if (metCount >= 4) return 3 // Good
  if (metCount >= 3) return 2 // Fair
  if (metCount >= 1) return 1 // Weak
  return 0
})

const strengthText = computed(() => {
  const level = strengthLevel.value
  if (level === 4) return 'Strong Password'
  if (level === 3) return 'Good Password'
  if (level === 2) return 'Fair Password'
  if (level === 1) return 'Weak Password'
  return 'Very Weak Password'
})

const strengthColor = computed(() => {
  const level = strengthLevel.value
  if (level === 4) return '#51cf66'
  if (level === 3) return '#00ff88'
  if (level === 2) return '#ffa500'
  if (level === 1) return '#ff6b6b'
  return '#ff3333'
})
</script>
