import React from 'react';
import { InstagramIcon } from '../components/icons/Icons';

const groups = [
    {
        name: 'GCE KARYON',
        description: 'Grupo Científico Estudiantil de la Facultad de Biología de la Universidad de La Habana que combina investigación y extensión universitaria. Trabaja en líneas como neurociencias, conservación animal, potencialidades biomédicas de extractos vegetales, bioinformática y microorganismos.',
        image: '/public/karyon.png',
        instagram: 'https://www.instagram.com/karyon_fbio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
    {
        name: 'GCE Hibiscus',
        description: 'Grupo Científico Estudiantil vinculado al Jardín Botánico Nacional dedicado al estudio de la biodiversidad animal y vegetal. Desarrolla actividades enfocadas en estudios de biodiversidad, además de actividades de extensión universitaria principalmente con la comunidad. Trabaja en estrecha relación con entidades del sector biológico y ambiental de Cuba.',
        image: '/public/hibiscus.png',
        instagram: 'https://www.instagram.com/hibiscus_fbiouh'
    }
];

const GroupsPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up space-y-16 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-dark-text">Grupos de Investigación Organizadores</h1>

            <div className="space-y-12">
                {groups.map((group, index) => (
                    <section
                        key={group.name}
                        className={`flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-lg shadow-sm border border-gray-200/80 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <img
                                src={group.image}
                                alt={`Imagen de ${group.name}`}
                                className="w-full h-64 object-cover rounded-md"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-primary-gold mb-3">{group.name}</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">{group.description}</p>
                            <a
                                href={group.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
                            >
                                <InstagramIcon className="w-5 h-5" />
                                Seguir en Instagram
                            </a>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default GroupsPage;