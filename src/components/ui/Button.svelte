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
    solid: 'bg-blue-500 text-white hover:bg-blue-600',
    dashed:
      'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700',
  },
  secondary: {
    solid: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700',
  },
  outline: {
    solid: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700',
  },
  danger: {
    solid: 'bg-red-500 text-white hover:bg-red-600',
    dashed:
      'text-red-600 border-red-300 hover:border-red-500 hover:text-red-700',
  },
  ghost: {
    solid: 'text-gray-600 hover:bg-gray-100',
    dashed:
      'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700',
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
