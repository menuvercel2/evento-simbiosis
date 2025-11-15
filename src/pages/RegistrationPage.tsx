
import React, { useState } from 'react';
import { RegistrationData } from '../types';
import { COMMISSIONS } from '../constants';

const RegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationData>({
        fullName: '',
        email: '',
        institution: '',
        phone: '',
        commission: COMMISSIONS[0],
        workTitle: '',
        workSummary: '',
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Partial<RegistrationData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegistrationData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<RegistrationData> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio.';
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del correo electrónico no es válido.';
        }
        if (!formData.institution.trim()) newErrors.institution = 'La institución es obligatoria.';
        if (!formData.workTitle.trim()) newErrors.workTitle = 'El título del trabajo es obligatorio.';
        if (!formData.workSummary.trim()) newErrors.workSummary = 'El resumen del trabajo es obligatorio.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus('submitting');

        const payload = {
            full_name: formData.fullName,
            email: formData.email,
            institution: formData.institution,
            phone: formData.phone || null,
            commission_id: COMMISSIONS.indexOf(formData.commission) + 1,
            work_title: formData.workTitle,
            work_summary: formData.workSummary,
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setStatus('success');
            setFormData({
                fullName: '',
                email: '',
                institution: '',
                phone: '',
                commission: COMMISSIONS[0],
                workTitle: '',
                workSummary: '',
            });

        } catch (error) {
            console.error('Failed to submit registration:', error);
            setStatus('error');
        }
    };

    const inputClasses = (hasError: boolean) =>
        `mt-1 block w-full px-4 py-3 bg-gray-50 border ${hasError ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-primary-gold'} focus:border-transparent sm:text-sm text-dark-text placeholder-gray-400`;

    if (status === 'success') {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center animate-fade-in-up max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-primary-gold mb-4">¡Inscripción Exitosa!</h2>
                <p className="text-gray-600 mb-6">Gracias por inscribirte. Hemos recibido tus datos correctamente.</p>
                <button onClick={() => { setStatus('idle'); setErrors({}); }} className="bg-primary-gold text-white font-bold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all">
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-dark-text">Formulario de Inscripción</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClasses(!!errors.fullName)} />
                            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses(!!errors.email)} />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institución</label>
                            <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} required className={inputClasses(!!errors.institution)} />
                            {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses(false)} />
                        </div>

                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Área Temática</label>
                            <select id="commission" name="commission" value={formData.commission} onChange={handleChange} className={inputClasses(false)}>
                                {COMMISSIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="workTitle" className="block text-sm font-medium text-gray-700">Título del Trabajo</label>
                            <input type="text" id="workTitle" name="workTitle" value={formData.workTitle} onChange={handleChange} required className={inputClasses(!!errors.workTitle)} />
                            {errors.workTitle && <p className="mt-1 text-sm text-red-500">{errors.workTitle}</p>}
                        </div>

                        <div>
                            <label htmlFor="workSummary" className="block text-sm font-medium text-gray-700">Resumen del Trabajo (250 palabras máx.)</label>
                            <textarea id="workSummary" name="workSummary" rows={6} value={formData.workSummary} onChange={handleChange} required className={inputClasses(!!errors.workSummary)}></textarea>
                            {errors.workSummary && <p className="mt-1 text-sm text-red-500">{errors.workSummary}</p>}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button type="submit" disabled={status === 'submitting'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-gold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">

                            {status === 'submitting' ? 'Enviando...' : 'Enviar Inscripción'}
                        </button>
                    </div>
                    {status === 'error' && <p className="mt-4 text-center text-sm text-red-500">Hubo un error al enviar la inscripción. Por favor, inténtalo de nuevo.</p>}
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
