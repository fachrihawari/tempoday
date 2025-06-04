<script lang="ts">
  import { currentDayData, updateCurrentDayData, type TodoItem } from "../lib/stores";
  import { generateId } from "../lib/utils";

  let todos = $derived($currentDayData.todos);

  let showAddForm = $state(false);
  let newTodoText = $state("");

  function addTodo(text: string) {
    const newTodo: TodoItem = {
      id: generateId(),
      text,
      completed: false,
      date: new Date().toISOString().split('T')[0] // Will be overridden by the store logic
    };
    
    updateCurrentDayData({
      todos: [...$currentDayData.todos, newTodo]
    });
  }

  function toggleTodo(todoId: string) {
    updateCurrentDayData({
      todos: $currentDayData.todos.map(todo => 
        todo.id === todoId 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    });
  }

  function deleteTodo(todoId: string) {
    updateCurrentDayData({
      todos: $currentDayData.todos.filter(todo => todo.id !== todoId)
    });
  }

  function handleAddTodo() {
    const text = newTodoText.trim();
    if (text) {
      addTodo(text);
      newTodoText = "";
      showAddForm = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleAddTodo();
    } else if (event.key === "Escape") {
      showAddForm = false;
      newTodoText = "";
    }
  }
</script>

<section class="bg-white rounded-lg border border-gray-200 p-4">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <svg
        class="w-5 h-5 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        ></path>
      </svg>
      To-Do List
    </h2>
    <span class="text-sm text-gray-500">
      {todos.filter((t) => t.completed).length}/{todos.length}
    </span>
  </div>

  <!-- Todo List -->
  <div class="space-y-2 mb-4">
    {#each todos as todo (todo.id)}
      <div
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
      >
        <button
          onclick={() => toggleTodo(todo.id)}
          class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
            {todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'}"
        >
          {#if todo.completed}
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          {/if}
        </button>

        <span
          class="flex-1 text-sm {todo.completed
            ? 'line-through text-gray-500'
            : 'text-gray-900'}"
        >
          {todo.text}
        </span>

        <button
          onclick={() => deleteTodo(todo.id)}
          class="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
          aria-label="Delete task"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    {/each}

    {#if todos.length === 0}
      <p class="text-gray-500 text-sm text-center py-4">
        No tasks for this day
      </p>
    {/if}
  </div>

  <!-- Add Todo Form -->
  {#if showAddForm}
    <div class="flex gap-2">
      <input
        bind:value={newTodoText}
        onkeydown={handleKeydown}
        placeholder="Enter task description..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <button
        onclick={handleAddTodo}
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Add
      </button>
      <button
        onclick={() => {
          showAddForm = false;
          newTodoText = "";
        }}
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
      >
        Cancel
      </button>
    </div>
  {:else}
    <button
      onclick={() => (showAddForm = true)}
      class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
    >
      + Add Task
    </button>
  {/if}
</section>
