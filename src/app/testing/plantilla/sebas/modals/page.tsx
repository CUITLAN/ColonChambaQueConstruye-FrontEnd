'use client';

import Headersimple from '@/components/ui/header-simple';
import { useState } from 'react';
import LogoutModal from '@/components/ui/modal/LogoutModal';
import { Button } from '@/components/ui/button';
import ModalNoticeReview from '@/components/ui/modal/employer/ModalNoticeReview';

export default function testModals() {

    const [showLogout, setShowLogout] = useState(false);
    const [showAllowUserModal, setShowAllowUserModal] = useState(false);


    const handleLogoutConfirm = () => {
        setShowLogout(false);
    };

    const closeLogoutModal = () => setShowLogout(false);

    const handleAllowUserModalConfirm = () => {
        setShowAllowUserModal(false);
    };

    const closeAllowUserModal = () => setShowAllowUserModal(false);


    return (
        <div className="flex min-h-screen flex-col">
            <Headersimple />
            <div className="flex flex-col  py-15">
                <main className="flex h-fit flex-col items-center justify-center gap-10">
                    <div className='items-center justify-center'>
                        <h1 className="font-bold pb-4 text-center">Modales Empresas</h1>
                        <div className='flex gap-3'>
                            <Button type="button" variant="primary" color="gray" className="flex-1 h-[60px] [&_svg]:!w-12 [&_svg]:!h-12" onClick={() => setShowAllowUserModal(true)}>
                                Editar
                            </Button>
                        </div>
                    </div>
                    <div className="mb-6 space-y-4">
                        {showLogout && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <LogoutModal onConfirm={handleLogoutConfirm} onClose={closeLogoutModal} />
                            </div>
                        )}
                        {showAllowUserModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <ModalNoticeReview onConfirm={handleAllowUserModalConfirm} onClose={closeAllowUserModal} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}