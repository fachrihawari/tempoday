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

  const baseVariants = {
    primary: { solid: 'bg-blue-500 text-white hover:bg-blue-600', dashed: 'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700' },
    secondary: { solid: 'bg-gray-100 text-gray-700 hover:bg-gray-200', dashed: 'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700' },
    danger: { solid: 'bg-red-500 text-white hover:bg-red-600', dashed: 'text-red-600 border-red-300 hover:border-red-500 hover:text-red-700' },
    ghost: { solid: 'text-gray-600 hover:bg-gray-100', dashed: 'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700' },
    notes: { solid: 'bg-purple-500 text-white hover:bg-purple-600', dashed: 'text-purple-600 border-purple-300 hover:border-purple-500 hover:text-purple-700' },
    todos: { solid: 'bg-blue-500 text-white hover:bg-blue-600', dashed: 'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700' },
    financials: { solid: 'bg-green-500 text-white hover:bg-green-600', dashed: 'text-green-600 border-green-300 hover:border-green-500 hover:text-green-700' }
  };

  const variantClass = $derived(baseVariants[variant][dashed ? 'dashed' : 'solid']);

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
</script>

<button
  {onclick}
  {disabled}
  class="flex justify-center items-center font-medium rounded-lg transition-colors {variantClass} {sizes[size]} {className}
    {dashed ? 'border-2 border-dashed bg-transparent' : ''}
    {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
  class:w-full={fullWidth}
>
  {@render children()}
</button>
