<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
  >
    <div class="flex items-center gap-3 mb-4">
      <div :class="iconContainerClass">
        <UIcon :name="icon" class="w-6 h-6" :class="iconClass" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ title }}
      </h3>
    </div>
    <p class="text-gray-600 mb-6 text-sm flex-grow">
      {{ description }}
    </p>
    <UButton
      :to="buttonTo"
      :color="buttonColor"
      :variant="buttonVariant"
      :disabled="buttonDisabled"
      block
      size="sm"
      :icon="buttonIcon"
    >
      {{ buttonText }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
  iconColor: 'blue' | 'green' | 'purple';
  buttonText: string;
  buttonIcon: string;
  buttonTo?: string;
  buttonColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
  buttonVariant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';
  buttonDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonTo: undefined,
  buttonColor: 'primary',
  buttonVariant: 'solid',
  buttonDisabled: false,
});

const iconContainerClass = computed(() => {
  const colorMap = {
    blue: 'p-3 bg-blue-50 rounded-lg',
    green: 'p-3 bg-green-50 rounded-lg',
    purple: 'p-3 bg-purple-50 rounded-lg',
  };
  return colorMap[props.iconColor];
});

const iconClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };
  return colorMap[props.iconColor];
});
</script>