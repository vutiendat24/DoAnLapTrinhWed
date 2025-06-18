import React from 'react';
import Header from './common/Header/Header'
import SidebarLeft from './common/Sidebar/SidebarLeft'
import { Outlet } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header/>

            <div className='flex flex-1 overflow-hidden'>
                 <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default HomePage;