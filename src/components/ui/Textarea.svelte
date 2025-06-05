<script lang="ts">
import { type SectionTheme, sectionThemes } from '../../lib/theme';

interface Props {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  error?: string;
  label?: string;
  theme?: SectionTheme;
  autoResize?: boolean;
  onkeydown?: (event: KeyboardEvent) => void;
  oninput?: (event: Event) => void;
  class?: string;
}

let {
  value = $bindable(),
  placeholder = '',
  disabled = false,
  required = false,
  rows = 4,
  error = '',
  label = '',
  theme,
  autoResize = false,
  onkeydown,
  oninput,
  class: className = '',
}: Props = $props();

let textareaElement: HTMLTextAreaElement = $state()!;
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
        theme === 'todos'
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

function handleInput(event: Event) {
  if (autoResize && textareaElement) {
    textareaElement.style.height = 'auto';
    textareaElement.style.height = textareaElement.scrollHeight + 'px';
  }
  oninput?.(event);
}

// Auto-resize on mount if autoResize is true
$effect(() => {
  if (autoResize && textareaElement && value) {
    textareaElement.style.height = 'auto';
    textareaElement.style.height = textareaElement.scrollHeight + 'px';
  }
});
</script>

<div class="space-y-2">
  {#if label}
    <label
      for="textarea-{label}"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}

      {#if required}
        <span class="text-red-600">*</span>
      {/if}
    </label>
  {/if}

  <textarea
    bind:this={textareaElement}
    id="textarea-{label}"
    bind:value
    {placeholder}
    {disabled}
    {required}
    {rows}
    {onkeydown}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all duration-200 resize-none
    {borderColor()}
    {focusColor()}
    {disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
    {className}"
  ></textarea>

  {#if error}
    <p
      class="text-sm text-red-600 mt-1 animate-in slide-in-from-top-1 duration-200"
    >
      {error}
    </p>
  {/if}
</div>
