<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <QuickActionCard
      title="Questionnaires"
      description="Design custom questionnaires or use AI to generate questions"
      icon="i-heroicons-document-text"
      icon-color="blue"
      button-text="New Questionnaire"
      button-icon="i-heroicons-plus"
      button-to="/questionnaires/create"
    />

    <QuickActionCard
      title="Students"
      description="Add and manage your student roster"
      icon="i-heroicons-users"
      icon-color="green"
      button-text="View Students"
      button-icon="i-heroicons-user-group"
      button-to="/students"
      button-variant="outline"
    />

    <QuickActionCard
      title="Analytics"
      description="View insights and analytics from your questionnaires"
      icon="i-heroicons-chart-bar"
      icon-color="purple"
      button-text="Coming Soon"
      button-icon="i-heroicons-chart-bar"
      button-variant="soft"
      :button-disabled="true"
    />
  </div>
</template>

<script setup lang="ts">
// This component doesn't need any props or logic as it's static
</script>