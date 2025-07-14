<script lang="ts">
import { onMount } from 'svelte';
import {
  formatDate,
  formatDayOfWeek,
  getDateRange,
  isSameDate,
  isToday,
} from '../lib/date';
import { appState, setSelectedDate } from '../stores/app.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';

let scrollContainer = $state<HTMLElement>();
let dateRange = $state<Date[]>([]);
let isExpanded = $state(true); // State to control date picker visibility
let isUserScrolling = $state(false); // Flag to prevent auto-scroll during user interaction
let scrollTimeout: ReturnType<typeof setTimeout>;
let isLoadingDates = $state(false); // Flag to prevent multiple simultaneous loads
let isAdjustingScroll = $state(false); // Flag to prevent scroll handler during position adjustment

// Initialize date range around the selected date
function initializeDateRange(centerDate: Date) {
  dateRange = getDateRange(centerDate, 30); // 30 days around center date (60 days total)
}

function selectDate(date: Date) {
  setSelectedDate(new Date(date));
}

function goToToday() {
  const today = new Date();

  // Set the selected date first
  setSelectedDate(today);

  // Check if today is already in the current date range
  const isInRange = dateRange.some((date) => isSameDate(date, today));

  if (isInRange) {
    // If today is already in range, just scroll to it smoothly
    setTimeout(() => {
      scrollToDate(today);
    }, 10);
  } else {
    // Only regenerate date range if today is not in the current range
    initializeDateRange(today);

    // Wait for the range to update, then scroll
    setTimeout(() => {
      scrollToDate(today);
    }, 50);
  }
}

function scrollToDate(targetDate: Date, immediate = false) {
  if (!scrollContainer || dateRange.length === 0) {
    return;
  }

  const targetIndex = dateRange.findIndex((date) =>
    isSameDate(date, targetDate),
  );

  if (targetIndex >= 0) {
    // Find the target button element
    const buttons = scrollContainer.querySelectorAll('button');
    const targetButton = buttons[targetIndex];

    if (targetButton) {
      // Use scrollIntoView for reliable centering
      targetButton.scrollIntoView({
        behavior: immediate ? 'instant' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }
}

onMount(() => {
  // Initialize with the current selected date or today
  const currentDate = appState.selectedDate || new Date();
  initializeDateRange(currentDate);

  // Ensure proper centering with multiple attempts for reliable positioning
  const attemptScroll = () => {
    if (scrollContainer && scrollContainer.children.length > 0) {
      scrollToDate(currentDate, true);
      return true;
    }
    return false;
  };

  // First attempt after DOM update
  requestAnimationFrame(() => {
    if (!attemptScroll()) {
      // Second attempt with slight delay
      setTimeout(() => {
        if (!attemptScroll()) {
          // Final attempt with more delay
          setTimeout(() => attemptScroll(), 100);
        }
      }, 50);
    }
  });
});

// Reactive effect to handle external selectedDate changes
$effect(() => {
  const currentSelectedDate = appState.selectedDate;

  // Only auto-scroll if user is not actively scrolling
  if (
    currentSelectedDate &&
    dateRange.length > 0 &&
    scrollContainer &&
    !isUserScrolling
  ) {
    // Check if selected date is in current range
    const isInRange = dateRange.some((date) =>
      isSameDate(date, currentSelectedDate),
    );

    if (!isInRange) {
      // If selected date is not in range, regenerate range around it
      initializeDateRange(currentSelectedDate);

      // Wait for range to update, then scroll
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToDate(currentSelectedDate);
        }, 50);
      });
    }
  }
});

function loadMoreDates(direction: 'past' | 'future') {
  // Prevent multiple simultaneous loads
  if (isLoadingDates) return;

  isLoadingDates = true;
  const daysToAdd = 15; // Reduced from 30 for better performance

  if (direction === 'past') {
    const firstDate = dateRange[0];
    const newDates: Date[] = [];
    for (let i = daysToAdd; i > 0; i--) {
      const newDate = new Date(firstDate);
      newDate.setDate(firstDate.getDate() - i);
      newDates.push(newDate);
    }
    dateRange = [...newDates, ...dateRange];
  } else {
    const lastDate = dateRange[dateRange.length - 1];
    const newDates: Date[] = [];
    for (let i = 1; i <= daysToAdd; i++) {
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + i);
      newDates.push(newDate);
    }
    dateRange = [...dateRange, ...newDates];
  }

  // Reset the loading flag after a brief delay to allow DOM updates
  setTimeout(() => {
    isLoadingDates = false;
  }, 100);
}

