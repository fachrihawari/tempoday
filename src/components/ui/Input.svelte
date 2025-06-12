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
  if (error) return 'focus:ring-red-500 focus:border-red-500';
  if (theme)
    return sectionThemes[theme].colors.focus + ' focus:border-transparent';
  return 'focus:ring-blue-500 focus:border-blue-500';
});

const borderColor = $derived(() => {
  if (error) return 'border-red-300';
  if (isFocused) {
    if (theme) {
      const color =
        theme === 'tasks'
          ? 'border-blue-500'
          : theme === 'notes'
            ? 'border-purple-500'
            : 'border-green-500';
      return color;
    }
    return 'border-blue-500';
  }
  return 'border-gray-300';
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
    <label for="input-{label}" class="block text-sm font-medium text-gray-700">
      {label}

      {#if required}
        <span class="text-red-600">*</span>
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
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${className}`}
  />

  {#if error}
    <p
      class="text-sm text-red-600 mt-1 animate-in slide-in-from-top-1 duration-200"
    >
      {error}
    </p>
  {/if}
</div>
