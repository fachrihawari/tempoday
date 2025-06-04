<!-- Reusable Input Component -->
<script lang="ts">
  import { sectionThemes, type SectionTheme } from '../../lib/theme';

  interface Props {
    value: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'password';
    disabled?: boolean;
    error?: string;
    label?: string;
    theme?: SectionTheme;
    onkeydown?: (event: KeyboardEvent) => void;
    oninput?: (event: Event) => void;
    class?: string;
  }

  let { 
    value = $bindable(),
    placeholder = '', 
    type = 'text', 
    disabled = false, 
    error = '', 
    label = '',
    theme,
    onkeydown,
    oninput,
    class: className = ''
  }: Props = $props();

  const focusColor = $derived(() => {
    if (error) return 'focus:ring-red-500';
    if (theme) return sectionThemes[theme].colors.focus;
    return 'focus:ring-blue-500';
  });
</script>

<div class="space-y-1">
  {#if label}
    <label for="input-{label}" class="block text-sm font-medium text-gray-700">
      {label}
    </label>
  {/if}
  
  <input
    id="input-{label}"
    bind:value
    {placeholder}
    {type}
    {disabled}
    {onkeydown}
    {oninput}
    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-colors
      {error ? 'border-red-300' : 'border-gray-300'}
      {focusColor()}
      {disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
      {className}"
  />
  
  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {/if}
</div>
