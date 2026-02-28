'use client';

import { Control } from 'react-hook-form';
import FormSectionHeader from './FormSectionHeader';
import { VacancyFormType } from '@/validations/registerVacancy';
import FormComboBadgeSelector from '@/components/forms/FormComboBadgeSelector';
import { listAreasOptionsConstants } from '@/constants';
import { useState } from 'react';
import { Input } from '@heroui/react';
import FormInput from '@/components/forms/FormInput';

type InterestAreasSelectorProps = {
    control: Control<VacancyFormType>;
}

export default function AdditionalInformation({ control }: InterestAreasSelectorProps) {
    return (
        <section className="space-y-4">
            <FormSectionHeader
                title="Datos adicionales"
                className='text-uaq-terniary font-normal'
            />
            <div className="space-y-4">
                <FormInput 
                    control={control}
                    type='textarea'
                    name='additionalInformation'
                    label='Detalles adicionales a considerar'
                    description='Incluye información extra relevante que consideres para este puesto (ejemplo: disponibilidad para viajar o trabajo en fines de semana)'
                />
            </div>
        </section>
    );
}