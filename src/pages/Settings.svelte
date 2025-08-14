<script lang="ts">
import About from '../components/settings/About.svelte';
import AppearanceSettings from '../components/settings/AppearanceSettings.svelte';
import BackupRestore from '../components/settings/BackupRestore.svelte';
import CurrencySettings from '../components/settings/CurrencySettings.svelte';
import DeviceSync from '../components/settings/DeviceSync.svelte';
import DonationModal from '../components/settings/DonationModal.svelte';
import PrivacySettings from '../components/settings/PrivacySettings.svelte';
import SupportSettings from '../components/settings/SupportSettings.svelte';
import Card from '../components/ui/Card.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';

let showDonationModal = $state(false);
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader title="Settings" icon="settings" />

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Appearance Section -->
    <Card
      title="Appearance"
      icon="sun"
      iconColor="text-yellow-600 dark:text-yellow-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <AppearanceSettings />
    </Card>

    <!-- Support TempoDay Section -->
    <Card
      title="Support TempoDay"
      icon="heart"
      iconColor="text-rose-600 dark:text-rose-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <SupportSettings onDonate={() => (showDonationModal = true)} />
    </Card>

    <!-- Device Sync -->
    <Card
      title="Device Sync"
      icon="save"
      iconColor="text-green-600 dark:text-green-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <DeviceSync />
    </Card>

    <!-- Backup & Restore Section -->
    <Card
      title="Backup & Restore"
      icon="save"
      iconColor="text-blue-600 dark:text-blue-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <BackupRestore />
    </Card>

    <!-- Currency Settings Section -->
    <Card
      title="Currency Settings"
      icon="dollar"
      iconColor="text-emerald-600 dark:text-emerald-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <CurrencySettings />
    </Card>

    <!-- Privacy & Security Section -->
    <Card
      title="Privacy & Security"
      icon="shield"
      iconColor="text-green-600 dark:text-green-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <PrivacySettings />
    </Card>

    <!-- App Information Section - Enhanced Design -->
    <Card
      title="About"
      icon="info-circle"
      iconColor="text-indigo-600 dark:text-indigo-400"
      collapsible={true}
      defaultExpanded={false}
    >
      <About />
    </Card>
  </div>
</div>

<!-- Donation Modal -->
<DonationModal bind:open={showDonationModal} />