function handleScroll() {
  if (
    !scrollContainer ||
    dateRange.length === 0 ||
    isLoadingDates ||
    isAdjustingScroll
  )
    return;

  // Set user scrolling flag
  isUserScrolling = true;

  // Clear the flag after scrolling stops
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isUserScrolling = false;
  }, 300);

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
  const buttonWidth = 60; // Approximate button width including gap

  // Load more dates when scrolled near the beginning (within 1 button for even more conservative loading)
  if (scrollLeft < buttonWidth * 1) {
    // Temporarily remove scroll listener to prevent interference
    scrollContainer.removeEventListener('scroll', handleScroll);
    isAdjustingScroll = true;

    const oldScrollLeft = scrollLeft;
    const currentFirstDate = dateRange[0];

    loadMoreDates('past');

    // Wait for DOM to update, then adjust scroll position
    requestAnimationFrame(() => {
      if (!scrollContainer) {
        isAdjustingScroll = false;
        // Re-add scroll listener
        scrollContainer!.addEventListener('scroll', handleScroll);
        return;
      }

      // Calculate how many new dates were added
      const newFirstDateIndex = dateRange.findIndex(
        (date) => date.getTime() === currentFirstDate.getTime(),
      );

      if (newFirstDateIndex > 0) {
        // Calculate the new scroll position based on added buttons
        const addedButtons = newFirstDateIndex;
        const newScrollLeft = oldScrollLeft + addedButtons * buttonWidth;

        // Set the scroll position immediately without smooth scrolling
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.scrollLeft = newScrollLeft;

        // Restore smooth scrolling after a short delay
        setTimeout(() => {
          if (scrollContainer) {
            scrollContainer.style.scrollBehavior = 'smooth';
            isAdjustingScroll = false;
            // Re-add scroll listener
            scrollContainer.addEventListener('scroll', handleScroll);
          }
        }, 50);
      } else {
        isAdjustingScroll = false;
        // Re-add scroll listener
        scrollContainer.addEventListener('scroll', handleScroll);
      }
    });
  }

  // Load more dates when scrolled near the end (within 3 buttons)
  if (scrollLeft + clientWidth > scrollWidth - buttonWidth * 3) {
    loadMoreDates('future');
  }
}
</script>

<!-- Header and Date Picker -->
<div
  class="sticky top-0 py-2 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-800"
>
  <!-- Current Date Display -->
  <div class="px-4 flex justify-between flex-row-reverse items-center">
    <!-- Toggle button for date picker -->
    <Button
      variant="outline"
      onclick={() => (isExpanded = !isExpanded)}
      aria-label={isExpanded ? "Hide date picker" : "Show date picker"}
    >
      <Icon 
        name="chevron-down"
        class="text-gray-500 transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}"
      />
    </Button>

    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-100">
      {formatDate(appState.selectedDate)}
    </h2>
    <Button variant="outline" onclick={goToToday} class="px-2 py-1 text-xs">
      {#snippet children()}Today{/snippet}
    </Button>
  </div>

  <!-- Horizontal Date Picker -->
  <div class="relative px-4 transition-all duration-300 {isExpanded ? 'opacity-100 max-h-20 pt-2' : 'opacity-0 max-h-0 overflow-hidden'}">
    <div
      bind:this={scrollContainer}
      onscroll={handleScroll}
      class="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4
             [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
             overscroll-behavior-x-contain"
      style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scroll-behavior: smooth;"
    >
      {#each dateRange as date (date.toISOString())}
        <Button
          variant="ghost"
          onclick={() => selectDate(date)}
          class="flex-shrink-0 w-14 h-16 flex flex-col items-center justify-center rounded-lg transition-all duration-200 scroll-snap-align-center !p-1
            {isSameDate(date, appState.selectedDate)
            ? '!bg-blue-500 !text-white shadow-lg scale-105 dark:!bg-blue-600 dark:!text-white'
            : isToday(date)
              ? '!bg-blue-100 !text-blue-700 border-2 border-blue-300 dark:!bg-blue-900 dark:!text-blue-300 dark:!border-blue-700'
              : '!bg-gray-50 !text-gray-700 hover:!bg-gray-100 dark:!bg-gray-800 dark:!text-gray-300 hover:dark:!bg-gray-700'}"
        >
          {#snippet children()}
            <span class="text-xs font-medium uppercase">
              {formatDayOfWeek(date)}
            </span>
            <span class="text-base font-bold">
              {date.getDate()}
            </span>
            {#if date.getDate() === 1}
              <span class="text-xs text-gray-500">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </span>
            {/if}
          {/snippet}
        </Button>
      {/each}
    </div>
  </div>
</div>
