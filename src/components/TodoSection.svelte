<script lang="ts">
import {
  type TodoItem,
  currentDayData,
  updateCurrentDayData,
} from '../lib/stores';
import { generateId } from '../lib/unique';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import EmptyState from './ui/EmptyState.svelte';
import Icon from './ui/Icon.svelte';
import Input from './ui/Input.svelte';

const todos = $derived($currentDayData.todos);

let showAddForm = $state(false);
let newTodoText = $state('');

function addTodo(text: string) {
  const newTodo: TodoItem = {
    id: generateId(),
    text,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  };

  updateCurrentDayData({
    todos: [...$currentDayData.todos, newTodo],
  });
}

function toggleTodo(todoId: string) {
  updateCurrentDayData({
    todos: $currentDayData.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    ),
  });
}

function deleteTodo(todoId: string) {
  updateCurrentDayData({
    todos: $currentDayData.todos.filter((todo) => todo.id !== todoId),
  });
}

function handleAddTodo(event?: Event) {
  if (event) {
    event.preventDefault();
  }
  const text = newTodoText.trim();
  if (text) {
    addTodo(text);
    resetForm();
  }
}

function resetForm() {
  newTodoText = '';
  showAddForm = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleAddTodo();
  } else if (event.key === 'Escape') {
    resetForm();
  }
}
</script>

<Card title="To-Do List" icon="clipboard" iconColor="text-blue-500">
  {#snippet headerAction()}
    {#if todos.length > 0}
      <span class="text-sm text-gray-500">
        {todos.filter((t) => t.completed).length}/{todos.length}
      </span>
    {/if}
  {/snippet}
  
  {#snippet children()}
    <!-- Todo List -->
    <div class="space-y-2 {todos.length > 0 ? 'mb-4' : ''}">
      {#each todos as todo (todo.id)}
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
          <button
            onclick={() => toggleTodo(todo.id)}
            class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              {todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'}"
          >
            {#if todo.completed}
              <Icon name="check" size="sm" class="w-3 h-3" />
            {/if}
          </button>

          <span class="flex-1 text-sm {todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}">
            {todo.text}
          </span>

          <Button 
            variant="ghost" 
            size="sm"
            onclick={() => deleteTodo(todo.id)}
            class="opacity-0 group-hover:opacity-100 !p-1 text-red-500 hover:bg-red-50"
          >
            {#snippet children()}
              <Icon name="trash" size="sm" />
            {/snippet}
          </Button>
        </div>
      {/each}

      {#if todos.length === 0}
        <EmptyState
          icon="clipboard"
          title="No tasks for this day"
          subtitle="Tap to add your first task"
          onclick={() => (showAddForm = true)}
        />
      {/if}
    </div>

    <!-- Add Todo Form -->
    <BottomSheet bind:open={showAddForm} title="Add New Task">
      {#snippet children()}
        <form onsubmit={handleAddTodo} class="space-y-6">
          <Input 
            bind:value={newTodoText}
            placeholder="What needs to be done?"
            label="Task Description"
            theme="todos"
            required
          />
          <div class="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="ghost"
              onclick={resetForm}
              class="flex-none w-1/4"
            >
              {#snippet children()}
                Cancel
              {/snippet}
            </Button>
            <Button 
              type="submit"
              variant="todos"
              class="flex-1"
            >
              {#snippet children()}
                <Icon name="plus" size="sm" class="mr-2" />
                Add Task
              {/snippet}
            </Button>
          </div>
        </form>
      {/snippet}
    </BottomSheet>

    {#if !showAddForm && todos.length > 0}
      <Button 
        variant="todos"
        dashed={true}
        onclick={() => (showAddForm = true)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="plus" size="sm" class="mr-2" />
          Add Task
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>
