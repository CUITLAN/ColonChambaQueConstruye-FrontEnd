'use client';

import * as React from 'react';

import { filterType } from '@/interfaces/table';
import TableSearchBar from './TableSerchBar';

type AccessorValue = string | number | Date | string[] | null | undefined; 
type Accessors<data> = Record<string, (item: data) => AccessorValue>; 

type UniversalCardsFilterProps<data> = {
  items: data[];
  filters: filterType[];
  accessors: Accessors<data>;
  multiMode?: 'AND' | 'OR';
  render: (filtered: data[]) => React.ReactNode;
  normalizeFn?: (txt: unknown) => string;
  onFilterChange?: (key: string, value: string | string[] | null) => void;
  activeFilters?: Record<string, string | string[]>;
};

function defaultNormalize(txt: unknown) {
  if (txt == null) return '';
  const str = Array.isArray(txt) ? txt.join(' ') : String(txt);
  return str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function UniversalCardsFilter<T>({
  items,
  filters,
  accessors,
  multiMode = 'AND',
  render,
  normalizeFn = defaultNormalize,
  onFilterChange,
  activeFilters, // Recibimos los filtros activos
}: UniversalCardsFilterProps<T>) {
  
  const [filtersState, setFiltersState] = React.useState<Record<string, unknown>>({
    name: '', 
  });

  React.useEffect(() => {
    if (activeFilters) {
      setFiltersState((prev) => {
        const nextState = { ...prev };
        let hasChanges = false;
        
        Object.entries(activeFilters).forEach(([key, value]) => {
           if (nextState[key] !== value) {
              nextState[key] = value;
              hasChanges = true;
           }
        });

        return hasChanges ? nextState : prev;
      });
    }
  }, [activeFilters]);

  const tableAdapter = React.useMemo(() => ({
      getColumn: (columnId: string) => ({  
        getFilterValue: () => filtersState[columnId],
        
        setFilterValue: (value: unknown) => {
          setFiltersState((prev) => ({ ...prev, [columnId]: value }));

          if (onFilterChange) {
            let valueToSend: string | string[] | null = null;

            if (Array.isArray(value)) {
              const normalized = value
                .map((v) => (typeof v === 'string' ? v : String(v ?? '')))
                .filter((v) => v.length > 0);
              valueToSend = normalized.length ? normalized : [];
            } else if (value instanceof Date) {
              valueToSend = value.toISOString();
            } else if (value == null || value === '') {
              valueToSend = '';
            } else {
              valueToSend = String(value);
            }

            onFilterChange(columnId, valueToSend);
          }
        },
      }) as const,
    }),
    [filtersState, onFilterChange]
  );

  const filtered = React.useMemo(() => {
    const q = (filtersState['name'] as string) ?? '';

    const includesNorm = (data: unknown, query: string) => {
      if (!query) return true;
      return normalizeFn(data).includes(normalizeFn(query));
    };

    const matchMulti = (value: AccessorValue, selected: string[]) => {
      if (!selected?.length) return true;
      const source = Array.isArray(value)
        ? value.join(' ')
        : String(value ?? '') || '';
      const hay = normalizeFn(source);

      if (multiMode === 'AND') {
        return selected.every((s) => hay.includes(normalizeFn(s)));
      } else {
        return selected.some((s) => hay.includes(normalizeFn(s)));
      }
    };

    return items.filter((it) => {
      const globalPass = accessors.name ? includesNorm(accessors.name(it), q) : true;
      if (!globalPass) return false;

      for (const f of filters) {
        const key = f.value;
        const sel = filtersState[key];

        if (
          sel == null ||
          (Array.isArray(sel) && sel.length === 0) ||
          (typeof sel === 'string' && sel.length === 0)
        ) {
          continue;
        }

        const accessor = accessors[key];
        if (!accessor) continue;

        const val = accessor(it);

        if (f.isDate) {
          const selectedDate = Array.isArray(sel) ? sel[0] : sel;
          if (selectedDate) {
            const toYmd = (d: Date | string) => {
              const dd = d instanceof Date ? d : new Date(d);
              return dd.toISOString().slice(0, 10);
            };
            if (toYmd(val as any) !== toYmd(selectedDate as any)) return false;
          }
        } else {
          const selected = Array.isArray(sel) ? (sel as string[]) : [String(sel)];
          if (!matchMulti(val, selected)) return false;
        }
      }

      return true;
    });
  }, [items, filters, accessors, activeFilters, multiMode, normalizeFn]);

  return (
    <div className="space-y-4">
      <TableSearchBar filters={filters} table={tableAdapter} />
      {render(filtered)}
    </div>
  );
}