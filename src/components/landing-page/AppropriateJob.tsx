'use client';
import { careers1, careers2 } from '@/constants';
import { Chip } from '@heroui/react';

export function AppropriateJob() {
  const repeatedCareers1 = [...careers1, ...careers1];
  const repeatedCareers2 = [...careers2, ...careers2];

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row">
      {/* Mobile Careers 1 */}
      <div className="block w-full overflow-hidden md:hidden">
        <div className="animate-scroll flex gap-2">
          {repeatedCareers1.map((car, idx) => (
            <Chip
              className="border-default box-border flex-shrink-0 border-2 bg-transparent px-4 py-5 text-zinc-400"
              key={`careers1-${idx}`}
            >
              {car}
            </Chip>
          ))}
        </div>
      </div>

      {/* Desktop Careers 1 */}
      <div className="hidden max-w-[460px] flex-wrap items-start gap-2 md:flex">
        {careers1.map((car) => (
          <Chip
            className="border-default box-border border-2 bg-transparent px-4 py-5 text-zinc-400"
            key={car}
          >
            {car}
          </Chip>
        ))}
      </div>

      {/* Principal Text */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <h2 className="text-3xl font-bold">Encuentra el empleo adecuado</h2>
        <p className="leading-loose">
        En la era moderna, encontrar el empleo perfecto puede ser un desafío, pero no tiene por qué serlo. Nuestra plataforma de bolsa de trabajo, especialmente diseñada para la comunidad del municipio de colon, está aquí para facilitar tu búsqueda y conectar talento con oportunidades.
        </p>
      </div>

      {/* Mobile Careers 2 */}
      <div className="block w-full overflow-hidden md:hidden">
        <div className="animate-scroll-reverse flex gap-2">
          {repeatedCareers2.map((car, idx) => (
            <Chip
              className="border-default box-border flex-shrink-0 border-2 bg-transparent px-4 py-5 text-zinc-400"
              key={`careers2-${idx}`}
            >
              {car}
            </Chip>
          ))}
        </div>
      </div>

      {/* Desktop Careers 2 */}
      <div className="hidden max-w-[460px] flex-wrap justify-end gap-2 md:flex">
        {careers2.map((car) => (
          <Chip
            className="border-default box-border border-2 bg-transparent px-4 py-5 text-zinc-400"
            key={car}
          >
            {car}
          </Chip>
        ))}
      </div>
    </div>
  );
}
