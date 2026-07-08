import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

export function Player() {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Refs for animation
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const euler = React.useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMoveForward(true);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMoveLeft(true);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMoveBackward(true);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMoveRight(true);
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMoveForward(false);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMoveLeft(false);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMoveBackward(false);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMoveRight(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    // Basic movement physics without rapier
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(moveForward) - Number(moveBackward);
    direction.current.x = Number(moveLeft) - Number(moveRight);
    direction.current.normalize();

    if (moveForward || moveBackward) velocity.current.z -= direction.current.z * 40.0 * delta;
    if (moveLeft || moveRight) velocity.current.x -= direction.current.x * 40.0 * delta;

    // Apply movement to camera using PointerLock's local axes
    const controlObject = camera;
    controlObject.translateX(velocity.current.x * delta);
    controlObject.translateZ(velocity.current.z * delta);

    // Collision with walls (simple bounding box: x between -5.5 and 5.5, z between -5.5 and 5.5)
    if (controlObject.position.x < -5.5) controlObject.position.x = -5.5;
    if (controlObject.position.x > 5.5) controlObject.position.x = 5.5;
    if (controlObject.position.z < -5.5) controlObject.position.z = -5.5;
    if (controlObject.position.z > 5.5) controlObject.position.z = 5.5;
    
    // Head bobbing calculation
    const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);
    const isMoving = speed > 0.5;
    
    // Base eye height
    let targetY = 1.8; 
    let bobbingOffset = 0;
    
    if (isMoving) {
      bobbingOffset = Math.sin(state.clock.elapsedTime * 12) * 0.06; // Bobbing effect
      targetY += bobbingOffset;
    }

    // Smoothly interpolate camera Y
    controlObject.position.y = THREE.MathUtils.lerp(controlObject.position.y, targetY, 15 * delta);

    // Update body mesh position and rotation to follow camera
    if (bodyRef.current) {
      // Body stays fixed relative to the base height
      bodyRef.current.position.set(controlObject.position.x, 1.8 - 0.65, controlObject.position.z);

      // Extract yaw (Y rotation) from camera
      euler.setFromQuaternion(camera.quaternion);
      bodyRef.current.rotation.y = euler.y;

      // Move the body slightly backwards so the camera sits further in front of the chest
      bodyRef.current.translateZ(0.25);

      // Animate limbs
      const swing = isMoving ? Math.sin(state.clock.elapsedTime * 12) * 0.6 : 0;
      
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, swing, 10 * delta);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -swing, 10 * delta);
      }
      
      if (leftArmRef.current && rightArmRef.current) {
        const armRestAngle = -Math.PI / 8;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, armRestAngle - swing * 0.5, 10 * delta);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, armRestAngle + swing * 0.5, 10 * delta);
      }
    }
  });

  return (
    <>
      <PointerLockControls />
      {/* Player Model */}
      <group ref={bodyRef}>
        {/* Head (casts shadow but is invisible to the camera inside it) */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ffedd5" /> {/* Skin color */}
        </mesh>

        {/* Torso */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
          <meshStandardMaterial color="#4f46e5" /> {/* Indigo shirt */}
        </mesh>
        
        {/* Left Arm (Pivots at shoulder) */}
        <group ref={leftArmRef} position={[-0.35, 0.45, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>
        </group>
        
        {/* Right Arm (Pivots at shoulder) */}
        <group ref={rightArmRef} position={[0.35, 0.45, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>
        </group>

        {/* Left Leg (Pivots at hip) */}
        <group ref={leftLegRef} position={[-0.12, -0.6, 0]}>
          <mesh position={[0, -0.45, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.09, 0.9, 16]} />
            <meshStandardMaterial color="#0f172a" /> {/* Dark pants */}
          </mesh>
        </group>
        
        {/* Right Leg (Pivots at hip) */}
        <group ref={rightLegRef} position={[0.12, -0.6, 0]}>
          <mesh position={[0, -0.45, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.09, 0.9, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>
    </>
  );
}
