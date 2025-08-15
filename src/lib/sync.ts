import Peer from 'peerjs';
import { generatePeerId } from './unique';

class Sync {
  #peer: Peer | null = null;

  async initialize() {
    console.log('Create new peer connection');
    this.#peer = new Peer(generatePeerId());
    console.log('Peer connection', this.#peer);
  }

  get peer() {
    if (!this.#peer) {
      throw new Error('Peer connection not initialized');
    }
    return this.#peer;
  }

  close() {
    console.log('Closing peer connection', this.peer);
    this.peer.destroy();
    this.#peer = null;
  }
}

export const sync = new Sync();
