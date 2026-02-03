import React from 'react';
import { MenuIcon } from './icons/Icons';

import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            {/* Main Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="Logo Simposio Biodiversidad"
                                className="h-10 w-auto object-contain"
                            />
                            <h1 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-gold to-secondary-blue hidden lg:block">
                                I Simposio de Biodiversidad y Biotecnología Vegetal
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'text-primary-gold font-bold'
                                            : 'text-gray-600 hover:text-primary-gold'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/register"
                                className="bg-primary-gold text-white font-semibold px-5 py-2 rounded-full hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-md text-sm"
                            >
                                Inscríbete
                            </NavLink>
                        </nav>

                        <div className="flex items-center md:hidden">
                            <button
                                onClick={onMenuClick}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-gold"
                                aria-label="Open main menu"
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;