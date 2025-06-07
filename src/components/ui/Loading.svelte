<script lang="ts">
  interface Props {
    class?: string;
    message?: string;
  }

  let { message = "Loading...", class: className = "" }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center p-4 {className}">
  <div
    class="rounded-full animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-500 {className}"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">{message}</span>
  </div>

  <p class="mt-4 text-gray-600">{message}</p>
</div>
