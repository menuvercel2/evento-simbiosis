import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PencilAltIcon, UserGroupIcon, XIcon } from './icons/Icons';
import { NAV_LINKS } from '../constants';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const ICONS: { [key: string]: React.ElementType } = {
    'Información': HomeIcon,
    'Registro': PencilAltIcon,
    'Sobre los Grupos': UserGroupIcon
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const baseClasses = "fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out";
    const closedClasses = "-translate-x-full";

    const activeLinkClasses = "bg-primary-gold/10 text-primary-gold font-semibold";
    const inactiveLinkClasses = "text-gray-600 hover:bg-gray-100 hover:text-dark-text";
    const linkBaseClasses = "group flex items-center px-4 py-3 text-md font-medium rounded-lg transition-all duration-200 w-full";

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <aside className={`${baseClasses} ${isOpen ? 'translate-x-0' : closedClasses}`}>
                <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="Logo Simposio Biodiversidad"
                            className="h-10 w-auto object-contain"
                        />
                        <h2 className="text-lg font-bold text-dark-text">SIMBIOSIS</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-5 p-4 space-y-2">
                    {NAV_LINKS.map((link) => {
                        const Icon = ICONS[link.name];
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={onClose}
                                className={({ isActive }) => `${linkBaseClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                            >
                                {Icon && <Icon className="mr-4 flex-shrink-0 h-6 w-6" />}
                                {link.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;