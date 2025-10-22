import { VStack, Button } from '@chakra-ui/react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useSidebar } from "../../context/SidebarContext";
import {
    RiHome2Line,
    RiServerLine,
    RiTeamLine,
    RiContactsLine,
    RiBookOpenLine,
    RiBarChart2Line,
    RiCloseLine,
} from "react-icons/ri";

// Secciones que tendrá InfoPanelC (más adelante les pondrás id)
const SECTIONS = [
    { id: 'about', icon: "RiTeamLine", label: "Nosotros" },
    { id: 'rules', icon: "RiBookOpenLine", label: "Reglas" },
    { id: 'contact', icon: "RiContactsLine", label: "Contacto" },
];

export const SidebarInfoButtons = () => {
    // eslint-disable-next-line no-unused-vars
    const active = useActiveSection(SECTIONS.map((s) => s.id));
    const { toggleSidebar } = useSidebar();
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <VStack spacing={2} align="stretch" w="full" px={2}>
            {SECTIONS.map((s) => (
                <Button
                    key={s.id}
                    leftIcon={<IconComponent />}
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    _hover={{ bg: "gray.200" }}
                    onClick={() => {
                        // En móvil, cerrar sidebar al hacer click
                        if (window.innerWidth < 1024) {
                            toggleSidebar();
                        }
                        scrollTo(s.id)
                    }}
                >
                    {s.label}
                </Button>
            ))}
        </VStack>
    );
};