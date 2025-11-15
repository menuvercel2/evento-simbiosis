import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-text text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Logos and Copyright */}
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src="/logo.png"
                                alt="Logo Simposio Biodiversidad"
                                className="h-10 w-auto object-contain"
                            />
                            <div>
                                <h3 className="font-bold text-white">I Simposio Internacional sobre</h3>
                                <p className="text-sm">Biodiversidad y Biotecnología Vegetal</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Simposio B&B. Todos los derechos reservados.</p>
                    </div>
                    {/* Column 2: Organizers */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Organizado por</h3>
                        <ul className="space-y-2 text-sm">
                            <li>GCE KARYON</li>
                            <li>GCE Hibiscus</li>
                        </ul>
                    </div>

                    {/* Column 3: Useful Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Enlaces Útiles</h3>
                        <ul className="space-y-2 text-sm">
                            {NAV_LINKS.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-white hover:underline transition">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;