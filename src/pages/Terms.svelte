<script lang="ts">
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { reactiveRouter } from '../stores/router.svelte';

function goBack() {
  reactiveRouter.navigate('/settings');
}
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="Terms & Conditions" 
    subtitle="Updated June 30, 2025"
    onBack={goBack}
  />

  <!-- Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Introduction -->
    <Card 
      title="Welcome to TempoDay" 
      icon="info-circle" 
      iconColor="text-blue-600 dark:text-blue-400"
      collapsible={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            These Terms and Conditions ("Terms") govern your use of TempoDay, a calendar-centric personal management application. 
            By using our app, you agree to be bound by these Terms.
          </p>
          <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div class="flex items-start gap-2">
              <Icon name="info-circle" class="text-blue-600 dark:text-blue-400 mt-0.5" size="sm" />
              <div class="text-sm">
                <div class="font-medium text-blue-900 dark:text-blue-100">Important</div>
                <div class="text-blue-700 dark:text-blue-300">Please read these terms carefully before using TempoDay.</div>
              </div>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- Acceptance of Terms -->
    <Card 
      title="1. Acceptance of Terms" 
      icon="check-circle" 
      iconColor="text-green-600 dark:text-green-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-3">
            By accessing and using TempoDay, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>You agree to use the app in accordance with these Terms</li>
            <li>You understand that we may update these Terms from time to time</li>
            <li>Continued use of the app constitutes acceptance of updated Terms</li>
          </ul>
        </div>
      {/snippet}
    </Card>

    <!-- Description of Service -->
    <Card 
      title="2. Description of Service" 
      icon="calendar" 
      iconColor="text-purple-600 dark:text-purple-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-3">
            TempoDay is a calendar-centric personal management application that allows users to:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="clipboard" class="text-blue-600 dark:text-blue-400" size="sm" />
                <span class="font-medium text-gray-900 dark:text-gray-100">Task Management</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create and manage daily to-do lists</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="edit" class="text-purple-600 dark:text-purple-400" size="sm" />
                <span class="font-medium text-gray-900 dark:text-gray-100">Daily Notes</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Write diary-like notes for each day</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="dollar" class="text-green-600 dark:text-green-400" size="sm" />
                <span class="font-medium text-gray-900 dark:text-gray-100">Financial Tracking</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Record income and expenses</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="calendar" class="text-orange-600 dark:text-orange-400" size="sm" />
                <span class="font-medium text-gray-900 dark:text-gray-100">Calendar View</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Access all data through calendar interface</p>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- Privacy and Data -->
    <Card 
      title="3. Privacy & Data Storage" 
      icon="shield" 
      iconColor="text-green-600 dark:text-green-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <div class="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="check-circle" class="text-white" size="sm" />
              </div>
              <div>
                <h4 class="font-medium text-green-900 dark:text-green-100 mb-1">100% Local Storage</h4>
                <p class="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                  All your data is stored locally on your device. We do not collect, store, or transmit any personal information to external servers.
                </p>
              </div>
            </div>
          </div>
          
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">What this means for you:</h4>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Your tasks, notes, and financial data never leave your device</li>
            <li>No user accounts or registration required</li>
            <li>No cloud synchronization or external data transmission</li>
            <li>Complete control over your personal information</li>
            <li>Data persists only on your local device storage</li>
          </ul>
        </div>
      {/snippet}
    </Card>

    <!-- Donations and Support -->
    <Card 
      title="4. Donations & Financial Support" 
      icon="heart" 
      iconColor="text-rose-600 dark:text-rose-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <div class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-rose-500 dark:bg-rose-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-white text-lg">❤️</span>
              </div>
              <div>
                <h4 class="font-medium text-rose-900 dark:text-rose-100 mb-1">Voluntary Support</h4>
                <p class="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                  TempoDay is free to use. Donations are completely voluntary and help support continued development.
                </p>
              </div>
            </div>
          </div>

          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">Important Donation Terms:</h4>
          <ul class="list-disc list-inside space-y-2 text-sm mb-4">
            <li><strong>Voluntary Nature:</strong> All donations are voluntary and optional</li>
            <li><strong>No Additional Features:</strong> Donations do not unlock premium features</li>
            <li><strong>Non-Refundable:</strong> All donations are final and non-refundable</li>
            <li><strong>Processing:</strong> Donations are processed through secure third-party payment providers</li>
            <li><strong>No Guarantee:</strong> Donations do not guarantee specific features or development timelines</li>
            <li><strong>Tax Responsibility:</strong> Users are responsible for any applicable tax implications</li>
          </ul>

          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">What donations support:</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-2">
              <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
              <span>New feature development</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
              <span>Bug fixes and improvements</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
              <span>Performance optimizations</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
              <span>Keeping the app free for everyone</span>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- User Responsibilities -->
    <Card 
      title="5. User Responsibilities" 
      icon="exclamation-triangle" 
      iconColor="text-orange-600 dark:text-orange-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-3">As a user of TempoDay, you agree to:</p>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Use the app only for lawful purposes</li>
            <li>Not attempt to reverse engineer, modify, or distribute the app</li>
            <li>Not use the app to store illegal or harmful content</li>
            <li>Understand that you are responsible for backing up your data</li>
            <li>Report any bugs or security issues responsibly</li>
            <li>Respect the intellectual property rights of the app</li>
          </ul>
        </div>
      {/snippet}
    </Card>

    <!-- Disclaimers -->
    <Card 
      title="6. Disclaimers & Limitations" 
      icon="alert-circle" 
      iconColor="text-yellow-600 dark:text-yellow-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">Service Availability:</h4>
          <ul class="list-disc list-inside space-y-2 text-sm mb-4">
            <li>TempoDay is provided "as is" without warranties of any kind</li>
            <li>We do not guarantee uninterrupted or error-free operation</li>
            <li>The app may be updated, modified, or discontinued at any time</li>
            <li>We are not liable for any data loss (though data is stored locally)</li>
          </ul>

          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">Financial Tracking Disclaimer:</h4>
          <div class="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
            <div class="flex items-start gap-2">
              <Icon name="exclamation-triangle" class="text-yellow-600 dark:text-yellow-400 mt-0.5" size="sm" />
              <div class="text-sm">
                <div class="font-medium text-yellow-900 dark:text-yellow-100">Important Notice</div>
                <div class="text-yellow-700 dark:text-yellow-300">
                  TempoDay is not a professional financial tool. Always consult qualified professionals for financial advice.
                </div>
              </div>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- Intellectual Property -->
    <Card 
      title="7. Open Source & Intellectual Property" 
      icon="check-circle" 
      iconColor="text-indigo-600 dark:text-indigo-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <div class="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-indigo-500 dark:bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="check-circle" class="text-white" size="sm" />
              </div>
              <div>
                <h4 class="font-medium text-indigo-900 dark:text-indigo-100 mb-1">Open Source & Free Forever</h4>
                <p class="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  TempoDay is open source software and will always remain free. You are welcome to copy, modify, distribute, and self-host your own version.
                </p>
              </div>
            </div>
          </div>

          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">What this means:</h4>
          <ul class="list-disc list-inside space-y-2 text-sm mb-4">
            <li><strong>Free to Use:</strong> TempoDay is completely free for personal use and always will be</li>
            <li><strong>Open Source:</strong> Source code is publicly available on GitHub</li>
            <li><strong>Copy & Modify:</strong> You can freely copy, modify, and distribute the code</li>
            <li><strong>Self-Hosting:</strong> You're welcome to host your own instance for personal use</li>
            <li><strong>Fork & Customize:</strong> Create your own version with different features</li>
            <li><strong>Non-Commercial:</strong> Use is restricted to personal, educational, and non-commercial purposes</li>
          </ul>

          <div class="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <div class="flex items-start gap-2">
              <Icon name="exclamation-triangle" class="text-yellow-600 dark:text-yellow-400 mt-0.5" size="sm" />
              <div class="text-sm">
                <div class="font-medium text-yellow-900 dark:text-yellow-100">Commercial Use Restriction</div>
                <div class="text-yellow-700 dark:text-yellow-300">
                  TempoDay cannot be used for commercial purposes, including but not limited to selling, monetizing, or using in commercial products or services.
                </div>
              </div>
            </div>
          </div>

          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">Your rights and responsibilities:</h4>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Your personal data remains your property and is stored locally on your device</li>
            <li>We respect open-source components and list them in our acknowledgments</li>
            <li>When forking or redistributing, please respect the non-commercial license terms</li>
            <li>Attribution is appreciated but not required for personal use</li>
            <li>The TempoDay name and logo are trademarks, but you can rebrand your fork</li>
            <li>Commercial licensing may be available upon request for business use cases</li>
          </ul>
        </div>
      {/snippet}
    </Card>

    <!-- Changes to Terms -->
    <Card 
      title="8. Changes to Terms" 
      icon="edit" 
      iconColor="text-gray-600 dark:text-gray-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-3">
            We may update these Terms from time to time. When we do:
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>We will update the "Updated" date at the top of this page</li>
            <li>Significant changes will be highlighted in the app</li>
            <li>Continued use of the app constitutes acceptance of updated Terms</li>
            <li>You can always access the current Terms in the Settings section</li>
          </ul>
        </div>
      {/snippet}
    </Card>

    <!-- Contact Information -->
    <Card 
      title="9. Contact & Support" 
      icon="info-circle" 
      iconColor="text-blue-600 dark:text-blue-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-4">
            If you have questions about these Terms or need support:
          </p>
          
          <div class="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onclick={() => window.open('https://github.com/fachrihawari/tempoday/issues', '_blank', 'noopener,noreferrer')}
              class="!w-full !justify-start !text-gray-700 dark:!text-gray-300 hover:!text-blue-600 dark:hover:!text-blue-400 !border-gray-300 dark:!border-gray-600 hover:!border-blue-300 dark:hover:!border-blue-500"
            >
              {#snippet children()}
                <Icon name="info-circle" class="text-blue-600 dark:text-blue-400" size="sm" />
                <span class="ml-1">Report Issues on GitHub</span>
              {/snippet}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onclick={() => window.open('https://github.com/fachrihawari/tempoday', '_blank', 'noopener,noreferrer')}
              class="!w-full !justify-start !text-gray-700 dark:!text-gray-300 hover:!text-green-600 dark:hover:!text-green-400 !border-gray-300 dark:!border-gray-600 hover:!border-green-300 dark:hover:!border-green-500"
            >
              {#snippet children()}
                <Icon name="check-circle" class="text-green-600 dark:text-green-400" size="sm" />
                <span class="ml-1">View Project on GitHub</span>
              {/snippet}
            </Button>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- Final Notice -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
      <Icon name="check-circle" class="text-green-500 dark:text-green-400 mx-auto mb-2" size="lg" />
      <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">Thank you for using TempoDay!</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        By using our app, you help us create a better personal management experience for everyone.
      </p>
    </div>
  </div>
</div>
