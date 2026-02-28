'use client';
import { careers1, careers2 } from '@/constants';
import { Chip } from '@heroui/react';

export function ContactTalent() {
  const allCareers = [...careers1, ...careers2];

  return (
    <div className="flex flex-col items-center gap-8 pt-20 pb-20 bg-uaq-brand">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <h2 className="text-4xl font-bold text-zinc-50">Contacta talento rápido y seguro</h2>
        <p className="leading-loose text-zinc-50">
          Contratar al candidato ideal no tiene por qué ser un proceso tedioso. Con nuestras herramientas intuitivas y eficientes, podrás buscar, filtrar y seleccionar talento en menos tiempo.
        </p>
      </div>
      <div className="hidden max-w-4/6 flex-wrap justify-center items-center gap-5 md:flex">
        {allCareers.map((car) => (
          <Chip
            /* 
            Queda pendiente decidir si los 'recuadros' de las carreras deben tener un hover
            className="border-default box-border px-4 py-5 bg-uaq-default-50/50 text-uaq-accent hover:bg-uaq-default-200/50 hover:text-uaq-accent-hover transition duration-200"
            */
            className="border-default box-border px-4 py-5 bg-uaq-default-50/50 text-uaq-accent"
            key={car}
          >
            {car}
          </Chip>
        ))}
      </div>
    </div>
  );
}
