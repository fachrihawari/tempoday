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
    title: 'Calendar-Centric',
    subtitle: 'Everything organized by date',
    description: 'Navigate through your days with an intuitive calendar interface. See all your tasks, notes, and finances in one place.',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
  },
  {
    icon: 'clipboard',
    title: 'Smart Tasks',
    subtitle: 'Get things done efficiently',
    description: 'Create, organize, and track your daily tasks with simple taps. Mark them complete and stay productive.',
    gradient: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
  },
  {
    icon: 'edit',
    title: 'Daily Notes',
    subtitle: 'Capture your thoughts',
    description: 'Write reflections, memories, and ideas in your personal diary. Your thoughts, safely stored.',
    gradient: 'from-emerald-400 to-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100',
  },
  {
    icon: 'dollar',
    title: 'Finance Tracking',
    subtitle: 'Monitor your money',
    description: 'Track income and expenses with instant daily summaries. Keep your finances organized and visible.',
    gradient: 'from-green-400 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
  },
  {
    icon: 'check-circle',
    title: 'Private & Secure',
    subtitle: 'Your data stays yours',
    description: 'Everything stored locally on your device. No cloud sync, no tracking, complete privacy.',
    gradient: 'from-gray-400 to-gray-600',
    bgGradient: 'from-gray-50 to-gray-100',
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
  localStorage.setItem('tempoday-intro-seen', 'true');
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
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

const currentSlideData = $derived(slides[currentSlide]);
</script>

<!-- Beautiful Original Design with Subtle Improvements -->
<div class="h-screen flex flex-col bg-gradient-to-br {currentSlideData.bgGradient} transition-all duration-500 overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br {currentSlideData.gradient} flex items-center justify-center shadow-lg">
        <img src="/logo.png" class="w-6 h-6" alt="TempoDay" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-900">TempoDay</h1>
        <p class="text-xs text-gray-600">Personal Management</p>
      </div>
    </div>
    
    <Button variant="ghost" onclick={skipIntro} class="text-gray-600 hover:text-gray-800">
      {#snippet children()}Skip{/snippet}
    </Button>
  </div>

  <!-- Main Content -->
  <div 
    class="flex-1 relative overflow-hidden"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <!-- Slide Container -->
    <div class="h-full flex transition-transform duration-500 ease-out" style="transform: translateX(-{currentSlide * 100}%)">
      {#each slides as slide, index (index)}
        <div class="w-full h-full flex-shrink-0 flex flex-col items-center justify-center text-center px-8">
          <!-- Large Icon with Beautiful Gradient -->
          <div class="w-32 h-32 rounded-3xl bg-gradient-to-br {slide.gradient} flex items-center justify-center shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
            <Icon name={slide.icon} class="text-white" size="3xl" />
          </div>
          
          <!-- Content -->
          <div class="max-w-sm space-y-4">
            <h2 class="text-3xl font-bold text-gray-900 leading-tight">
              {slide.title}
            </h2>
            <p class="text-xl text-gray-700 font-medium">
              {slide.subtitle}
            </p>
            <p class="text-gray-600 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Bottom Section -->
  <div class="px-6 pb-8 space-y-6">
    <!-- Slide Indicators -->
    <div class="flex justify-center gap-2">
      {#each slides as _, index}
        <button
          onclick={() => goToSlide(index)}
          class="w-3 h-3 rounded-full transition-all duration-300 {index === currentSlide 
            ? 'bg-gradient-to-r ' + currentSlideData.gradient + ' scale-125' 
            : 'bg-white/50 hover:bg-white/70'}"
        ></button>
      {/each}
    </div>

    <!-- Navigation Buttons -->
    <div class="flex gap-4">
      {#if currentSlide > 0}
        <Button variant="outline" onclick={prevSlide} class="flex-1 h-14 text-gray-700 border-gray-300">
          {#snippet children()}
            <Icon name="chevron-left" size="sm" class="mr-2" />
            Previous
          {/snippet}
        </Button>
      {:else}
        <div class="flex-1"></div>
      {/if}

      {#if currentSlide < slides.length - 1}
        <Button variant="primary" onclick={nextSlide} class="flex-1 h-14 bg-gradient-to-r {currentSlideData.gradient} border-0 shadow-lg">
          {#snippet children()}
            Next
            <Icon name="chevron-right" size="sm" class="ml-2" />
          {/snippet}
        </Button>
      {:else}
        <Button variant="primary" onclick={startApp} class="flex-1 h-14 bg-gradient-to-r {currentSlideData.gradient} border-0 shadow-lg">
          {#snippet children()}
            <Icon name="check" size="sm" class="mr-2" />
            Get Started
          {/snippet}
        </Button>
      {/if}
    </div>

    <!-- Feature Tags -->
    <div class="flex justify-center gap-2 flex-wrap">
      <span class="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-gray-700 shadow-sm">
        📋 Tasks
      </span>
      <span class="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-gray-700 shadow-sm">
        📝 Notes
      </span>
      <span class="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-gray-700 shadow-sm">
        💰 Finance
      </span>
      <span class="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-gray-700 shadow-sm">
        🔒 Private
      </span>
    </div>
  </div>
</div>

<style>
/* Smooth transitions */
.transition-transform {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>