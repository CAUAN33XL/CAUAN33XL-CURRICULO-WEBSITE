import React from 'react';
import { Html, Text, useTexture } from '@react-three/drei';

export function Bed({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.6, 4.5]} />
        <meshStandardMaterial color="#3E2723" /> {/* Dark Wood */}
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.4, 4.3]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      {/* Blanket */}
      <mesh position={[0, 0.71, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[2.85, 0.42, 3.0]} />
        <meshStandardMaterial color="#1E88E5" /> {/* Blue Blanket */}
      </mesh>
      {/* Pillows */}
      <mesh position={[-0.7, 0.95, -1.6]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.2, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.7, 0.95, -1.6]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.2, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

export function Bookshelf({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Back */}
      <mesh position={[0, 2, -0.4]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Sides */}
      <mesh position={[-0.95, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 4, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0.95, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 4, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Shelves */}
      {[0.1, 1.2, 2.3, 3.4, 4.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      ))}
      {/* VHS Tapes (standing vertically) */}
      {[1.2, 2.3, 3.4].map((shelfY, shelfIdx) => (
        <group key={`shelf-${shelfIdx}`} position={[-0.7, shelfY + 0.25, 0]}>
          {Array.from({ length: 12 }).map((_, i) => {
            // Randomize slightly so they look like a collection of tapes
            const isTilted = Math.random() > 0.8;
            const xOffset = i * 0.12 + (isTilted ? 0.05 : 0);
            const rotZ = isTilted ? -0.15 : 0;
            const colors = ['#111111', '#222222', '#333333', '#1A1A1A', '#0D0D0D'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <mesh key={i} position={[xOffset, isTilted ? -0.02 : 0, 0]} rotation={[0, 0, rotZ]} castShadow>
                <boxGeometry args={[0.08, 0.4, 0.5]} />
                <meshStandardMaterial color={color} roughness={0.7} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

export function Rug({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <cylinderGeometry args={[2.5, 2.5, 0.05, 32]} />
      <meshStandardMaterial color="#FFB300" roughness={0.9} />
    </mesh>
  );
}

export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#E64A19" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 1.2, 0.2]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#388E3C" roughness={0.8} />
      </mesh>
      <mesh position={[-0.3, 1.1, -0.2]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#43A047" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PaintingImage({ url, width, height }: { url: string, width: number, height: number }) {
  const texture = useTexture(url);
  return (
    <mesh position={[0, 0, 0.061]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.3} transparent />
    </mesh>
  );
}

export function Painting({ position, rotation, url, title, width = 2.0, height = 1.5 }: { position: [number, number, number], rotation: [number, number, number], url?: string, title: string, width?: number, height?: number }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#EEE" />
      </mesh>
      {url && <PaintingImage url={url} width={width} height={height} />}
      {!url && (
        <Text
          position={[0, 0, 0.07]}
          color="black"
          fontSize={0.2}
          maxWidth={width - 0.2}
          textAlign="center"
        >
          {title}
        </Text>
      )}
    </group>
  );
}

export function Door({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[2.2, 4.2, 0.3]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Door inside */}
      <mesh position={[0, 2.05, 0.05]}>
        <boxGeometry args={[1.9, 4.0, 0.25]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      {/* Handle */}
      <mesh position={[0.7, 2, 0.2]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Window({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 2.2, 0.3]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {/* Glass (simulated) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 2.0, 0.2]} />
        <meshStandardMaterial color="#81D4FA" transparent opacity={0.4} />
      </mesh>
      {/* Crossbars */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[3.0, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[0.1, 2.0, 0.05]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
    </group>
  );
}

export function Desk({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.3, 0.6, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.3, 0.6, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1.3, 0.6, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.3, 0.6, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

export function Chair({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.2, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      {/* Support / Base */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 16]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      {/* Legs (Simple cross) */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  );
}

export function PC({ position, rotation = [0, 0, 0], onClick, children }: { position: [number, number, number], rotation?: [number, number, number], onClick?: (e: any) => void, children?: React.ReactNode }) {
  return (
    <group position={position} rotation={rotation} onClick={onClick} onPointerOver={() => onClick && (document.body.style.cursor = 'pointer')} onPointerOut={() => onClick && (document.body.style.cursor = 'auto')}>
      {/* Monitor Base */}
      <mesh position={[0, 0.05, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.3]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Monitor Stand */}
      <mesh position={[0, 0.2, -0.25]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Monitor Screen */}
      <mesh position={[0, 0.45, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Display Glow */}
      <mesh position={[0, 0.45, -0.12]}>
        <planeGeometry args={[1.15, 0.65]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.6} />
      </mesh>
      <group position={[0, 0.45, -0.11]}>
        {children}
      </group>
      {/* Keyboard */}
      <mesh position={[0, 0.05, 0.3]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.6, 0.05, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

export function SmallShelf({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Back */}
      <mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Left */}
      <mesh position={[-0.45, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Right */}
      <mesh position={[0.45, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Middle Shelf */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}

export function Sofa({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat base - 2 seats */}
      <mesh position={[-0.6, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.4, 1.2]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>
      <mesh position={[0.6, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.4, 1.2]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.1, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.0, 0.2]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>
      {/* Left armrest */}
      <mesh position={[-1.3, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#B71C1C" />
      </mesh>
      {/* Right armrest */}
      <mesh position={[1.3, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#B71C1C" />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.3, 0.1, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[1.3, 0.1, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-1.3, 0.1, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[1.3, 0.1, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

export function TVRack({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Top board */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Bottom board */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Left side */}
      <mesh position={[-2.05, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Right side */}
      <mesh position={[2.05, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Middle dividers */}
      <mesh position={[-0.7, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.7, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Back board */}
      <mesh position={[0, 0.6, -0.55]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.5, 0.1]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      {/* Legs */}
      {[-1.9, -0.7, 0.7, 1.9].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.15, -0.4]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.03, 0.3]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[x, 0.15, 0.4]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.03, 0.3]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function TVMonitor({ position, rotation = [0, 0, 0], children }: { position: [number, number, number], rotation?: [number, number, number], children?: React.ReactNode }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand Base */}
      <mesh position={[0, -1.15, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Stand Neck */}
      <mesh position={[0, -0.85, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* TV Back panel */}
      <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 2.025, 0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* TV Bezel (Frame) */}
      <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 2.125, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* TV Screen Glass */}
      <mesh position={[0, 0, 0.001]} castShadow receiveShadow>
        <planeGeometry args={[3.6, 2.025]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* The HTML overlay / content */}
      <group position={[0, 0, 0.02]}>
        {children}
      </group>
    </group>
  );
}

export function VideoGame({ position, rotation = [0, 0, 0], onClick }: { position: [number, number, number], rotation?: [number, number, number], onClick?: (e: any) => void }) {
  return (
    <group position={position} rotation={rotation} onClick={onClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
      {/* Console Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      {/* Console Detail */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <Html position={[0, 0.2, 0]} center>
        <span className="text-xs font-bold bg-white text-black px-1 rounded pointer-events-none">Jogos</span>
      </Html>
    </group>
  );
}

export function VHSPlayer({ position, rotation = [0, 0, 0], onClick }: { position: [number, number, number], rotation?: [number, number, number], onClick?: (e: any) => void }) {
  return (
    <group position={position} rotation={rotation} onClick={onClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
      {/* Player Body */}
      <mesh position={[0, 0.075, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.15, 0.5]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Tape Slot */}
      <mesh position={[0, 0.075, 0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <Html position={[0, 0.25, 0]} center>
        <span className="text-xs font-bold bg-white text-black px-1 rounded pointer-events-none">Sites</span>
      </Html>
    </group>
  );
}
