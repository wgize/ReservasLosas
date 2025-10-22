// src/hooks/useSmartScroll.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollWithOffset } from '../components/utils/ScrollWithOffset';

export const useSmartScroll = (options = {}) => {
    const { hash } = useLocation();
    const {
        maxAttempts = 8,
        initialDelay = 500,
        onElementFound
    } = options;

    useEffect(() => {
        if (!hash || hash === '#') return;

        const id = hash.replace('#', '');
        let attemptCount = 0;

        const attemptScroll = () => {
            attemptCount++;
            const element = document.getElementById(id);

            if (element) {
                // Elemento encontrado, hacer scroll
                const success = scrollWithOffset(id);

                if (success && onElementFound) {
                    onElementFound(id, element);
                }

                return true;
            } else {
                // Elemento no encontrado, buscar en lugares alternativos
                if (attemptCount < maxAttempts) {
                    setTimeout(attemptScroll, initialDelay * attemptCount);
                } else {
                    // Último intento: buscar en acordeones cerrados
                    searchInClosedAccordions(id);
                }
                return false;
            }
        };

        const searchInClosedAccordions = (targetId) => {
            // Buscar en todos los acordeones cerrados
            const closedAccordions = document.querySelectorAll('.chakra-accordion__button[aria-expanded="false"]');

            closedAccordions.forEach((accordionButton, index) => {
                setTimeout(() => {
                    // Abrir el acordeón
                    accordionButton.click();

                    // Buscar el elemento después de abrir el acordeón
                    setTimeout(() => {
                        const element = document.getElementById(targetId);
                        if (element) {
                            scrollWithOffset(targetId);
                        }
                    }, 300);
                }, index * 400); // Stagger los openings
            });
        };

        // Primer intento después de un delay
        const timeoutId = setTimeout(attemptScroll, initialDelay);

        return () => clearTimeout(timeoutId);
    }, [hash, maxAttempts, initialDelay, onElementFound]);
};