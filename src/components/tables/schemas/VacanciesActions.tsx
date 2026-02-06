import { Button } from '@/components/ui/button';
import { MenuDots, DocumentAdd, Document, CloseCircle } from '@solar-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Drawer } from '@/components/ui/drawer';
import DrawerVacante from '@/components/DrawerVacante/DrawerVacante';
import * as React from 'react';
import { VacancyRow } from '@/app/employer/home/vacancies/page';

export default function RowActions({
  row,
  onCloseVacancy,
}: {
  row: { original: VacancyRow };
  onCloseVacancy?: (vacancyId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  function handleEditVacancy(id: string) {
    console.log('Editar vacante: ' + id);
    window.location.href = `/employer/home/vacancies/edit/${id}`;
  }

  const handleCloseVacancy = () => {
    if (onCloseVacancy) {
      onCloseVacancy(row.original.id);
    }
  };

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" color="gray" size="sm_icon">
              <MenuDots weight="Bold" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditVacancy(row.original.id)}>
              <DocumentAdd className="text-zinc-800" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setOpen(true)}>
              <Document className="text-zinc-800" />
              Ver vacante
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleCloseVacancy}>
              <CloseCircle className="text-zinc-800" />
              Cerrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DrawerVacante vacancyId={row.original.id} />
      </Drawer>
    </>
  );
}
