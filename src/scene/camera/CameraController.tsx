import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  scrollProgress: number;
  mousePositionRef?: React.RefObject<{ x: number; y: number }>;
  manualRotationRef?: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}

/**
 * Spline-based 5-Chapter Camera Choreography:
 * - Opening: Monumental front view of The Aether Engine [0, 0.3, 7.4]
 * - Chapter 01 (Enter the Engine): Macro dive into interlocking gears and celestial core [0.5, 0.1, 3.4]
 * - Chapter 02 (World of Engineering): Balanced stage vantage for 3D engineering worlds [0, 0.4, 6.2]
 * - Chapter 03 (Techfest Experience): High amphitheater perspective over festival arena [0, 3.2, 7.6]
 * - Final Chapter (Enter Techfest): Heroic pullback framing the radiant celestial portal [0, 0.8, 8.2]
 */
// Pre-allocated scratch vectors to eliminate per-frame nursery GC pressure
const _startPos = new THREE.Vector3();
const _endPos = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

export const CameraController: React.FC<CameraControllerProps> = ({
  scrollProgress,
  mousePositionRef,
  manualRotationRef,
  reducedMotion,
}) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const mouseX = mousePositionRef?.current?.x ?? 0;
    const mouseY = mousePositionRef?.current?.y ?? 0;
    const manualX = manualRotationRef?.current?.x ?? 0;
    const manualY = manualRotationRef?.current?.y ?? 0;

    // 5-waypoint camera path interpolation based on scrollProgress (0.0 to 1.0)
    if (scrollProgress < 0.2) {
      // Opening — The Aether Engine
      const t = scrollProgress / 0.2;
      _camPos.set(0, 0.2 + t * 0.2, 7.4 - t * 0.6);
      _lookTarget.set(0, 0, 0);
    } else if (scrollProgress < 0.4) {
      // Chapter 01 — Enter the Engine (Dive into gear train & celestial core)
      const t = (scrollProgress - 0.2) / 0.2;
      _startPos.set(0, 0.4, 6.8);
      _endPos.set(0.6, 0.15, 3.3);
      _camPos.lerpVectors(_startPos, _endPos, t);
      _lookTarget.set(0.2 * t, 0, 0);
    } else if (scrollProgress < 0.65) {
      // Chapter 02 — The World of Engineering
      const t = (scrollProgress - 0.4) / 0.25;
      _startPos.set(0.6, 0.15, 3.3);
      _endPos.set(0, 0.5, 6.2);
      _camPos.lerpVectors(_startPos, _endPos, t);
      _lookTarget.set(0, 0, 0);
    } else if (scrollProgress < 0.88) {
      // Chapter 03 — The Techfest Experience (Elevated amphitheater vantage)
      const t = (scrollProgress - 0.65) / 0.23;
      _startPos.set(0, 0.5, 6.2);
      _endPos.set(0, 3.2, 7.6);
      _camPos.lerpVectors(_startPos, _endPos, t);
      _lookTarget.set(0, -0.4 * t, 0);
    } else {
      // Final Chapter — Enter Techfest (Grand Pullback)
      const t = (scrollProgress - 0.88) / 0.12;
      _startPos.set(0, 3.2, 7.6);
      _endPos.set(0, 0.6, 8.2);
      _camPos.lerpVectors(_startPos, _endPos, t);
      _lookTarget.set(0, 0, 0);
    }

    // Apply subtle mouse parallax and manual drag offset
    const parallaxX = reducedMotion ? 0 : mouseX * 0.4 + manualY * 0.6;
    const parallaxY = reducedMotion ? 0 : mouseY * 0.3 - manualX * 0.5;

    const desiredCamX = _camPos.x + parallaxX;
    const desiredCamY = _camPos.y + parallaxY;
    const desiredCamZ = _camPos.z;

    // Smooth lerp camera position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredCamX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredCamY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredCamZ, 0.08);

    // Smooth lerp lookAt target
    targetLookAt.current.lerp(_lookTarget, 0.08);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
