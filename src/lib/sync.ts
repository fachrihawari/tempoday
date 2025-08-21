import Peer from 'peerjs';
import { generatePeerId } from './unique';

class Sync {
  #peer: Peer | null = null;

  initialize() {
    console.info('Initializing peer connection');
    this.#peer = new Peer(generatePeerId());
  }

  get peer() {
    if (!this.#peer) {
      throw new Error('Peer connection not initialized');
    }
    return this.#peer;
  }

  close() {
    if (!this.#peer) {
      console.info('No peer connection to close');
      return;
    }
    console.log('Closing peer connection', this.peer);
    this.peer.removeAllListeners();
    this.peer.destroy();
    this.#peer = null;
  }
}

export const sync = new Sync();
