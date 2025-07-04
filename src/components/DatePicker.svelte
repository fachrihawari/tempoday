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

let scrollContainer: HTMLElement;
let dateRange = $state<Date[]>([]);

// Initialize date range around the selected date
function initializeDateRange(centerDate: Date) {
  dateRange = getDateRange(centerDate, 60); // 60 days around center date (120 days total)
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
      // Use scrollIntoView for more reliable centering
      targetButton.scrollIntoView({
        behavior: immediate ? 'auto' : 'smooth',
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

  // Use multiple strategies to ensure proper initial positioning
  const attemptScroll = (immediate = true) => {
    if (scrollContainer && scrollContainer.querySelector('button')) {
      scrollToDate(currentDate, immediate);
      return true;
    }
    return false;
  };

  // First attempt - immediate after DOM is likely ready
  setTimeout(() => {
    if (!attemptScroll()) {
      // Second attempt - after more time for complex layouts
      setTimeout(() => {
        if (!attemptScroll()) {
          // Final attempt - with even more time
          setTimeout(() => attemptScroll(), 200);
        }
      }, 100);
    }
  }, 50);
});

// Reactive effect to handle external selectedDate changes
$effect(() => {
  const currentSelectedDate = appState.selectedDate;

  if (currentSelectedDate && dateRange.length > 0 && scrollContainer) {
    // Check if selected date is in current range
    const isInRange = dateRange.some((date) =>
      isSameDate(date, currentSelectedDate),
    );

    if (!isInRange) {
      // If selected date is not in range, regenerate range around it
      initializeDateRange(currentSelectedDate);

      // Wait for range to update, then scroll
      setTimeout(() => {
        scrollToDate(currentSelectedDate);
      }, 50);
    } else {
      // If it's in range, just scroll to it
      setTimeout(() => {
        scrollToDate(currentSelectedDate);
      }, 10);
    }
  }
});

// Watch for container size changes (useful for responsive design)
$effect(() => {
  if (scrollContainer && appState.selectedDate) {
    // Re-center the selected date when container size might have changed
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => scrollToDate(appState.selectedDate, true), 10);
    });

    resizeObserver.observe(scrollContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }
});

function loadMoreDates(direction: 'past' | 'future') {
  const daysToAdd = 30;

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
}

function handleScroll() {
  if (!scrollContainer || dateRange.length === 0) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

  // Dynamic threshold based on container size
  const loadThreshold = Math.max(50, Math.min(100, clientWidth * 0.2)); // 20% of container width, between 50-100px

  // Load more dates when near the beginning
  if (scrollLeft < loadThreshold) {
    const oldScrollWidth = scrollWidth;
    const oldScrollLeft = scrollLeft;

    loadMoreDates('past');

    // Maintain scroll position after prepending dates
    setTimeout(() => {
      const newScrollWidth = scrollContainer.scrollWidth;
      const addedWidth = newScrollWidth - oldScrollWidth;
      scrollContainer.scrollLeft = oldScrollLeft + addedWidth;
    }, 10);
  }

  // Load more dates when near the end
  if (scrollLeft + clientWidth > scrollWidth - loadThreshold) {
    loadMoreDates('future');
  }
}
</script>

<!-- Header and Date Picker -->
<div class="sticky top-0 py-4 bg-white dark:bg-gray-900 z-10 shadow-sm dark:shadow-gray-800/50">
  <!-- Current Date Display -->
  <div class="px-4 flex justify-between items-center">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
      {formatDate(appState.selectedDate)}
    </h2>

    <Button variant="primary" onclick={goToToday} class="px-3 py-1 text-sm">
      {#snippet children()}Today{/snippet}
    </Button>
  </div>

  <!-- Horizontal Date Picker -->
  <div class="relative px-4 pt-4">
    <div
      bind:this={scrollContainer}
      onscroll={handleScroll}
      class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4
             [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
             overscroll-behavior-x-contain scroll-smooth"
      style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
    >
      {#each dateRange as date (date.toISOString())}
        <Button
          variant="ghost"
          onclick={() => selectDate(date)}
          class="flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg transition-all duration-200 scroll-snap-align-center !p-2
            {isSameDate(date, appState.selectedDate)
            ? '!bg-blue-500 dark:!bg-blue-600 !text-white shadow-lg scale-105'
            : isToday(date)
              ? '!bg-blue-100 dark:!bg-blue-900 !text-blue-700 dark:!text-blue-300 border-2 border-blue-300 dark:border-blue-700'
              : '!bg-gray-50 dark:!bg-gray-800 !text-gray-700 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-700'}"
        >
          {#snippet children()}
            <span class="text-xs font-medium uppercase">
              {formatDayOfWeek(date)}
            </span>
            <span class="text-lg font-bold mt-1">
              {date.getDate()}
            </span>
            {#if date.getDate() === 1}
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </span>
            {/if}
          {/snippet}
        </Button>
      {/each}
    </div>
  </div>
</div>