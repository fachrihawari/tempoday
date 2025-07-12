<script lang="ts">
import type { SectionTheme } from '../../lib/theme';
import Button from './Button.svelte';
import Icon, { type IconName } from './Icon.svelte';

type Props = {
  icon: IconName;
  label?: string;
  variant?: SectionTheme;
  onclick: () => void;
};

const { icon, label, onclick }: Props = $props();
</script>

<div class="fixed bottom-20 z-50 right-4">
  <Button
    aria-label={label || "Button"}
    class="w-16 h-16 !rounded-full"
    {onclick}
  >
    <Icon name={icon} size="xl" />
  </Button>
</div>
