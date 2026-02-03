import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../components/icons/Icons';
import { RegistrationData } from '../types';
import { COMMISSIONS } from '../constants';

interface ApiResponse {
    success: boolean;
    message: string;
    errors?: string[];
    data?: {
        id: number;
        full_name: string;
        email: string;
        created_at: string;
    };
}

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
    const [apiError, setApiError] = useState<string>('');
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [registrationId, setRegistrationId] = useState<number | null>(null);
    const [isCommissionOpen, setIsCommissionOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside listener for commission dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCommissionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCommissionSelect = (value: string) => {
        setFormData(prev => ({ ...prev, commission: value }));
        setIsCommissionOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegistrationData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        // Limpiar errores de API cuando el usuario empiece a escribir
        if (apiError) setApiError('');
        if (apiErrors.length > 0) setApiErrors([]);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<RegistrationData> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es obligatorio.';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'El nombre debe tener al menos 3 caracteres.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El formato del correo electrónico no es válido.';
        }

        if (!formData.institution.trim()) {
            newErrors.institution = 'La institución es obligatoria.';
        } else if (formData.institution.trim().length < 3) {
            newErrors.institution = 'La institución debe tener al menos 3 caracteres.';
        }

        if (!formData.workTitle.trim()) {
            newErrors.workTitle = 'El título del trabajo es obligatorio.';
        } else if (formData.workTitle.trim().length < 5) {
            newErrors.workTitle = 'El título debe tener al menos 5 caracteres.';
        }

        if (!formData.workSummary.trim()) {
            newErrors.workSummary = 'El resumen del trabajo es obligatorio.';
        } else if (formData.workSummary.trim().length < 50) {
            newErrors.workSummary = 'El resumen debe tener al menos 50 caracteres.';
        } else if (formData.workSummary.length > 5000) {
            newErrors.workSummary = 'El resumen no puede exceder 5000 caracteres.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Limpiar errores previos
        setApiError('');
        setApiErrors([]);

        if (!validateForm()) return;

        setStatus('submitting');

        const payload = {
            full_name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            institution: formData.institution.trim(),
            phone: formData.phone.trim() || null,
            commission_id: COMMISSIONS.indexOf(formData.commission) + 1,
            work_title: formData.workTitle.trim(),
            work_summary: formData.workSummary.trim(),
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                // Manejar diferentes tipos de errores
                if (response.status === 409) {
                    // Email duplicado
                    setErrors(prev => ({ ...prev, email: data.message }));
                    setApiError(data.message);
                } else if (response.status === 400 && data.errors) {
                    // Errores de validación del servidor
                    setApiErrors(data.errors);
                    setApiError(data.message);
                } else {
                    // Otros errores
                    setApiError(data.message || 'Error al procesar la solicitud.');
                }
                setStatus('error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Éxito
            if (data.success && data.data) {
                setStatus('success');
                setRegistrationId(data.data.id);

                // Resetear el formulario
                setFormData({
                    fullName: '',
                    email: '',
                    institution: '',
                    phone: '',
                    commission: COMMISSIONS[0],
                    workTitle: '',
                    workSummary: '',
                });

                // Scroll al inicio para ver el mensaje de éxito
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error) {
            console.error('Failed to submit registration:', error);

            // SIMULATION FOR DEVELOPMENT (If backend is offline)
            if (import.meta.env.DEV) {
                console.warn("⚠️ DEV MODE: Backend unreachable. Simulating success for UI testing.");
                setTimeout(() => {
                    setStatus('success');
                    setRegistrationId(Math.floor(Math.random() * 1000) + 1); // Random ID
                    setFormData({
                        fullName: '',
                        email: '',
                        institution: '',
                        phone: '',
                        commission: COMMISSIONS[0],
                        workTitle: '',
                        workSummary: '',
                    });
                    // Set a flag to show this was a simulation (optional, but good for clarity)
                    setApiError('SIMULACIÓN: Backend no detectado (puerto 3000 cerrado). Se simuló un registro exitoso.');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 1000);
                return;
            }

            setApiError('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
            setStatus('error');
        }
    };

    const handleNewRegistration = () => {
        setStatus('idle');
        setErrors({});
        setApiError('');
        setApiErrors([]);
        setRegistrationId(null);
    };

    const inputClasses = (hasError: boolean) =>
        `mt-1 block w-full px-4 py-3 bg-gray-50 border ${hasError ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-primary-gold'} focus:border-transparent sm:text-sm text-dark-text placeholder-gray-400 transition-colors`;

    // Pantalla de éxito
    if (status === 'success') {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center animate-fade-in-up max-w-2xl mx-auto">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                {apiError && apiError.includes('SIMULACIÓN') && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm font-semibold">
                        ⚠️ MODO PRUEBA: El backend no está conectado. Este es un registro simulado.
                    </div>
                )}
                <h2 className="text-3xl font-bold text-primary-gold mb-4">¡Inscripción Exitosa!</h2>
                <p className="text-gray-600 mb-2">Gracias por inscribirte. Hemos recibido tus datos correctamente.</p>
                {registrationId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Número de registro: <span className="font-bold text-primary-gold">#{registrationId}</span>
                    </p>
                )}
                <button
                    onClick={handleNewRegistration}
                    className="bg-primary-gold text-white font-bold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg"
                >
                    Realizar otra inscripción
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-dark-text">
                    Formulario de Inscripción
                </h1>

                {/* Mensaje de error general de la API */}
                {status === 'error' && apiError && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
                                {apiErrors.length > 0 && (
                                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                        {apiErrors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-6">
                        {/* Nombre Completo */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Nombre Completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className={inputClasses(!!errors.fullName)}
                                placeholder="Ej: Juan Pérez García"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClasses(!!errors.email)}
                                placeholder="ejemplo@gmail.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Institución */}
                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                                Institución <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                required
                                className={inputClasses(!!errors.institution)}
                                placeholder="Universidad ... Facultad .."
                            />
                            {errors.institution && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.institution}
                                </p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClasses(false)}
                                placeholder="+5312345678"
                            />
                        </div>

                        {/* Comisión */}
                        <div ref={dropdownRef} className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Área Temática <span className="text-red-500">*</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsCommissionOpen(!isCommissionOpen)}
                                className={`relative w-full bg-white border ${isCommissionOpen ? 'border-primary-gold ring-2 ring-primary-gold' : 'border-gray-300'
                                    } rounded-lg shadow-sm pl-4 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-gold focus:border-primary-gold sm:text-sm transition-all duration-200`}
                            >
                                <span className="block truncate text-dark-text">{formData.commission}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon
                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isCommissionOpen ? 'transform rotate-180' : ''}`}
                                        aria-hidden="true"
                                    />
                                </span>
                            </button>

                            {isCommissionOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-fade-in">
                                    {COMMISSIONS.map((commission) => (
                                        <div
                                            key={commission}
                                            className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-primary-gold/10 transition-colors ${formData.commission === commission ? 'text-primary-gold font-bold bg-primary-gold/5' : 'text-gray-900'
                                                }`}
                                            onClick={() => handleCommissionSelect(commission)}
                                        >
                                            <span className="block truncate">
                                                {commission}
                                            </span>
                                            {formData.commission === commission && (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-gold">
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Título del Trabajo */}
                        <div>
                            <label htmlFor="workTitle" className="block text-sm font-medium text-gray-700">
                                Título del Trabajo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="workTitle"
                                name="workTitle"
                                value={formData.workTitle}
                                onChange={handleChange}
                                required
                                className={inputClasses(!!errors.workTitle)}
                                placeholder="Título descriptivo de tu investigación"
                            />
                            {errors.workTitle && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.workTitle}
                                </p>
                            )}
                        </div>

                        {/* Resumen del Trabajo */}
                        <div>
                            <label htmlFor="workSummary" className="block text-sm font-medium text-gray-700">
                                Resumen del Trabajo <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs ml-2">
                                    (Mínimo 50 caracteres, máximo 5000)
                                </span>
                            </label>
                            <textarea
                                id="workSummary"
                                name="workSummary"
                                rows={6}
                                value={formData.workSummary}
                                onChange={handleChange}
                                required
                                className={inputClasses(!!errors.workSummary)}
                                placeholder="Describe tu trabajo de investigación..."
                            />
                            <div className="mt-1 flex justify-between items-start">
                                <div className="flex-1">
                                    {errors.workSummary && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.workSummary}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs ${formData.workSummary.length > 5000 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {formData.workSummary.length} / 5000
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-gold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Inscripción'
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        <span className="text-red-500">*</span> Campos obligatorios
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
