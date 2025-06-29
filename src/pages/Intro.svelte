<script lang="ts">
import { onMount } from 'svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';

// Svelte 5 approach: Use callback props instead of createEventDispatcher
interface Props {
  onIntroCompleted?: () => void;
}

let { onIntroCompleted }: Props = $props();

let currentSlide = $state(0);
let isAutoPlaying = $state(true);

const slides = [
  {
    icon: 'calendar',
    title: 'Calendar-Centric Design',
    subtitle: 'Everything organized by date',
    description: 'Navigate through your days with an intuitive calendar interface. See all your tasks, notes, and finances for any date at a glance.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
  },
  {
    icon: 'clipboard',
    title: 'Smart Task Management',
    subtitle: 'Get things done efficiently',
    description: 'Create, organize, and track your daily tasks. Mark them complete with a simple tap and stay on top of your productivity.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
  },
  {
    icon: 'edit',
    title: 'Daily Journaling',
    subtitle: 'Capture your thoughts',
    description: 'Write daily notes, reflections, and memories. Keep a personal diary that helps you track your growth and experiences.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
  },
  {
    icon: 'dollar',
    title: 'Financial Tracking',
    subtitle: 'Monitor your money',
    description: 'Track daily income and expenses with ease. Get instant summaries and maintain awareness of your financial habits.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
  },
  {
    icon: 'check-circle',
    title: '100% Private & Local',
    subtitle: 'Your data stays yours',
    description: 'All your information is stored locally on your device. No cloud sync, no data collection, complete privacy guaranteed.',
    color: 'from-gray-700 to-gray-800',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-900',
  },
];

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
}

function prevSlide() {
  currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
}

function goToSlide(index: number) {
  currentSlide = index;
  isAutoPlaying = false;
}

function startApp() {
  // Set a flag in localStorage to indicate the user has seen the intro
  localStorage.setItem('tempoday-intro-seen', 'true');
  
  // Call the callback prop function (Svelte 5 way)
  onIntroCompleted?.();
}

function skipIntro() {
  startApp();
}

// Auto-advance slides
onMount(() => {
  const interval = setInterval(() => {
    if (isAutoPlaying) {
      nextSlide();
    }
  }, 4000);

  return () => clearInterval(interval);
});

// Handle swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    isAutoPlaying = false;
    if (diff > 0) {
      nextSlide(); // Swipe left - next slide
    } else {
      prevSlide(); // Swipe right - previous slide
    }
  }
}

const currentSlideData = $derived(slides[currentSlide]);
</script>

<div class="h-screen flex flex-col bg-white overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 bg-white border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <img src="/logo.png" class="w-6 h-6" alt="TempoDay" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-900">TempoDay</h1>
        <p class="text-xs text-gray-500">Personal Management</p>
      </div>
    </div>
    
    <Button
      variant="ghost"
      size="sm"
      onclick={skipIntro}
      class="text-gray-600 hover:text-gray-800"
    >
      {#snippet children()}
        Skip
      {/snippet}
    </Button>
  </div>

  <!-- Main Content Area -->
  <div 
    class="flex-1 relative overflow-hidden"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <!-- Slide Content -->
    <div class="h-full flex transition-transform duration-500 ease-out" style="transform: translateX(-{currentSlide * 100}%)">
      {#each slides as slide, index (index)}
        <div class="w-full h-full flex-shrink-0 flex flex-col">
          <!-- Hero Section -->
          <div class="flex-1 {slide.bgColor} flex flex-col items-center justify-center px-6 py-12 text-center">
            <!-- Icon -->
            <div class="w-24 h-24 bg-gradient-to-br {slide.color} rounded-3xl flex items-center justify-center mb-8 shadow-lg">
              <Icon name={slide.icon} class="text-white" size="2xl" />
            </div>
            
            <!-- Content -->
            <div class="max-w-sm">
              <h2 class="text-2xl font-bold {slide.textColor} mb-3">
                {slide.title}
              </h2>
              <p class="text-lg font-medium text-gray-600 mb-4">
                {slide.subtitle}
              </p>
              <p class="text-gray-700 leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Bottom Section -->
  <div class="bg-white border-t border-gray-100 p-6">
    <!-- Slide Indicators -->
    <div class="flex justify-center gap-2 mb-6">
      {#each slides as _, index}
        <button
          onclick={() => goToSlide(index)}
          class="w-2 h-2 rounded-full transition-all duration-300 {index === currentSlide 
            ? 'bg-blue-500 w-6' 
            : 'bg-gray-300 hover:bg-gray-400'}"
        ></button>
      {/each}
    </div>

    <!-- Navigation Buttons -->
    <div class="flex gap-3">
      {#if currentSlide > 0}
        <Button
          variant="outline"
          onclick={prevSlide}
          class="flex-1"
        >
          {#snippet children()}
            <Icon name="chevron-left" size="sm" class="mr-2" />
            Previous
          {/snippet}
        </Button>
      {:else}
        <div class="flex-1"></div>
      {/if}

      {#if currentSlide < slides.length - 1}
        <Button
          variant="primary"
          onclick={nextSlide}
          class="flex-1"
        >
          {#snippet children()}
            Next
            <Icon name="chevron-right" size="sm" class="ml-2" />
          {/snippet}
        </Button>
      {:else}
        <Button
          variant="primary"
          onclick={startApp}
          class="flex-1 !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700"
        >
          {#snippet children()}
            <Icon name="check" size="sm" class="mr-2" />
            Get Started
          {/snippet}
        </Button>
      {/if}
    </div>

    <!-- Feature Preview -->
    <div class="mt-6 grid grid-cols-4 gap-3">
      <div class="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
        <Icon name="clipboard" class="text-blue-600 mb-1" size="sm" />
        <span class="text-xs font-medium text-blue-900">Tasks</span>
      </div>
      <div class="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
        <Icon name="edit" class="text-purple-600 mb-1" size="sm" />
        <span class="text-xs font-medium text-purple-900">Notes</span>
      </div>
      <div class="flex flex-col items-center p-2 bg-green-50 rounded-lg">
        <Icon name="dollar" class="text-green-600 mb-1" size="sm" />
        <span class="text-xs font-medium text-green-900">Finance</span>
      </div>
      <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <Icon name="check-circle" class="text-gray-600 mb-1" size="sm" />
        <span class="text-xs font-medium text-gray-900">Private</span>
      </div>
    </div>
  </div>
</div>
</script>

<style>
/* Ensure smooth transitions */
.transition-transform {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>