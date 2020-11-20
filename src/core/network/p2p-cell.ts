import { compareBigInts, distance } from '../../processors/hash';
import { AgentPubKey, CellId, Dictionary, Hash } from '../../types/common';
import { DHTOp } from '../../types/dht-op';
import { Network, NetworkMessage } from '../network';

export type P2pCellState = {
  peers: string[];
  redundancyFactor: number;
};

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/types/actor.rs
export class P2pCell {
  peers: string[];
  redundancyFactor: number;

  constructor(
    state: P2pCellState,
    protected cellId: CellId,
    protected network: Network
  ) {
    this.peers = state.peers;
  }

  getState(): P2pCellState {
    return {
      peers: this.peers,
      redundancyFactor: this.redundancyFactor,
    };
  }

  async join(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async leave(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async publish(dht_hash: Hash, ops: Dictionary<DHTOp>): Promise<void> {
    const neighbors = this._getClosestNeighbors(
      dht_hash,
      this.redundancyFactor
    );

    const promises = neighbors.map((neighbor) =>
      this._sendMessage(neighbor, (cell) =>
        cell.handle_publish(this.cellId[0], dht_hash, ops)
      )
    );

    await Promise.all(promises);
  }

  async get(
    dna_hash: Hash,
    from_agent: AgentPubKey,
    dht_hash: Hash,
    _options: any // TODO: complete?
  ): Promise<Element | undefined> {
    return undefined;
  }

  public getNeighbors(): Array<AgentPubKey> {
    return this.peers;
  }

  private _getClosestNeighbors(
    basisHash: Hash,
    neighborCount: number
  ): Array<AgentPubKey> {
    const sortedPeers = this.peers.sort(
      (agentA: string, agentB: string) => {
        const distanceA = distance(basisHash, agentA);
        const distanceB = distance(basisHash, agentB);
        return compareBigInts(distanceA, distanceB);
      }
    );

    return sortedPeers.slice(0, neighborCount);
  }

  private _sendMessage<T>(
    toAgent: AgentPubKey,
    message: NetworkMessage<T>
  ): Promise<T> {
    const agentId = this.peers.find((agent) => agent === toAgent);

    if (!agentId) {
      debugger
      throw new Error('Agent was not found');
    }

    return this.network.sendMessage(
      this.cellId[1],
      this.cellId[0],
      agentId,
      message
    );
  }
}