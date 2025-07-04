<script lang="ts">
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import { reactiveRouter } from '../stores/router.svelte';

function goBack() {
  reactiveRouter.navigate('/settings');
}

function goToDashboard() {
  reactiveRouter.navigate('/');
}
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
    <button
      onclick={goBack}
      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      aria-label="Go back to settings"
    >
      <Icon name="chevron-left" class="text-gray-600 dark:text-gray-300" />
    </button>
    <div>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Thank You!</h1>
      <p class="text-sm text-gray-600 dark:text-gray-300">Your support means everything to us</p>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Main Thank You Message -->
    <div class="text-center py-12 px-6">
      <!-- Heart Animation Container -->
      <div class="relative mb-8">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
          <span class="text-4xl animate-pulse">❤️</span>
        </div>
        
        <!-- Floating hearts animation -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-2 left-8 text-red-400 dark:text-red-300 animate-bounce" style="animation-delay: 0.5s;">💕</div>
          <div class="absolute top-4 right-6 text-pink-400 dark:text-pink-300 animate-bounce" style="animation-delay: 1s;">💖</div>
          <div class="absolute bottom-2 left-6 text-red-300 dark:text-red-200 animate-bounce" style="animation-delay: 1.5s;">💗</div>
          <div class="absolute bottom-4 right-8 text-pink-300 dark:text-pink-200 animate-bounce" style="animation-delay: 2s;">💝</div>
        </div>
      </div>

      <!-- Thank You Title -->
      <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Thank You for Your Support!
      </h2>
      
      <!-- Gratitude Message -->
      <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
        Your generosity helps us continue building and improving TempoDay. Every donation, no matter the size, 
        makes a real difference in our ability to keep the app free and add amazing new features.
      </p>

      <!-- Impact Message -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6 mb-8 max-w-2xl mx-auto">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">Your Impact</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="check-circle" class="text-white" size="sm" />
            </div>
            <div class="text-left min-w-0">
              <div class="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Keep TempoDay Free</div>
              <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">For everyone, forever</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="trending-up" class="text-white" size="sm" />
            </div>
            <div class="text-left min-w-0">
              <div class="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">New Features</div>
              <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Faster development</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="settings" class="text-white" size="sm" />
            </div>
            <div class="text-left min-w-0">
              <div class="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Bug Fixes</div>
              <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Better stability</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="check-circle" class="text-white" size="sm" />
            </div>
            <div class="text-left min-w-0">
              <div class="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Privacy First</div>
              <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Always local storage</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Message -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">You're Part of Something Special</h3>
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
          By supporting TempoDay, you're helping build a community-driven app that prioritizes user privacy and freedom. 
          Your contribution helps us maintain our commitment to keeping TempoDay open source and free for everyone.
        </p>
        
        <!-- Stats or Community Info -->
        <div class="flex justify-center items-center gap-6 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Open Source</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Tracking</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Free Forever</div>
          </div>
        </div>
      </div>

      <!-- What's Next -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What's Next?</h3>
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
          We're constantly working on new features and improvements. Stay tuned for exciting updates coming soon!
        </p>
        
        <!-- Future Features Preview -->
        <div class="flex flex-wrap justify-center gap-2 text-xs">
          <span class="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">🌟 Enhanced UI</span>
          <span class="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">📊 Better Analytics</span>
          <span class="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">🎨 Themes</span>
          <span class="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">📱 Mobile Improvements</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 max-w-sm mx-auto">
        <Button
          variant="primary"
          fullWidth
          onclick={goToDashboard}
          class="!py-3"
        >
          {#snippet children()}
            <Icon name="home" class="text-white" size="sm" />
            <span>Start Using TempoDay</span>
          {/snippet}
        </Button>
        
        <div class="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onclick={() => window.open('https://github.com/fachrihawari/tempoday', '_blank', 'noopener,noreferrer')}
            class="!py-2"
          >
            {#snippet children()}
              ⭐ Star on GitHub
            {/snippet}
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onclick={() => {
              const shareContent = {
                title: 'TempoDay - Calendar-Centric Personal Management',
                text: 'Check out TempoDay, a privacy-focused personal management app!',
                url: 'https://tempoday.site'
              };
              
              if (navigator.share && navigator.canShare && navigator.canShare(shareContent)) {
                navigator.share(shareContent);
              } else {
                navigator.clipboard.writeText(`${shareContent.title}\n\n${shareContent.text}\n\n${shareContent.url}`);
              }
            }}
            class="!py-2"
          >
            {#snippet children()}
              📢 Share
            {/snippet}
          </Button>
        </div>
      </div>

      <!-- Final Message -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 italic">
          "Building something beautiful together, one day at a time."
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
          — The TempoDay Team
        </p>
      </div>
    </div>
  </div>
</div>
