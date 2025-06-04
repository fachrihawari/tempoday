<!-- Reusable Section Layout Component -->
<script lang="ts">
  import Card from './Card.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import EmptyState from './EmptyState.svelte';
  import InlineForm from './InlineForm.svelte';
  import type { SectionTheme } from '../../lib/theme';

  interface Props {
    title: string;
    icon: 'check' | 'trash' | 'settings' | 'plus' | 'close' | 'dollar' | 'clipboard' | 'edit';
    theme: SectionTheme;
    items: any[];
    showAddForm: boolean;
    emptyStateTitle: string;
    emptyStateSubtitle: string;
    addButtonText: string;
    onAddClick: () => void;
    children: any;
    headerAction?: any;
    formChildren?: any;
  }

  let { 
    title,
    icon,
    theme,
    items,
    showAddForm = $bindable(),
    emptyStateTitle,
    emptyStateSubtitle,
    addButtonText,
    onAddClick,
    children,
    headerAction,
    formChildren
  }: Props = $props();
</script>

<Card {title} {icon} iconColor="text-{theme}-500">
  {#snippet headerAction()}
    {#if headerAction}
      {@render headerAction()}
    {/if}
  {/snippet}
  
  {#snippet children()}
    <!-- Content Area -->
    <div class="space-y-2 {items.length > 0 ? 'mb-4' : ''}">
      {#if items.length > 0}
        {@render children()}
      {:else}
        <EmptyState
          {icon}
          title={emptyStateTitle}
          subtitle={emptyStateSubtitle}
          onclick={() => (showAddForm = true)}
        />
      {/if}
    </div>

    <!-- Add Form -->
    {#if formChildren}
      <InlineForm
        bind:show={showAddForm}
        className="mt-4"
        onSubmit={onAddClick}
        onCancel={() => (showAddForm = false)}
        submitText={addButtonText}
        submitVariant={theme}
      >
        {#snippet children()}
          {@render formChildren()}
        {/snippet}
      </InlineForm>
    {/if}

    <!-- Add Button -->
    {#if !showAddForm && items.length > 0}
      <Button 
        variant={theme}
        dashed={true}
        onclick={() => (showAddForm = true)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="plus" size="sm" class="mr-2" />
          {addButtonText}
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>
