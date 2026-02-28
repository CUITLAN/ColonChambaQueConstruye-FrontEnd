import { listAreasOptionsConstants, listModalityOptionsConstants, listWorkingHoursOptionsConstants } from "@/constants";
import { filterType } from "@/interfaces/table";
import { modal } from "@heroui/react";

export const filtersVacancies: filterType[] = [
{
  value: 'modality',
  name: 'Modalidad',
  options: listModalityOptionsConstants
},
{
  value: 'workShift',
  name: 'Jornada laboral',
  options: listWorkingHoursOptionsConstants
},
{
  value: 'dateFilter',
  name: 'Fecha de publicación',
  isDate: true,
}
]


export const filtersVacanciesUser: filterType[] = [
  {
  value: 'modality',
  name: 'Modalidad',
  options: listModalityOptionsConstants
},
{
  value: 'workShift',
  name: 'Jornada laboral',
  options: listWorkingHoursOptionsConstants
},
{
  value: 'sector',
  name: 'Sector',
  options: listAreasOptionsConstants
},
];
