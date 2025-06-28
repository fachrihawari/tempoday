<script lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  icon?: 'home' | 'calendar' | 'settings' | 'check' | 'trash' | 'plus' | 'close' | 'dollar' | 'clipboard' | 'edit';
  iconColor?: string;
  children?: any;
}

let {
  title,
  subtitle,
  icon,
  iconColor = 'text-blue-500',
  children,
}: Props = $props();
</script>

<div class="bg-white shadow-sm border-b border-gray-200">
  <div class="flex items-center justify-between p-4">
    <div class="flex items-center gap-3">
      {#if icon}
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if icon === 'home'}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            {:else if icon === 'calendar'}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            {:else if icon === 'settings'}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            {/if}
          </svg>
        </div>
      {/if}
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
        {#if subtitle}
          <p class="text-sm text-gray-600 mt-1">{subtitle}</p>
        {/if}
      </div>
    </div>
    
    {#if children}
      <div class="flex items-center gap-2">
        {@render children()}
      </div>
    {/if}
  </div>
</div>