import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '../components/icons/Icons';
import { utils, writeFile } from 'xlsx';

interface Registration {
    id: number;
    full_name: string;
    email: string;
    institution: string;
    phone: string | null;
    commission_name: string;
    work_title: string;
    work_summary: string;
    created_at: string;
}

const RegistrationListPage: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCommission, setSelectedCommission] = useState<string>('Todas');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/registrations');
            const data = await response.json();

            if (data.success) {
                setRegistrations(data.data);
            } else {
                setError('Error al cargar los registros');
            }
        } catch (err) {
            console.error(err);

            // SIMULATION FOR DEV MODE
            if (import.meta.env.DEV) {
                console.warn("⚠️ DEV MODE: Simulating data");
                const mockData = Array.from({ length: 15 }).map((_, i) => ({
                    id: i + 1,
                    full_name: `Participante ${i + 1}`,
                    email: `participante${i + 1}@example.com`,
                    institution: 'Universidad de La Habana',
                    phone: '+53 55555555',
                    commission_name: i % 2 === 0 ? 'Biología Vegetal' : 'Biotecnología Vegetal',
                    work_title: 'Investigación sobre la biodiversidad en zonas costeras',
                    work_summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    created_at: new Date().toISOString()
                }));
                setRegistrations(mockData);
            } else {
                setError('Error de conexión con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        // Prepare data for Excel
        const data = filteredRegistrations.map(r => ({
            'ID': r.id,
            'Nombre': r.full_name,
            'Email': r.email,
            'Institución': r.institution,
            'Teléfono': r.phone || '-',
            'Comisión': r.commission_name,
            'Título del Trabajo': r.work_title,
            'Resumen': r.work_summary,
            'Fecha Registro': new Date(r.created_at).toLocaleDateString()
        }));

        // Create workbook and worksheet
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Inscripciones");

        // Save file
        writeFile(wb, `inscripciones_simbiosis_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const uniqueCommissions = ['Todas', ...new Set(registrations.map(r => r.commission_name))];

    const filteredRegistrations = selectedCommission === 'Todas'
        ? registrations
        : registrations.filter(r => r.commission_name === selectedCommission);

    if (loading) return <div className="p-10 text-center"><div className="animate-spin h-8 w-8 border-4 border-primary-gold rounded-full border-t-transparent mx-auto"></div><p className="mt-4 text-gray-500">Cargando registros...</p></div>;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-dark-text"> Lista de Inscritos ({registrations.length})</h1>

                <div className="flex gap-3">
                    <select
                        value={selectedCommission}
                        onChange={(e) => setSelectedCommission(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-gold outline-none"
                    >
                        {uniqueCommissions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <button
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Exportar Excel
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                <th className="p-4 font-semibold">Participante</th>
                                <th className="p-4 font-semibold">Institución</th>
                                <th className="p-4 font-semibold">Comisión</th>
                                <th className="p-4 font-semibold">Título</th>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRegistrations.map((reg) => (
                                <React.Fragment key={reg.id}>
                                    <tr className="hover:bg-gray-50/80 transition-colors text-sm">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{reg.full_name}</div>
                                            <div className="text-gray-500 text-xs">{reg.email}</div>
                                            <div className="text-gray-500 text-xs">{reg.phone || 'Sin teléfono'}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{reg.institution}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                                {reg.commission_name}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-800 font-medium max-w-xs truncate" title={reg.work_title}>
                                            {reg.work_title}
                                        </td>
                                        <td className="p-4 text-gray-500 whitespace-nowrap">
                                            {new Date(reg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                                                className="text-gray-400 hover:text-primary-gold p-1"
                                            >
                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedRow === reg.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === reg.id && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={6} className="p-6 border-b border-gray-100">
                                                <div className="max-w-4xl mx-auto">
                                                    <h3 className="font-bold text-gray-900 mb-2">Resumen del Trabajo:</h3>
                                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                                                        {reg.work_summary}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRegistrations.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No hay registros para mostrar.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationListPage;
