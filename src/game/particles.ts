import * as THREE from 'three';
import { createGlowParticleTexture } from './textures';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  public scene: THREE.Scene;
  private particles: Particle[] = [];
  private maxParticles: number = 300;
  
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private pointsMesh: THREE.Points;

  private positionsArray: Float32Array;
  private colorsArray: Float32Array;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.positionsArray = new Float32Array(this.maxParticles * 3);
    this.colorsArray = new Float32Array(this.maxParticles * 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positionsArray, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colorsArray, 3));

    const tex = createGlowParticleTexture();
    this.material = new THREE.PointsMaterial({
      size: 0.6,
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    this.pointsMesh = new THREE.Points(this.geometry, this.material);
    this.pointsMesh.frustumCulled = false;
    this.scene.add(this.pointsMesh);
  }

  public emitModakCollect(pos: THREE.Vector3) {
    const count = 16;
    const goldColor = new THREE.Color(0xffd700);
    const orangeColor = new THREE.Color(0xff6b00);

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2.0 + Math.random() * 3.5;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 1.5,
        Math.sin(phi) * Math.sin(theta) * speed
      );

      this.particles.push({
        position: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)),
        velocity: vel,
        color: (Math.random() > 0.4) ? goldColor.clone() : orangeColor.clone(),
        size: 0.5 + Math.random() * 0.4,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35,
      });
    }
  }

  public emitPowerUpBurst(pos: THREE.Vector3, colorHex: number) {
    const count = 28;
    const col = new THREE.Color(colorHex);

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const speed = 3.0 + Math.random() * 5.0;

      const vel = new THREE.Vector3(
        Math.cos(theta) * speed,
        (Math.random() - 0.2) * speed,
        Math.sin(theta) * speed
      );

      this.particles.push({
        position: pos.clone(),
        velocity: vel,
        color: col.clone(),
        size: 0.8 + Math.random() * 0.5,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }
  }

  public emitRunSparks(pos: THREE.Vector3) {
    if (this.particles.length >= this.maxParticles) return;
    
    this.particles.push({
      position: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.05, 0.2)),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.5 + Math.random() * 1.0, 1.5 + Math.random() * 2.0),
      color: new THREE.Color(0xffaa00),
      size: 0.35,
      life: 0,
      maxLife: 0.25,
    });
  }

  public emitRunTrail(pos: THREE.Vector3) {
    if (this.particles.length >= this.maxParticles) return;

    // Subtle golden festive dust trail behind runner's feet
    this.particles.push({
      position: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.25, 0.04, 0.3 + Math.random() * 0.2)),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.2 + Math.random() * 0.4, 0.8 + Math.random() * 1.2),
      color: (Math.random() > 0.35) ? new THREE.Color(0xffd700) : new THREE.Color(0xff9900),
      size: 0.25 + Math.random() * 0.15,
      life: 0,
      maxLife: 0.38,
    });
  }

  public emitIdolPieceCollect(pos: THREE.Vector3, colorHex: number = 0xffd700) {
    const count = 38;
    const baseCol = new THREE.Color(colorHex);
    const goldCol = new THREE.Color(0xfff2a3);

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 3.5 + Math.random() * 4.5;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 2.0,
        Math.sin(phi) * Math.sin(theta) * speed
      );

      this.particles.push({
        position: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3)),
        velocity: vel,
        color: (Math.random() > 0.4) ? baseCol.clone() : goldCol.clone(),
        size: 0.7 + Math.random() * 0.6,
        life: 0,
        maxLife: 0.75 + Math.random() * 0.45,
      });
    }
  }

  public emitCelebrationFireworkShower(pos: THREE.Vector3) {
    const count = 48;
    const festiveColors = [0xffd700, 0xff6b00, 0xff4d8d, 0x00f5d4, 0xff0054, 0xffb703];

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const colHex = festiveColors[Math.floor(Math.random() * festiveColors.length)];
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 4.0 + Math.random() * 6.0;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 3.0,
        Math.sin(phi) * Math.sin(theta) * speed
      );

      this.particles.push({
        position: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8)),
        velocity: vel,
        color: new THREE.Color(colHex),
        size: 0.8 + Math.random() * 0.6,
        life: 0,
        maxLife: 1.0 + Math.random() * 0.6,
      });
    }
  }

  public emitFlowerPetalBreeze(pos: THREE.Vector3) {

    if (this.particles.length >= this.maxParticles - 10) return;

    // Floating festive flower petals gently blowing through the air
    const colors = [0xff6b00, 0xffb703, 0xd62246, 0xff758f];
    const colHex = colors[Math.floor(Math.random() * colors.length)];

    this.particles.push({
      position: new THREE.Vector3(
        pos.x + (Math.random() - 0.5) * 12,
        2.5 + Math.random() * 3.5,
        pos.z - 8 - Math.random() * 15
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        -0.4 - Math.random() * 0.4,
        2.5 + Math.random() * 2.0
      ),
      color: new THREE.Color(colHex),
      size: 0.32 + Math.random() * 0.2,
      life: 0,
      maxLife: 1.8 + Math.random() * 1.0,
    });
  }

  public update(delta: number) {
    let pIdx = 0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      p.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 9.8 * delta; // Gravity

      const progress = p.life / p.maxLife;
      const alpha = 1.0 - progress;

      // Update buffer
      const baseIdx = pIdx * 3;
      this.positionsArray[baseIdx] = p.position.x;
      this.positionsArray[baseIdx + 1] = p.position.y;
      this.positionsArray[baseIdx + 2] = p.position.z;

      this.colorsArray[baseIdx] = p.color.r * alpha;
      this.colorsArray[baseIdx + 1] = p.color.g * alpha;
      this.colorsArray[baseIdx + 2] = p.color.b * alpha;

      pIdx++;
    }

    // Clear unused slots
    for (let i = pIdx; i < this.maxParticles; i++) {
      const baseIdx = i * 3;
      this.positionsArray[baseIdx] = 0;
      this.positionsArray[baseIdx + 1] = -9999;
      this.positionsArray[baseIdx + 2] = 0;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  public clear() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const baseIdx = i * 3;
      this.positionsArray[baseIdx + 1] = -9999;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }
}
