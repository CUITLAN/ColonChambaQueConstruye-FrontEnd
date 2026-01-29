import { AddCircle, Letter, User } from '@solar-icons/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { CompanyData } from '@/interfaces';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';


interface LinkerCompanyCardProps {
  company: CompanyData
  sideDrawer?: "left" | "right"
}

function daysSince(date: string): number {
  const today = new Date();
  const registeredDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  registeredDate.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - registeredDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function CompanyLinkerCard({
  company, sideDrawer
}: LinkerCompanyCardProps) {

  const recruiterName = (
    (company?.CompanyAccount?.firstName ?? '') +
    ' ' +
    (company?.CompanyAccount?.lastName ?? '')
  ).trim();


  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <Drawer direction={sideDrawer === "left" ? "left" : "right"}>
      <div className="flex w-full gap-5 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
  
  <div className="flex-shrink-0">
    <Avatar className="h-18 w-18 object-contain">
      <AvatarFallback className="bg-uaq-terniary text-white text-2xl font-semibold">
        {company.Company.tradeName
          ? company.Company.tradeName.split(' ').slice(0, 2).map((word: any) => word.charAt(0))
          : 'NA'}
      </AvatarFallback>
    </Avatar>
  </div>

  <div className="flex flex-col flex-grow gap-2">
    <h3 className="text-lg font-[800]">
      {company.Company.tradeName}
    </h3>
    
    <div className="flex-1 space-y-1 text-start">
        <div className="text-start font-[400] text-gray-600">{company.Company.description}</div>
      </div>
  </div>

  <div className="flex flex-col w-[260px] flex-shrink-0 justify-between items-end border-l border-gray-100 pl-4">
    
    <div className="flex flex-col justify-center gap-2 self-center rounded-r-lg p-4 transition-colors duration-300 ">
      
      <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
        <Letter className="h-4 w-4" weight="Linear"/>
        <span className="truncate max-w-[180px]" title={company.Company.companyEmail}>
          {company.Company.companyEmail}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
        <User className="h-4 w-4" weight="Linear" />
        <span className="truncate max-w-[180px]">
           {recruiterName || '-'}
        </span>
      </div>
    </div>

    <div className="flex flex-1 flex-col self-center px-4 transition-colors duration-300 items-end">
        <DrawerTrigger className="text-start font-[400] text-brand group-hover:hover:text-uaq-brand active:text-uaq-terniary-hover cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-3 rounded-2xl flex items-center gap-2 text-l transition-colors duration-200 mx-3">
            <AddCircle weight='Bold' className="h-4 w-4" />
            Información
        </DrawerTrigger>
    </div>

  </div>

</div>

    
      
        <DrawerContent className="flex overflow-y-auto overflow-x-hidden bg-gray-50 pt-5">
          <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              <DrawerTitle className="text-2xl font-[800]">
                EMPRESA:{' '}
                <span className="font-[800] tracking-wide">
                  {company?.Company?.tradeName?.toUpperCase() || 'N/A'}
                </span>
              </DrawerTitle>

              <div className={`text-white text-lg font-semibold px-4 py-2 rounded-lg ${
                    (String(company.Company.status ?? '').toUpperCase() === 'RECHAZADA') ? 'bg-uaq-danger' : 'bg-success'
                  }`}>
                    {String(company.Company.status ?? '').toUpperCase() === 'RECHAZADA' ? (
                      <div>
                        RECHAZADA
                      </div>
                    ) :  (
                      <div>
                        {company.Company.status}
                      </div>
                    )}
                  </div>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 my-5shadow-md border border-gray-200 rounded-lg">
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Razón Social</h3>
              <div className="w-2/3">
                <span>{company.Company.legalName ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">RFC</h3>
              <div className="w-2/3">
                <p className="leading-relaxed text-gray-800">
                  {company.Company.rfc ?? '-'}
                </p>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Dirección</h3>
              <div className="w-2/3">
                <span>{company.Company.street ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">País de inversión</h3>
              <div className="w-2/3">
                <span>{company.Company.investmentCountry ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Giro de la empresa</h3>
              <div className="w-2/3">
                <span>{company.Company.workSector ? String(company.Company.workSector).toLowerCase() : '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Total de empleados</h3>
              <div className="w-2/3">
                <span>{company.Company.totalWorkers ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Correo electrónico</h3>
              <div className="w-2/3">
                <span>{company.Company.companyEmail ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Descripción</h3>
              <div className="w-2/3">
                <span>{company.Company.description ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />
          </div>

            <DrawerHeader className="px-10">
            <div className="flex w-full items-center justify-between">
              <DrawerTitle className="text-2xl font-[800]">
                RECLUTADOR:{'  '}
                <span className="font-[800] tracking-wide">
                 <br/> {recruiterName || 'N/A'}
                </span>
              </DrawerTitle>
            </div>
          </DrawerHeader>

          <div className="w-10/12 bg-white justify-center mx-auto my-5 my-5shadow-md border border-gray-200 rounded-lg">
            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Teléfono fijo</h3>
              <div className="w-2/3">
                <span>{company.CompanyAccount?.landlinePhone ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Teléfono celular</h3>
              <div className="w-2/3">
                <p className="leading-relaxed text-gray-800">
                  {company.CompanyAccount?.cellPhone ?? '-'}
                </p>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            <div className="px-10 py-6 flex justify-between">
              <h3 className="text-base font-medium w-1/3">Correo electrónico</h3>
              <div className="w-2/3">
                <span>{company.CompanyAccount?.email ?? '-'}</span>
              </div>
            </div>
            <Separator className='w-11/12 justify-center mx-auto shadow-md rounded-lg' />

            </div>
          <DrawerClose className='text-base font-bold hover:bg-zinc-200 border-0 text-uaq-danger px-4 py-3 rounded-md mx-auto mb-7'>
            Cerrar
          </DrawerClose>
        </DrawerContent>
    </Drawer>
    

    </div>
  );
}
