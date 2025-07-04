<script lang="ts">
import { onMount } from 'svelte';
import Button from '../components/ui/Button.svelte';
import Icon, { type IconName } from '../components/ui/Icon.svelte';

// Svelte 5 approach: Use callback props instead of createEventDispatcher
interface Props {
  onIntroCompleted?: () => void;
}

let { onIntroCompleted }: Props = $props();

let currentSlide = $state(0);
let isAutoPlaying = $state(true);

interface Slide {
  icon: IconName;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  bgGradient: string;
  customStyle: string;
  customBgStyle: string;
  darkBgStyle: string;
}

const slides: Slide[] = [
  {
    icon: 'calendar',
    title: 'Calendar-Centric',
    subtitle: 'Everything organized by date',
    description:
      'Navigate through your days with an intuitive calendar interface. See all your tasks, notes, and finances in one place.',
    gradient: 'from-[#dfaea0] to-[#d4a394]', // Beautiful TempoDay peach
    bgGradient: 'from-[#faf8f7] to-[#f5f1ef]', // Soft peach background
    customStyle:
      'background: linear-gradient(135deg, rgb(180, 130, 115), rgb(160, 115, 100))',
    customBgStyle:
      'background: linear-gradient(135deg, rgb(250, 248, 247), rgb(245, 241, 239))',
    darkBgStyle:
      'background: linear-gradient(135deg, rgb(31, 41, 55), rgb(17, 24, 39))',
  },
  {
    icon: 'clipboard',
    title: 'Smart Tasks',
    subtitle: 'Get things done efficiently',
    description:
      'Create, organize, and track your daily tasks with simple taps. Mark them complete and stay productive.',
    gradient: 'from-blue-600 to-blue-800', // Darker blue for tasks
    bgGradient: 'from-blue-50 to-blue-100',
    customStyle:
      'background: linear-gradient(135deg, rgb(30, 64, 175), rgb(23, 37, 84))',
    customBgStyle:
      'background: linear-gradient(135deg, rgb(239, 246, 255), rgb(219, 234, 254))',
    darkBgStyle:
      'background: linear-gradient(135deg, rgb(30, 58, 138), rgb(15, 23, 42))',
  },
  {
    icon: 'edit',
    title: 'Daily Notes',
    subtitle: 'Capture your thoughts',
    description:
      'Write reflections, memories, and ideas in your personal diary. Your thoughts, safely stored.',
    gradient: 'from-purple-600 to-purple-800', // Darker purple for notes
    bgGradient: 'from-purple-50 to-purple-100',
    customStyle:
      'background: linear-gradient(135deg, rgb(107, 33, 168), rgb(88, 28, 135))',
    customBgStyle:
      'background: linear-gradient(135deg, rgb(250, 245, 255), rgb(243, 232, 255))',
    darkBgStyle:
      'background: linear-gradient(135deg, rgb(88, 28, 135), rgb(15, 23, 42))',
  },
  {
    icon: 'dollar',
    title: 'Finance Tracking',
    subtitle: 'Monitor your money',
    description:
      'Track income and expenses with instant daily summaries. Keep your finances organized and visible.',
    gradient: 'from-green-600 to-green-800', // Darker green for finance
    bgGradient: 'from-green-50 to-green-100',
    customStyle:
      'background: linear-gradient(135deg, rgb(21, 128, 61), rgb(20, 83, 45))',
    customBgStyle:
      'background: linear-gradient(135deg, rgb(240, 253, 244), rgb(220, 252, 231))',
    darkBgStyle:
      'background: linear-gradient(135deg, rgb(20, 83, 45), rgb(15, 23, 42))',
  },
  {
    icon: 'check-circle',
    title: 'Private & Secure',
    subtitle: 'Your data stays yours',
    description:
      'Everything stored locally on your device. No cloud sync, no tracking, complete privacy.',
    gradient: 'from-gray-600 to-gray-800', // Darker gray
    bgGradient: 'from-gray-50 to-gray-100',
    customStyle:
      'background: linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))',
    customBgStyle:
      'background: linear-gradient(135deg, rgb(249, 250, 251), rgb(243, 244, 246))',
    darkBgStyle:
      'background: linear-gradient(135deg, rgb(55, 65, 81), rgb(17, 24, 39))',
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

<!-- Beautiful Original Design with Authentic TempoDay Peach -->
<div class="h-screen flex flex-col transition-all duration-500 overflow-hidden">
  <!-- Dynamic background that respects dark mode -->
  <div class="absolute inset-0 opacity-90 dark:opacity-95 transition-opacity duration-500" style={currentSlideData.customBgStyle}></div>
  <div class="absolute inset-0 opacity-0 dark:opacity-90 transition-opacity duration-500" style={currentSlideData.darkBgStyle}></div>
  
  <!-- Content overlay -->
  <div class="relative z-10 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={currentSlideData.customStyle}>
          <img src="/logo.png" class="w-6 h-6" alt="TempoDay" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">TempoDay</h1>
          <p class="text-xs text-gray-600 dark:text-gray-400">Personal Management</p>
        </div>
      </div>
      
      <Button variant="ghost" onclick={skipIntro} class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
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
          <div class="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300" style={slide.customStyle}>
            <Icon name={slide.icon} class="text-white" size="3xl" />
          </div>
          
          <!-- Content -->
          <div class="max-w-sm space-y-4">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {slide.title}
            </h2>
            <p class="text-xl text-gray-700 dark:text-gray-300 font-medium">
              {slide.subtitle}
            </p>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Bottom Section -->
  <div class="px-6 py-6 space-y-6">
    <!-- Enhanced Slide Indicators with Better Contrast -->
    <div class="flex justify-center gap-3">
      {#each slides as slide, index}
        <button
          onclick={() => goToSlide(index)}
          class="relative w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-800
            {index === currentSlide 
              ? 'scale-125 shadow-lg' 
              : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-md border-2 border-gray-300 dark:border-gray-600'}"
          style={index === currentSlide ? slide.customStyle + '; box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 3px rgba(255,255,255,0.8)' : ''}
        >
          <!-- Inner dot for inactive indicators -->
          {#if index !== currentSlide}
            <div class="absolute inset-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Navigation Buttons -->
    <div class="flex gap-4">
      {#if currentSlide > 0}
        <Button variant="outline" onclick={prevSlide} class="flex-1 h-14 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          {#snippet children()}
            <Icon name="chevron-left" size="sm" class="mr-2" />
            Previous
          {/snippet}
        </Button>
      {:else}
        <div class="flex-1"></div>
      {/if}

      {#if currentSlide < slides.length - 1}
        <button 
          onclick={nextSlide} 
          class="flex-1 h-14 border-0 shadow-lg rounded-lg text-white font-medium flex items-center justify-center transition-all duration-200 hover:shadow-xl"
          style={currentSlideData.customStyle}
        >
          Next
          <Icon name="chevron-right" size="sm" class="ml-2" />
        </button>
      {:else}
        <button 
          onclick={startApp} 
          class="flex-1 h-14 border-0 shadow-lg rounded-lg text-white font-medium flex items-center justify-center transition-all duration-200 hover:shadow-xl"
          style={currentSlideData.customStyle}
        >
          <Icon name="check" size="sm" class="mr-2" />
          Get Started
        </button>
      {/if}
    </div>

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