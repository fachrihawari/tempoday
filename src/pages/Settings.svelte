<script lang="ts">
import Settings from '../components/Settings.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import Icon from '../components/ui/Icon.svelte';
</script>

<div class="h-full flex flex-col bg-gray-50">
  <!-- Header -->
  <PageHeader 
    title="Settings" 
    subtitle="Customize your TempoDay experience"
    icon="settings"
  />

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto p-4 space-y-6">
    <!-- Currency Settings Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Icon name="dollar" class="text-green-600" size="lg" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Currency</h2>
            <p class="text-sm text-gray-600">Choose your preferred currency</p>
          </div>
        </div>
        
        <Settings />
      </div>
    </div>

    <!-- Privacy & Security Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon name="check-circle" class="text-blue-600" size="lg" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            <p class="text-sm text-gray-600">Your data stays private and secure</p>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">100% Local Storage</h3>
              <p class="text-sm text-gray-700 leading-relaxed">
                All your data is stored locally on your device. We don't collect, store, or transmit any personal information to external servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- App Features Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Features</h2>
            <p class="text-sm text-gray-600">What makes TempoDay special</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <Icon name="calendar" class="text-blue-600" size="md" />
            <span class="text-sm font-medium text-blue-900">Calendar-centric task management</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
            <Icon name="edit" class="text-purple-600" size="md" />
            <span class="text-sm font-medium text-purple-900">Daily notes and journaling</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
            <Icon name="dollar" class="text-green-600" size="md" />
            <span class="text-sm font-medium text-green-900">Personal finance tracking</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-900">Offline-first with local storage</span>
          </div>
        </div>
      </div>
    </div>

    <!-- App Information Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-2xl">T</span>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900">TempoDay</h2>
            <p class="text-sm text-gray-600 mb-1">Version 0.0.1</p>
            <p class="text-xs text-gray-500">Calendar-centric personal management</p>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500 text-center">
            Built with ❤️ for productivity and privacy
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom spacing for navigation -->
    <div class="h-4"></div>
  </div>
</div>