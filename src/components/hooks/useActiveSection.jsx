import { useEffect, useState } from 'react';

export const useActiveSection = (sectionIds, options = {}) => {
    const { rootMargin = '-100px 0px -66%', threshold = 0.2 } = options;
    const [active, setActive] = useState(sectionIds[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin, threshold }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds, rootMargin, threshold]);

    return active;
};