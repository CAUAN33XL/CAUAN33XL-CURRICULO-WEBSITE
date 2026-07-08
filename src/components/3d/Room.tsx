import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Bed, Bookshelf, Plant, Painting, Door, Window, Desk, Chair, PC, SmallShelf, Sofa, TVRack, TVMonitor, VideoGame, VHSPlayer } from './Furniture';

export function Room() {
  const [activeTvProject, setActiveTvProject] = useState<string | null>(null);
  const [activePcProject, setActivePcProject] = useState<string | null>(null);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#A1887F" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -6]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#ECEFF1" />
      </mesh>
      <mesh position={[0, 2.5, 6]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#ECEFF1" />
      </mesh>
      <mesh position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#CFD8DC" />
      </mesh>
      <mesh position={[6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#CFD8DC" />
      </mesh>

      {/* Furniture */}
      <Bed position={[3.5, 0, 3]} rotation={[0, Math.PI, 0]} />
      <Bookshelf position={[-4.8, 0, -3]} rotation={[0, Math.PI / 4, 0]} />
      <Plant position={[-4.5, 0, 4.5]} />
      <Plant position={[4.5, 0, -4.5]} />
      
      {/* Architectural Elements */}
      <Door position={[-5.9, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[5.9, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Workspace */}
      <Desk position={[-1.5, 0, 4.8]} rotation={[0, Math.PI, 0]} />
      <PC 
        position={[-1.5, 1.2, 4.8]} 
        rotation={[0, Math.PI, 0]} 
        onClick={(e) => { e.stopPropagation(); setActivePcProject('https://pt.wikipedia.org/wiki/Sistema_operativo'); }}
      >
        {activePcProject && (
          <Html
            transform
            distanceFactor={0.575}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            occlude
          >
            <div className="w-[800px] h-[450px] bg-white rounded overflow-hidden">
              <iframe
                src={activePcProject}
                width="100%"
                height="100%"
                className="border-none"
                title="PC View"
              />
            </div>
          </Html>
        )}
      </PC>
      <Chair position={[-1.5, 0, 3.8]} rotation={[0, 0, 0]} />
      <SmallShelf position={[0.7, 0, 5.5]} rotation={[0, Math.PI, 0]} />

      {/* Living Area */}
      <Sofa position={[0, 0, -1.0]} rotation={[0, Math.PI, 0]} />

      {/* Decorations */}
      <Painting position={[-1.5, 3, 5.8]} rotation={[0, Math.PI, 0]} title="Meu Currículo" url="/favicon/favicon.png" width={1.5} height={1.5} />
      <Painting position={[3.5, 3.5, -5.8]} rotation={[0, 0, 0]} title="Desenvolvedor" />

      {/* TV Desk */}
      <TVRack position={[0, 0, -5]} />

      {/* TV Screen */}
      <TVMonitor position={[0, 2.125, -5]}>
        {activeTvProject && (
          <Html
            transform
            distanceFactor={1.5}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            occlude
          >
            <div className="w-[960px] h-[540px] bg-white rounded-lg overflow-hidden border-4 border-neutral-800">
              <iframe
                src={activeTvProject}
                width="100%"
                height="100%"
                className="border-none"
                title="Project View"
              />
            </div>
          </Html>
        )}
      </TVMonitor>

      {/* Video Game */}
      <VideoGame 
        position={[-0.8, 0.95, -4.7]} 
        onClick={(e) => { e.stopPropagation(); setActiveTvProject('https://pt.wikipedia.org/wiki/Video_game'); }}
      />

      {/* VHS Player */}
      <VHSPlayer 
        position={[0.8, 0.95, -4.7]} 
        onClick={(e) => { e.stopPropagation(); setActiveTvProject('https://pt.wikipedia.org/wiki/Website'); }}
      />

    </group>
  );
}
