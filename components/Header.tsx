
import React from 'react';

const PersuadisLogo = () => (
    <div className="text-4xl font-bold tracking-tighter">
        <span className="text-white">persu</span>
        <span className="text-cyan-400">Adis</span>
        <div className="text-sm font-light text-gray-300 tracking-widest uppercase">
            Marketing Inmobiliario
        </div>
    </div>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      <div className="flex justify-center items-center mb-6">
        
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
        Líderes en Marketing Inmobiliario
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
        Con nuestro programa <span className="font-bold text-cyan-300">LIFE</span>, transformamos los renders de la promoción en una experiencia audiovisual única usando IA generativa.
      </p>
    </header>
  );
};
