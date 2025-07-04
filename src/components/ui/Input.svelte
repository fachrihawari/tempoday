<script lang="ts">
import { type SectionTheme, sectionThemes } from '../../lib/theme';

interface Props {
  value: string | number;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  disabled?: boolean;
  required?: boolean;
  step?: string;
  min?: string;
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
  required = false,
  step,
  min,
  error = '',
  label = '',
  theme,
  onkeydown,
  oninput,
  class: className = '',
}: Props = $props();

let inputElement: HTMLInputElement = $state()!;
let isFocused = $state(false);

const focusColor = $derived(() => {
  if (error)
    return 'focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400';
  if (theme)
    return sectionThemes[theme].colors.focus + ' focus:border-transparent';
  return 'focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400';
});

const borderColor = $derived(() => {
  if (error) return 'border-red-300 dark:border-red-600';
  if (isFocused) {
    if (theme) {
      const color =
        theme === 'tasks'
          ? 'border-blue-500 dark:border-blue-400'
          : theme === 'notes'
            ? 'border-purple-500 dark:border-purple-400'
            : 'border-green-500 dark:border-green-400';
      return color;
    }
    return 'border-blue-500 dark:border-blue-400';
  }
  return 'border-gray-300 dark:border-gray-600';
});

function handleFocus() {
  isFocused = true;
}

function handleBlur() {
  isFocused = false;
}
</script>

<div class="space-y-2">
  {#if label}
    <label for="input-{label}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}

      {#if required}
        <span class="text-red-600 dark:text-red-400">*</span>
      {/if}
    </label>
  {/if}

  <input
    bind:this={inputElement}
    id="input-{label}"
    bind:value
    {placeholder}
    {type}
    {disabled}
    {required}
    {step}
    {min}
    {onkeydown}
    {oninput}
    onfocus={handleFocus}
    onblur={handleBlur}
    class={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all duration-200
    ${borderColor()}
    ${focusColor()}
    ${disabled ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
    ${className}`}
  />

  {#if error}
    <p
      class="text-sm text-red-600 dark:text-red-400 mt-1 animate-in slide-in-from-top-1 duration-200"
    >
      {error}
    </p>
  {/if}
</div>
