<script lang="ts">
import type { HTMLButtonAttributes } from 'svelte/elements';
import { type SectionTheme, sectionThemes } from '../../lib/theme';

interface Props extends HTMLButtonAttributes {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline'
    | SectionTheme;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  dashed?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: () => void;
  class?: string;
  children: any;
}

let {
  variant = 'primary',
  size = 'md',
  dashed = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onclick,
  class: className = '',
  children,
  ...restProps
}: Props = $props();

const baseVariants = {
  primary: {
    solid: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    dashed:
      'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700 dark:text-blue-400 dark:border-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-300',
  },
  secondary: {
    solid: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300',
  },
  outline: {
    solid: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300',
  },
  danger: {
    solid: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
    dashed:
      'text-red-600 border-red-300 hover:border-red-500 hover:text-red-700 dark:text-red-400 dark:border-red-700 dark:hover:border-red-500 dark:hover:text-red-300',
  },
  ghost: {
    solid: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300',
  },
  notes: sectionThemes.notes.colors.button,
  tasks: sectionThemes.tasks.colors.button,
  financials: sectionThemes.financials.colors.button,
};

const variantClass = $derived(
  baseVariants[variant as keyof typeof baseVariants][
    dashed ? 'dashed' : 'solid'
  ],
);

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};
</script>

<button
  {type}
  {onclick}
  {disabled}
  class={[
    "flex justify-center items-center font-medium rounded-lg transition-colors",
    variantClass,
    sizes[size],
    className,
    dashed ? "border-2 border-dashed bg-transparent" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    fullWidth ? "w-full" : "",
  ]}
  {...restProps}
>
  {@render children()}
</button>
