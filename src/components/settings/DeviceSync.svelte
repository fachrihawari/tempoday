<script lang="ts">
import type { DataConnection } from 'peerjs';
import { onDestroy } from 'svelte';
import { backupManager } from '../../lib/backup';
import { sync } from '../../lib/sync';
import { toastStore } from '../../stores/toast.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';
import Input from '../ui/Input.svelte';

let peerId = $state('');
let connectedDevice = $state('');
let connectionStep = $state('idle'); // 'idle', 'start-sharing', 'sharing', 'connecting-input', 'connecting', 'connected'
let connectToPeerInput = $state('');
let hostConn: DataConnection | null = $state(null);
let clientConn: DataConnection | null = $state(null);

// Derived state to determine if we should pull data from the connected peer
const shouldPull = $derived(!!connectToPeerInput);

async function copyPeerId() {
  try {
    await navigator.clipboard.writeText(peerId);
    toastStore.success('Peer ID copied to clipboard');
  } catch (error) {
    console.error('Failed to copy:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = peerId;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    toastStore.success('Peer ID copied to clipboard');
  }
}

function disconnect() {
  connectionStep = 'idle';
  connectToPeerInput = '';

  // Clean up host connection
  if (hostConn) {
    hostConn.removeAllListeners();
    hostConn.close();
    hostConn = null;
  }

  // Clean up client connection
  if (clientConn) {
    clientConn.removeAllListeners();
    clientConn.close();
    clientConn = null;
  }

  // Clean up peer listeners
  sync.close();
}

async function shareDevice() {
  connectionStep = 'start-sharing';

  sync.initialize();

  sync.peer.on('open', (id) => {
    console.log('[Host] Peer connection opened with ID:', id);
    peerId = id;
    connectionStep = 'sharing';
  });

  sync.peer.on('connection', (newConn) => {
    hostConn = newConn;

    newConn.on('open', () => {
      console.log('[Host] New client connected:', newConn.peer);
      connectionStep = 'connected';
      connectedDevice = newConn.peer;
    });

    // Listen for data from the connected peer
    newConn.on('data', async (data) => {
      console.log('[Host] Received request from client:', data);
      const request = JSON.parse(data as string);
      switch (request.type) {
        case 'sync_request':
          const backupData = await backupManager.exportAllData();
          newConn.send(buildMessage('sync_response', backupData));
          break;
        default:
          console.warn('[Host] Unknown request type:', request.type);
      }
    });

    newConn.on('error', (err) => {
      console.error('[Host] Connection error:', err);
      disconnect();
    });

    newConn.on('close', () => {
      console.warn('[Host] Connection closed:', newConn.peer);
      disconnect();
    });
  });
}

function buildMessage(type: string, data?: object) {
  return JSON.stringify({ type, data });
}

function connectToPeer() {
  if (!connectToPeerInput.trim()) return;

  connectionStep = 'connecting';
  connectedDevice = connectToPeerInput;

  sync.initialize();

  // We have to wait for the connection to be established
  // before we can connect to the peer
  sync.peer.on('open', (id) => {
    console.log('[Client] Peer connection opened with ID:', id);
    clientConn = sync.peer.connect(connectToPeerInput);

    clientConn.on('open', () => {
      console.log('[Client] Connected to host:', connectToPeerInput);
      connectionStep = 'connected';
      clientConn?.send?.(
        buildMessage('message', { message: 'Hello from client!' }),
      );
    });

    // Listen for data from the connected peer
    clientConn.on('data', async (data) => {
      console.log('[Client] Received data from host:', data);
      const response = JSON.parse(data as string);
      switch (response.type) {
        case 'sync_response':
          // Handle sync response
          const backupData = response.data;
          await backupManager.restoreFromBackup(backupData);
          toastStore.success('Sync successful');
          break;
        default:
          console.warn('[Client] Unknown response type:', response.type);
      }
    });

    clientConn.on('error', (err) => {
      console.error('[Client] Connection error:', err);
      disconnect();
    });

    clientConn.on('close', () => {
      console.warn('[Client] Connection to host closed:', clientConn?.peer);
      disconnect();
    });
  });
}

function syncNow() {
  console.log('[Client] Requesting sync from host...', { clientConn });
  clientConn?.send(buildMessage('sync_request'));
}

// Cleanup when component is destroyed
onDestroy(() => {
  disconnect();
});
</script>

{#snippet loading(title: string, description: string)}
  <!-- Connecting State -->
  <div class="text-center space-y-4">
    <div
      class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mx-auto flex items-center justify-center"
    >
      <Icon
        name="loader"
        class="text-indigo-600 dark:text-indigo-400 animate-spin"
        size="xl"
      />
    </div>
    <div>
      <h4 class="font-medium text-gray-900 dark:text-gray-100">{title}</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  </div>
{/snippet}

<!-- Device Sync Component -->
<div class="space-y-6">
  {#if connectionStep === "idle"}
    <!-- Quick Actions -->
    <div class="flex flex-col gap-3">
      <Button
        variant="primary"
        fullWidth
        onclick={shareDevice}
        class="!p-4 !text-left !justify-start"
      >
        <div class="flex items-center gap-4 w-full">
          <div
            class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center"
          >
            <Icon
              name="share"
              class="text-blue-600 dark:text-blue-400"
              size="lg"
            />
          </div>
          <div class="flex-1">
            <div class="font-medium text-white">Share Device</div>
            <div class="text-sm text-blue-100 dark:text-blue-200">
              Allow others to connect and sync data
            </div>
          </div>
        </div>
      </Button>
      <Button
        variant="outline"
        fullWidth
        onclick={() => (connectionStep = "connecting-input")}
        class="!p-4 !text-left !justify-start"
      >
        <div class="flex items-center gap-4 w-full">
          <div
            class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center"
          >
            <Icon
              name="trending-up"
              class="text-green-600 dark:text-green-400"
              size="lg"
            />
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-900 dark:text-gray-100">
              Sync from another device
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Import the data from the other device
            </div>
          </div>
        </div>
      </Button>
    </div>
  {:else if connectionStep === "sharing"}
    <!-- Sharing State -->
    <div class="text-center space-y-4">
      <div
        class="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl mx-auto flex items-center justify-center"
      >
        <Icon name="share" class="text-blue-600 dark:text-blue-400" size="xl" />
      </div>
      <div>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">
          Waiting for connection
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Others can connect using this ID
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800 rounded-lg h-12 flex flex-row items-center relative"
      >
        <p class="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1">
          {peerId}
        </p>
        <Button
          variant="outline"
          onclick={copyPeerId}
          title="Copy device ID"
          class="absolute right-2 top-2 h-8 w-8 !p-0"
        >
          <Icon name="copy" size="sm" />
        </Button>
      </div>
      <Button variant="danger" fullWidth onclick={disconnect}
        >Stop Sharing</Button
      >
    </div>
  {:else if connectionStep === "connecting-input"}
    <!-- Connect Input State -->
    <div class="space-y-4">
      <div class="text-center">
        <div
          class="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-2xl mx-auto flex items-center justify-center mb-3"
        >
          <Icon
            name="trending-up"
            class="text-green-600 dark:text-green-400"
            size="xl"
          />
        </div>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">
          Connect to Device
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Enter the device ID to connect
        </p>
      </div>

      <div class="space-y-3">
        <Input
          bind:value={connectToPeerInput}
          placeholder="TD-XXXXXX"
          class="font-mono text-center w-full"
        />
        <div class="flex gap-2">
          <Button
            variant="outline"
            onclick={() => (connectionStep = "idle")}
            class="flex-none w-1/4">Cancel</Button
          >
          <Button
            variant="primary"
            onclick={connectToPeer}
            disabled={!connectToPeerInput.trim()}
            class="flex-1"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  {:else if connectionStep === "connecting"}
    {@render loading("Connecting", "Connecting to " + connectedDevice)}
  {:else if connectionStep === "start-sharing"}
    {@render loading("Starting", "Preparing to share with other devices")}
  {:else if connectionStep === "connected"}
    <!-- Connected State -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-green-700 dark:text-green-300">
            Connected to {connectedDevice}
          </span>
        </div>
      </div>

      <div class="flex gap-3">
        {#if shouldPull}
          <Button variant="primary" class="flex-1" onclick={syncNow}>
            <Icon name="check" class="mr-2" />
            Sync Now
          </Button>
        {/if}
        <Button
          variant="outline"
          onclick={disconnect}
          class="!px-3 {!shouldPull ? 'flex-1' : ''}"
        >
          {@const text = shouldPull ? "Disconnect" : "Stop Sharing"}
          {text}
        </Button>
      </div>
    </div>
  {/if}
</div>
