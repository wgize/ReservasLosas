import {
  VStack,
  Button,
  IconButton,
  Box,
} from "@chakra-ui/react";
import {
  RiHome2Line,
  RiGamepadLine,
  RiChat3Line,
  RiShoppingBag3Line,
  RiAlertLine,
  RiBookOpenLine,
  RiCustomerService2Line,
  RiTeamLine,
  RiCloseLine,
} from "react-icons/ri";
import { NAV_ITEMS } from "../../../data/constants";
import { useSidebar } from "../../../context/SidebarContext";
import logo from "../../../resources/ima.png";
import { scrollToSection } from "../../common/ScrollToSection";
import { Link, useNavigate, useLocation } from "react-router-dom";

const iconMap = {
  RiHome2Line: RiHome2Line,
  RiGamepadLine: RiGamepadLine,
  RiChat3Line: RiChat3Line,
  RiShoppingBag3Line: RiShoppingBag3Line,
  RiAlertLine: RiAlertLine,
  RiBookOpenLine: RiBookOpenLine,
  RiCustomerService2Line: RiCustomerService2Line,
  RiTeamLine: RiTeamLine,
};


const Sidebar = ({ openOverlay }) => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = async (item) => {
    // Si el item abre un overlay, no navegar
    if (item.overlay) {
      openOverlay(item.overlay);
      if (window.innerWidth < 1024) toggleSidebar();
      return;
    }

    const currentUrl = new URL(window.location.href);
    const currentPath = currentUrl.pathname;
    const targetPath = item.path;
    const targetUrl = item.path + (item.id ? `#${item.id}` : "");

    if (currentPath === targetPath) {
      if (item.id) {
        if (location.hash === `#${item.id}`) {
          setTimeout(() => scrollToSection(item.id), 80);
        } else {
          navigate(targetUrl);
          setTimeout(() => scrollToSection(item.id), 350);
        }
      } else {
        window.location.href = targetPath;
      }
    } else {
      navigate(targetUrl);
    }

    if (window.innerWidth < 1024) toggleSidebar();
  };
  return (
    <VStack
      w="100%"
      h="100%"
      bg="white"
      spacing={6}
      align="stretch"
      pb={6}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow={{ base: "2xl", lg: "md" }}
      overflow="hidden"
    >
      {/* Logo superior (sin cambios) */}
      <Box w="100%" h="140px" bg="gray.100" position="relative" borderTopRadius="lg" overflow="hidden"
        display={{ base: "none", sm: "none", md: "none", lg: "block" }}
      >
        <Box as="img" src={logo} alt="Logo del servidor" w="100%" h="100%" objectFit="cover" />
        <IconButton
          icon={<RiCloseLine />}
          aria-label="Cerrar sidebar"
          variant="ghost"
          size="sm"
          position="absolute"
          top="8px"
          right="8px"
          onClick={toggleSidebar}
          display={{ base: "block", lg: "none" }}
          bg="rgba(255,255,255,0.6)"
          _hover={{ bg: "rgba(255,255,255,0.9)" }}
        />
      </Box>

      {/* Botones de navegación */}
      <VStack spacing={3} px={2} flex="1" overflowY="auto" pt={{ base: 2, lg: 0 }}>
        {NAV_ITEMS.map((item) => {
          const IconComponent = iconMap[item.icon];

          return (
            <Button
              key={item.label}
              leftIcon={<IconComponent />}
              variant="ghost"
              justifyContent="flex-start"
              w="full"
              fontWeight="medium"
              colorScheme="gray"
              transition="all 0.2s"
              _hover={{
                bg: "gray.200",
                transform: "translateX(3px)",
              }}
              _active={{ bg: "gray.300", transform: "translateX(2px)" }}
              onClick={() => handleNavigation(item)}
            >
              {item.label}
            </Button>
          );
        })}
      </VStack>
    </VStack>
  );
};
export default Sidebar;