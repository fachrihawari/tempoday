<script lang="ts">
import Settings from '../components/Settings.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="Settings" 
    subtitle="Customize your TempoDay experience"
    icon="settings"
  />

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Currency Settings Section -->
    <Settings />

    <!-- Privacy & Security Section -->
    <section class="bg-white border-b border-gray-200 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Privacy & Security
        </h2>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
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
    </section>

    <!-- App Features Section -->
    <section class="bg-white border-b border-gray-200 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Key Features
        </h2>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span class="text-sm font-medium text-blue-900">Calendar-centric task management</span>
        </div>
        <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span class="text-sm font-medium text-purple-900">Daily notes and journaling</span>
        </div>
        <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line stroke-width="2" x1="12" y1="1" x2="12" y2="23"></line>
            <path stroke-width="2" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span class="text-sm font-medium text-green-900">Personal finance tracking</span>
        </div>
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-900">Offline-first with local storage</span>
        </div>
      </div>
    </section>

    <!-- App Information Section -->
    <section class="bg-white border-b border-gray-200 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          About TempoDay
        </h2>
      </div>
      
      <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
          <img src='/logo.png' class="w-12 h-12" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-lg">TempoDay</h3>
          <p class="text-sm text-gray-600 mb-1">Version 0.0.1</p>
          <p class="text-xs text-gray-500">Calendar-centric personal management</p>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          Built with ❤️ for productivity and privacy
        </p>
      </div>
    </section>
  </div>
</div>