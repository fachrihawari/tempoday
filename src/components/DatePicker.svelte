<script lang="ts">
  import { selectedDate } from "../lib/stores";
  import {
    getDateRange,
    isToday,
    formatDayOfWeek,
    isSameDate,
    formatDate,
  } from "../lib/utils";
  import { onMount } from "svelte";
  import Settings from "./Settings.svelte";
  import Button from "./ui/Button.svelte";

  let scrollContainer: HTMLElement;
  let dateRange = $state(getDateRange(new Date(), 60)); // 60 days around today (120 days total)

  function selectDate(date: Date) {
    selectedDate.set(new Date(date));
  }

  function goToToday() {
    const today = new Date();
    selectedDate.set(today);

    // Scroll to today's date
    setTimeout(() => {
      scrollToDate(today);
    }, 100);
  }

  function scrollToDate(targetDate: Date) {
    if (!scrollContainer) return;

    const todayIndex = dateRange.findIndex((date) =>
      isSameDate(date, targetDate),
    );
    if (todayIndex >= 0) {
      const itemWidth = 80; // Approximate width of each date item
      const scrollPosition =
        todayIndex * itemWidth -
        scrollContainer.clientWidth / 2 +
        itemWidth / 2;
      scrollContainer.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }

  onMount(() => {
    // Scroll to today on initial load
    const today = new Date();
    setTimeout(() => {
      scrollToDate(today);
    }, 100);
  });

  function loadMoreDates(direction: "past" | "future") {
    const daysToAdd = 30;

    if (direction === "past") {
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
    if (!scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    // Load more dates when near the beginning
    if (scrollLeft < 200) {
      loadMoreDates("past");
    }

    // Load more dates when near the end
    if (scrollLeft + clientWidth > scrollWidth - 200) {
      loadMoreDates("future");
    }
  }
</script>

<!-- Header and Date Picker -->
<div class="sticky top-0 bg-white z-10 mt-4">
  <div class="flex items-center justify-between mb-4 px-4">
    <h1 class="text-2xl font-bold text-gray-900">TempoDay</h1>
    <div class="flex items-center gap-2">
      <Settings />
      <Button
        variant="primary"
        onclick={goToToday}
        class="px-3 py-1 text-sm"
      >
        {#snippet children()}Today{/snippet}
      </Button>
    </div>
  </div>

  <!-- Current Date Display -->
  <div class="mb-2 px-4">
    <h2 class="text-lg font-semibold text-gray-800">
      {formatDate($selectedDate)}
    </h2>
  </div>

  <!-- Horizontal Date Picker -->
  <div class="relative">
    <div
      bind:this={scrollContainer}
      onscroll={handleScroll}
      class="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style="scroll-snap-type: x mandatory;"
    >
      {#each dateRange as date (date.toISOString())}
        <button
          onclick={() => selectDate(date)}
          class="flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg transition-all duration-200 scroll-snap-align-center
            {isSameDate(date, $selectedDate)
            ? 'bg-blue-500 text-white shadow-lg scale-105'
            : isToday(date)
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}"
        >
          <span class="text-xs font-medium uppercase">
            {formatDayOfWeek(date)}
          </span>
          <span class="text-lg font-bold mt-1">
            {date.getDate()}
          </span>
          {#if date.getDate() === 1}
            <span class="text-xs text-gray-500 mt-1">
              {date.toLocaleDateString("en-US", { month: "short" })}
            </span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Scroll indicators -->
    <div
      class="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"
    ></div>
    <div
      class="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"
    ></div>
  </div>
</div>


