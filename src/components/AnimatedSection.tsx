import React, { useRef, useState, useEffect } from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string; // ← AGREGAR ESTA LÍNEA
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    className = '',
    id // ← AGREGAR ESTA LÍNEA
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            id={id} // ← AGREGAR ESTA LÍNEA
            className={`${className} transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;
