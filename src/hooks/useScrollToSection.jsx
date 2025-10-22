// src/hooks/useScrollToSection.js
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollWithOffset } from '../components/utils/ScrollWithOffset';

export const useScrollToSection = (options = {}) => {
    const { hash, pathname } = useLocation();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [targetId, setTargetId] = useState(null);
    const timeoutRef = useRef(null);
    const previousPathname = useRef(pathname);

    const {
        maxAttempts = 5,
        initialDelay = 300,
        retryDelay = 150,
        scrollToTopOnNoHash = true,
        enabled = true
    } = options;

    useEffect(() => {
        if (!enabled) return;

        // Resetear estado cuando cambia la página
        if (previousPathname.current !== pathname) {
            setHasScrolled(false);
            previousPathname.current = pathname;
        }

        // Limpiar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Si no hay hash o ya se hizo scroll
        if (!hash || hash === '#') {
            if (scrollToTopOnNoHash) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        if (hasScrolled) {
            return;
        }

        const id = hash.replace('#', '');
        setTargetId(id);
        setHasScrolled(true);

        const attemptScroll = (attempt = 0) => {
            const element = document.getElementById(id);

            if (element && element.offsetParent !== null) {
                // USAR scrollWithOffset aquí
                scrollWithOffset(id);
                console.log(`Scroll exitoso a: ${id} en intento ${attempt + 1}`);
            } else if (attempt < maxAttempts) {
                const nextDelay = retryDelay * (attempt + 1);
                console.log(`Intento ${attempt + 1} fallado para: ${id}, reintentando en ${nextDelay}ms`);
                timeoutRef.current = setTimeout(() => attemptScroll(attempt + 1), nextDelay);
            } else {
                console.warn(`No se pudo encontrar el elemento: ${id} después de ${maxAttempts} intentos`);
            }
        };

        // Primer intento después del delay inicial
        timeoutRef.current = setTimeout(() => {
            attemptScroll();
        }, initialDelay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [hash, hasScrolled, pathname, maxAttempts, initialDelay, retryDelay, scrollToTopOnNoHash, enabled]);

    // Función para forzar scroll manualmente
    const manualScrollTo = (id, customOptions = {}) => {
        setHasScrolled(false);
        setTargetId(id);

        const {
            maxAttempts: customMaxAttempts = maxAttempts,
            retryDelay: customRetryDelay = retryDelay,
            delay = 100
        } = customOptions;

        const attemptScroll = (attempt = 0) => {
            const element = document.getElementById(id);

            if (element && element.offsetParent !== null) {
                scrollWithOffset(id);
                setHasScrolled(true);
            } else if (attempt < customMaxAttempts) {
                setTimeout(() => attemptScroll(attempt + 1), customRetryDelay * (attempt + 1));
            }
        };

        setTimeout(() => attemptScroll(), delay);
    };

    const resetScroll = () => {
        setHasScrolled(false);
        setTargetId(null);
    };

    return {
        targetId,
        hasScrolled,
        manualScrollTo,
        resetScroll
    };
};

export const useAutoScroll = () => {
    return useScrollToSection();
};