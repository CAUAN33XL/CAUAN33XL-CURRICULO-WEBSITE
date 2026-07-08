import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { Room } from './Room';

export function Scene3D() {
  const [start, setStart] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    if (!start) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setInventoryOpen(prev => {
          const next = !prev;
          if (next) {
            document.exitPointerLock();
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [start]);

  return (
    <div className="w-full flex-1 bg-neutral-900 relative">
      {!start && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-black">
          {/* Subtle vignette/border effect */}
          <div className="absolute inset-4 border border-white/10 pointer-events-none"></div>
          <div className="absolute inset-5 border border-white/5 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center p-12 max-w-3xl text-center">
            
            {/* Ornate separator top */}
            <div className="flex items-center justify-center w-full mb-8 opacity-70">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
              <div className="w-2 h-2 rotate-45 bg-white mx-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
            </div>

            <h2 className="text-white text-5xl md:text-6xl font-['Xirod'] tracking-[0.25em] mb-3 uppercase drop-shadow-lg">Modo 3D</h2>
            <p className="text-neutral-400 text-xs md:text-sm tracking-[0.3em] font-serif italic mb-12 uppercase">Experiência Interativa</p>
            
            <div className="space-y-8 text-neutral-300 font-serif text-lg md:text-xl leading-relaxed mb-16">
              <p>
                Utilize <kbd className="text-white font-bold tracking-widest border border-white/30 px-3 py-1 rounded-sm mx-1 shadow-[0_0_5px_rgba(255,255,255,0.1)] bg-white/5">W</kbd> 
                <kbd className="text-white font-bold tracking-widest border border-white/30 px-3 py-1 rounded-sm mx-1 shadow-[0_0_5px_rgba(255,255,255,0.1)] bg-white/5">A</kbd> 
                <kbd className="text-white font-bold tracking-widest border border-white/30 px-3 py-1 rounded-sm mx-1 shadow-[0_0_5px_rgba(255,255,255,0.1)] bg-white/5">S</kbd> 
                <kbd className="text-white font-bold tracking-widest border border-white/30 px-3 py-1 rounded-sm mx-1 shadow-[0_0_5px_rgba(255,255,255,0.1)] bg-white/5">D</kbd> para caminhar e o mouse para observar.
              </p>
              <p className="text-base text-neutral-400 italic max-w-lg mx-auto">
                Aponte o centro da tela para os objetos no quarto (o Videogame, o Aparelho VHS ou o Computador) e clique para iniciar as transmissões.
              </p>
            </div>

            <button 
              onClick={() => setStart(true)}
              className="group relative px-14 py-5 bg-transparent text-white font-serif tracking-[0.3em] uppercase text-sm transition-all duration-700 hover:text-black overflow-hidden border border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="absolute inset-0 bg-white translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
              <span className="relative z-10">Adentrar o Quarto</span>
            </button>
            
            {/* Ornate separator bottom */}
            <div className="flex items-center justify-center w-full mt-16 opacity-70">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
              <div className="w-1.5 h-1.5 rotate-45 border border-white/60 mx-6"></div>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
            </div>

          </div>
        </div>
      )}

      {start && (
        <>
          <Canvas camera={{ position: [0, 1.8, 3] }} shadows>
            <ambientLight intensity={0.5} />
            <spotLight position={[0, 4, 0]} angle={0.8} penumbra={1} castShadow intensity={2} />
            
            <Room />
            <Player />
          </Canvas>

          {inventoryOpen && (
            <div className="absolute inset-0 z-[99999999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
              <div className="bg-neutral-900/90 border border-neutral-700 rounded-lg p-6 shadow-2xl max-w-2xl w-[90%] lg:w-full">
                <div className="flex justify-between items-center mb-6 border-b border-neutral-700 pb-2">
                  <h3 className="text-white text-xl font-bold font-mono tracking-widest">INVENTÁRIO</h3>
                  <button onClick={() => setInventoryOpen(false)} className="text-neutral-400 hover:text-white font-bold text-xl">✕</button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-neutral-800 border border-neutral-700 rounded flex items-center justify-center hover:bg-neutral-600 transition-colors cursor-pointer group relative">
                      {i === 0 && <span className="text-3xl" title="Fita VHS Vermelha (GitHub)">📼</span>}
                      {i === 1 && <span className="text-3xl" title="Fita VHS Azul (Wikipedia)">📼</span>}
                      {i === 2 && <span className="text-3xl" title="Chave do Quarto">🔑</span>}
                      
                      {i < 3 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border border-neutral-900"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center text-neutral-400 text-xs font-mono">
                  Pressione <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700">TAB</kbd> para fechar
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="absolute top-4 left-4 z-0 flex flex-col gap-2 pointer-events-none">
        <div className="text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
          ESC: Liberar mouse
        </div>
        {start && (
          <div className="text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
            TAB: Inventário
          </div>
        )}
      </div>
    </div>
  );
}
