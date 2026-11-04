import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AetherMaterialPalette } from '../materials/aetherMaterials';

interface ComputationalWorldProps {
  materials: AetherMaterialPalette;
  reducedMotion: boolean;
  active: boolean;
}

/**
 * 3D Cognitive Computing & Intelligence World:
 * - 24-node spatial quantum neural network with pulsing synaptic connections
 * - Rotating logic hypercube (tesseract) with inner wireframe core
 * - Concentric floating computational orbital rings
 */
export const ComputationalWorld: React.FC<ComputationalWorldProps> = ({
  materials,
  reducedMotion,
  active,
}) => {
  const outerCubeRef = useRef<THREE.Group>(null);
  const innerCubeRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const networkGroupRef = useRef<THREE.Group>(null);

  // Generate 24 neural node coordinates & synaptic links
  const { nodes, connections } = useMemo(() => {
    const nodeCoords: THREE.Vector3[] = [];
    const count = 24;

    // Distribute nodes in a golden spiral sphere
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const r = 1.6 + (i % 3) * 0.35; // Slight radial variation

      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;
      nodeCoords.push(new THREE.Vector3(x, y * r, z));
    }

    // Connect nodes within a distance threshold
    const connPairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        if (nodeCoords[i].distanceTo(nodeCoords[j]) < 1.45) {
          connPairs.push([nodeCoords[i], nodeCoords[j]]);
        }
      }
    }

    return { nodes: nodeCoords, connections: connPairs };
  }, []);

  // Prepare line geometry for synapses
  const synapseGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    connections.forEach(([p1, p2]) => {
      points.push(p1, p2);
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [connections]);

  useFrame((_, delta) => {
    if (reducedMotion || !active) return;

    // 1. Asynchronous multi-axis rotation of hypercube
    if (outerCubeRef.current) {
      outerCubeRef.current.rotation.x += delta * 0.25;
      outerCubeRef.current.rotation.y += delta * 0.35;
    }
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.x -= delta * 0.45;
      innerCubeRef.current.rotation.z += delta * 0.3;
    }

    // 2. Data ring counter-rotation
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += delta * 0.15;
      ringGroupRef.current.rotation.y -= delta * 0.2;
    }

    // 3. Neural network slow breathing orbit
    if (networkGroupRef.current) {
      networkGroupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Central Rotating Logic Hypercube (Tesseract) */}
      <group ref={outerCubeRef}>
        {/* Outer translucent crystal hypercube shell */}
        <mesh material={materials.quantumCore} castShadow>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
        </mesh>
        {/* Outer cube golden edge beveled frame */}
        <mesh>
          <boxGeometry args={[1.38, 1.38, 1.38]} />
          <meshBasicMaterial color="#E8C372" wireframe transparent opacity={0.4} />
        </mesh>

        {/* Inner nested inverted hypercube */}
        <group ref={innerCubeRef}>
          <mesh>
            <boxGeometry args={[0.75, 0.75, 0.75]} />
            <meshBasicMaterial color="#00F0FF" wireframe />
          </mesh>
          {/* Central glowing qubit core */}
          <mesh material={materials.pulsarCore}>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* 2. Concentric Data Accelerator Rings */}
      <group ref={ringGroupRef}>
        <mesh material={materials.agedBrass}>
          <torusGeometry args={[1.9, 0.025, 12, 48]} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]} material={materials.burnishedGold}>
          <torusGeometry args={[2.1, 0.02, 12, 48]} />
        </mesh>
      </group>

      {/* 3. 24-Node Neural Lattice with Synaptic Connections */}
      <group ref={networkGroupRef}>
        {/* Synaptic interconnecting lines */}
        <lineSegments geometry={synapseGeometry}>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.45} />
        </lineSegments>

        {/* Neural Nodes */}
        {nodes.map((pos, idx) => (
          <group key={idx} position={[pos.x, pos.y, pos.z]}>
            {/* Inner glowing computation neuron */}
            <mesh material={idx % 2 === 0 ? materials.plasmaCyan : materials.vermilionRuby}>
              <sphereGeometry args={[0.075, 12, 12]} />
            </mesh>
            {/* Outer golden sensor collar */}
            <mesh material={materials.burnishedGold}>
              <torusGeometry args={[0.095, 0.012, 8, 16]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
