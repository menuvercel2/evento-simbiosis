import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return null;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearTimeout(timer);
    });

    if (!timeLeft) {
        return <div className="text-xl font-semibold text-gray-500">El período de inscripción ha finalizado.</div>;
    }

    const timeParts = [
        { label: 'Días', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
        { label: 'Segundos', value: timeLeft.seconds },
    ];

    return (
        <div className="flex justify-center gap-4 md:gap-8">
            {timeParts.map((part) => (
                <div key={part.label} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-gold to-secondary-blue">
                        {String(part.value).padStart(2, '0')}
                    </span>
                    <span className="text-sm uppercase tracking-wider text-gray-500">{part.label}</span>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;
