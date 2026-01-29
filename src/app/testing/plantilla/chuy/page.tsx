'use client';
import Header from '@/components/ui/header';
import HeaderLinker from '@/components/ui/header.linker';
import LandingHeader from '@/components/ui/landing-header';
import Alert from '@/components/ui/Alerts';
import DrawerApplicantVacant from '@/components/applicant/jobsCard';

export default function Page() {

    return (
        <div className='items-center'>
            <p className='height-200'></p>
            <HeaderLinker/>
            <p className='height-200'></p>
            <LandingHeader/>
            <p className='height-200'></p>
            <Alert type="error" title="Alerta 1" description="Esta es la descripción de la alerta 1" />
            <p className='height-200'></p>
            <Alert type="warning" title="Alerta 2" description="Esta es la descripción de la alerta 2" />
            <p className='height-200'></p>
            <div className='flex justify-center mb-10'>
                <DrawerApplicantVacant job={{ title: "Desarrollador Frontend", company: "Empresa XYZ", location: "Remoto", description: "Descripción del trabajo", salaryRange: "1000 - 2000", schedule: "Lunes a Viernes, 9am - 6pm", modality: "Remoto"}} />
            </div>
        </div>
    );
}