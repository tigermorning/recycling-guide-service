import * as THREE from 'three';
import { DataPacket, type PacketType } from './DataPacket.ts';

interface FlowRoute {
  from: string;
  to: string;
  path: THREE.Vector3[];
  type: PacketType;
}

const ROUTES: FlowRoute[] = [
  {
    from: 'dns',
    to: 'router',
    path: [
      new THREE.Vector3(-8, 0.5, 3),
      new THREE.Vector3(-4, 0.5, 1.5),
      new THREE.Vector3(0, 0.5, 0),
    ],
    type: 'request',
  },
  {
    from: 'router',
    to: 'firewall',
    path: [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(4, 0.5, 0),
      new THREE.Vector3(8, 0.5, 0),
    ],
    type: 'request',
  },
  {
    from: 'firewall',
    to: 'http',
    path: [
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(4, 0.5, 3),
      new THREE.Vector3(0, 0.5, 6),
    ],
    type: 'request',
  },
  {
    from: 'http',
    to: 'firewall',
    path: [
      new THREE.Vector3(0, 0.5, 6),
      new THREE.Vector3(4, 0.5, 3),
      new THREE.Vector3(8, 0.5, 0),
    ],
    type: 'response',
  },
  {
    from: 'firewall',
    to: 'router',
    path: [
      new THREE.Vector3(8, 0.5, 0),
      new THREE.Vector3(4, 0.5, 0),
      new THREE.Vector3(0, 0.5, 0),
    ],
    type: 'response',
  },
  {
    from: 'router',
    to: 'dns',
    path: [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-4, 0.5, 1.5),
      new THREE.Vector3(-8, 0.5, 3),
    ],
    type: 'response',
  },
];

export class DataFlow {
  private packets: DataPacket[] = [];
  private scene: THREE.Scene;
  private active = false;
  private spawnTimer = 0;
  private routeIndex = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  start(): void {
    this.active = true;
    this.spawnTimer = 0;
  }

  stop(): void {
    this.active = false;
    for (const p of this.packets) {
      this.scene.remove(p.mesh);
    }
    this.packets = [];
  }

  update(t: number): void {
    if (!this.active) return;

    this.spawnTimer += 0.016;
    if (this.spawnTimer >= 2.5) {
      this.spawnTimer = 0;
      this.spawnPacket();
    }

    for (const p of this.packets) {
      p.update(t);
    }
  }

  private spawnPacket(): void {
    const route = ROUTES[this.routeIndex % ROUTES.length];
    this.routeIndex++;

    const packet = new DataPacket(route.path, route.type);
    this.packets.push(packet);
    this.scene.add(packet.mesh);

    if (this.packets.length > 12) {
      const oldest = this.packets.shift();
      if (oldest) {
        this.scene.remove(oldest.mesh);
      }
    }
  }
}
