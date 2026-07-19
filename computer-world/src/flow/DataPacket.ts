import * as THREE from 'three';

export type PacketType = 'request' | 'response' | 'blocked';

const PACKET_COLORS: Record<PacketType, number> = {
  request: 0x4fc3f7,
  response: 0x69f0ae,
  blocked: 0xff5252,
};

export class DataPacket {
  readonly mesh: THREE.Mesh;
  private path: THREE.Vector3[];
  private progress = 0;
  private speed: number;
  private type: PacketType;
  private direction = 1;

  constructor(path: THREE.Vector3[], type: PacketType, speed = 0.3) {
    this.path = path;
    this.type = type;
    this.speed = speed;

    const geo = new THREE.SphereGeometry(0.15, 8, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: PACKET_COLORS[type],
      emissive: PACKET_COLORS[type],
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.userData = {
      isDataPacket: true,
      packetType: type,
    };

    if (path.length > 0) {
      this.mesh.position.copy(path[0]);
    }
  }

  update(t: number): void {
    if (this.path.length < 2) return;

    this.progress += this.speed * 0.016;
    if (this.progress >= 1) {
      this.progress = 0;
      this.direction *= -1;
    }

    const totalSegments = this.path.length - 1;
    const segment = this.progress * totalSegments;
    const idx = Math.min(Math.floor(segment), totalSegments - 1);
    const localT = segment - idx;

    const from = this.direction > 0 ? this.path[idx] : this.path[this.path.length - 1 - idx];
    const to = this.direction > 0
      ? this.path[Math.min(idx + 1, this.path.length - 1)]
      : this.path[Math.max(this.path.length - 2 - idx, 0)];

    this.mesh.position.lerpVectors(from, to, localT);
    this.mesh.position.y = 0.5 + Math.sin(t * 4 + this.progress * 10) * 0.1;
  }

  getType(): PacketType {
    return this.type;
  }
}
