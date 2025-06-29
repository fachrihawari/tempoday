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
    description: 'Navigate through your days with an intuitive calendar interface.',
    gradient: 'from-blue-400/20 to-blue-600/20',
    iconBg: 'bg-blue-500',
  },
  {
    icon: 'clipboard',
    title: 'Smart Tasks',
    subtitle: 'Get things done efficiently',
    description: 'Create, organize, and track your daily tasks with simple taps.',
    gradient: 'from-purple-400/20 to-purple-600/20',
    iconBg: 'bg-purple-500',
  },
  {
    icon: 'edit',
    title: 'Daily Notes',
    subtitle: 'Capture your thoughts',
    description: 'Write reflections and memories in your personal diary.',
    gradient: 'from-emerald-400/20 to-emerald-600/20',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: 'dollar',
    title: 'Finance Tracking',
    subtitle: 'Monitor your money',
    description: 'Track income and expenses with instant summaries.',
    gradient: 'from-green-400/20 to-green-600/20',
    iconBg: 'bg-green-500',
  },
  {
    icon: 'check-circle',
    title: 'Private & Secure',
    subtitle: 'Your data stays yours',
    description: 'Everything stored locally. No cloud, no tracking.',
    gradient: 'from-gray-400/20 to-gray-600/20',
    iconBg: 'bg-gray-600',
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
  }, 5000); // Slower for better UX

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

<!-- Modern Minimalist Design -->
<div class="h-screen flex flex-col bg-white overflow-hidden">
  <!-- Minimal Header -->
  <div class="flex items-center justify-between px-6 py-4">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <img src="/logo.png" class="w-5 h-5" alt="TempoDay" />
      </div>
      <span class="text-lg font-semibold text-gray-900">TempoDay</span>
    </div>
    
    <button
      onclick={skipIntro}
      class="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-full hover:bg-gray-50"
    >
      Skip
    </button>
  </div>

  <!-- Main Content with Smooth Transitions -->
  <div 
    class="flex-1 relative overflow-hidden px-6"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <!-- Slide Container -->
    <div class="h-full flex transition-all duration-700 ease-out" style="transform: translateX(-{currentSlide * 100}%)">
      {#each slides as slide, index (index)}
        <div class="w-full h-full flex-shrink-0 flex flex-col items-center justify-center text-center">
          <!-- Background Gradient (Subtle) -->
          <div class="absolute inset-0 bg-gradient-to-br {slide.gradient} opacity-50 rounded-3xl mx-6"></div>
          
          <!-- Content Container -->
          <div class="relative z-10 max-w-sm mx-auto space-y-8">
            <!-- Icon with Floating Animation -->
            <div class="flex justify-center">
              <div class="w-20 h-20 {slide.iconBg} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 animate-float">
                <Icon name={slide.icon} class="text-white" size="xl" />
              </div>
            </div>
            
            <!-- Text Content -->
            <div class="space-y-4">
              <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
                {slide.title}
              </h2>
              <p class="text-lg text-gray-600 font-medium">
                {slide.subtitle}
              </p>
              <p class="text-gray-500 leading-relaxed text-base">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Clean Bottom Section -->
  <div class="px-6 pb-8 space-y-6">
    <!-- Minimal Slide Indicators -->
    <div class="flex justify-center gap-2">
      {#each slides as _, index}
        <button
          onclick={() => goToSlide(index)}
          class="h-1.5 rounded-full transition-all duration-300 {index === currentSlide 
            ? 'bg-gray-900 w-8' 
            : 'bg-gray-300 w-1.5 hover:bg-gray-400'}"
        ></button>
      {/each}
    </div>

    <!-- Navigation -->
    <div class="flex gap-3">
      {#if currentSlide > 0}
        <button
          onclick={prevSlide}
          class="flex-1 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Icon name="chevron-left" size="sm" class="mr-2" />
          Previous
        </button>
      {:else}
        <div class="flex-1"></div>
      {/if}

      {#if currentSlide < slides.length - 1}
        <button
          onclick={nextSlide}
          class="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          Next
          <Icon name="chevron-right" size="sm" class="ml-2" />
        </button>
      {:else}
        <button
          onclick={startApp}
          class="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Icon name="check" size="sm" class="mr-2" />
          Get Started
        </button>
      {/if}
    </div>

    <!-- Feature Pills -->
    <div class="flex justify-center gap-2 flex-wrap">
      <div class="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-1.5">
        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span class="text-xs font-medium text-gray-700">Tasks</span>
      </div>
      <div class="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-1.5">
        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span class="text-xs font-medium text-gray-700">Notes</span>
      </div>
      <div class="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-1.5">
        <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span class="text-xs font-medium text-gray-700">Finance</span>
      </div>
      <div class="px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-1.5">
        <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
        <span class="text-xs font-medium text-gray-700">Private</span>
      </div>
    </div>
  </div>
</div>

<style>
/* Smooth transitions */
.transition-all {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Floating animation for icons */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  display: none;
}
</style>