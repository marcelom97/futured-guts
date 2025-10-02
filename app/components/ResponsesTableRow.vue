<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="text-sm font-medium text-gray-900">{{
        response.student_name
      }}</span>
    </td>
    <td class="px-6 py-4">
      <span class="text-sm text-gray-900 max-w-md truncate">{{
        response.question_text
      }}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <UBadge
        :color="getCategoryColor(response.category)"
        variant="subtle"
        size="sm"
      >
        {{ formatTraits(response.trait) }}
      </UBadge>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="text-sm text-gray-900">{{
        response.response_value
      }}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ formatDate(response.created_at) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Response } from '~/types/responses';

interface Props {
  response: Response;
}

defineProps<Props>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Formatting function for consistent data display
function formatTraits(traits: string | string[]): string {
  if (!traits) return "None";

  const formatSingleTrait = (trait: string): string => {
    return trait
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (typeof traits === "string") return formatSingleTrait(traits);
  if (Array.isArray(traits)) {
    return traits.map(formatSingleTrait).join(", ");
  }
  return "None";
}

function getCategoryColor(
  category: string
): "primary" | "success" | "info" | "warning" | "error" {
  const colorMap: Record<
    string,
    "primary" | "success" | "info" | "warning" | "error"
  > = {
    behavioral: "primary",
    hard_skill: "success",
    soft_skill: "info",
    technical: "warning",
    personality: "error",
  };
  return colorMap[category] || "primary";
}
</script>