import { Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const SidebarButton = ({ item, IconComponent, active, toggleSidebar }) => {
    const location = useLocation();

    const handleClick = (e) => {
        const samePage = location.pathname === item.path;
        const isSmallScreen = window.innerWidth < 1024;

        if (samePage && item.sectionId) {
            e.preventDefault(); // evita el salto instantáneo del Link

            const target = document.getElementById(item.sectionId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });

                // corta la animación a los 2 s para no ser molesta
                setTimeout(() => {
                    window.scrollTo({ top: target.offsetTop, behavior: "auto" });
                }, 2000);
            }
        }

        if (isSmallScreen) toggleSidebar();
    };

    return (
        <Button
            key={item.label}
            as={Link}
            to={item.path}
            leftIcon={<IconComponent />}
            variant="ghost"
            justifyContent="flex-start"
            w="full"
            fontWeight="medium"
            colorScheme="gray"
            transition="all 0.2s"
            bg={active ? "gray.200" : undefined}
            _hover={{
                bg: "gray.200",
                transform: "translateX(3px)",
            }}
            onClick={handleClick}
        >
            {item.label}
        </Button>
    );
};

export default SidebarButton;
