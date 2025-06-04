<!-- Reusable Button Component -->
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'notes' | 'todos' | 'financials';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    dashed?: boolean;
    disabled?: boolean;
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
    onclick, 
    class: className = '',
    children 
  }: Props = $props();

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-gray-600 hover:bg-gray-100',
    notes: 'bg-purple-500 text-white hover:bg-purple-600',
    todos: 'bg-blue-500 text-white hover:bg-blue-600',
    financials: 'bg-green-500 text-white hover:bg-green-600'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
</script>

<button
  {onclick}
  {disabled}
  class="flex justify-center items-center font-medium rounded-lg transition-colors {variants[variant]} {sizes[size]} {className}
    {dashed ? 'border-2 border-dashed' : ''}
    {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
  class:w-full={fullWidth}
>
  {@render children()}
</button>
