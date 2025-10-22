import {
  Flex,
  IconButton,
  HStack,
  Box,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";
import SearchBar from "../../common/SearchBar";
import { useSidebar } from "../../../context/SidebarContext";
import { HeaderButtons } from "./HeaderButtons";
import { HeaderDrawer } from "./HeaderDrawer";
import { HeaderLogo } from "./HeaderLogo";
import { headerVisibility } from "./HeaderVisibility";

const Header = (openOverlay) => {
  const { toggleSidebar } = useSidebar();
  // eslint-disable-next-line no-unused-vars
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ShopButton, AuthButtons, ConnectButton } = HeaderButtons(openOverlay);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <>
      <Box
        as="header"
        w="100%"
        bg="white"
        position="sticky"
        top="0"
        zIndex="10"
        boxShadow="sm"
        borderTopRadius="xl"
      >
        <Flex
          align="center"
          justify="space-between"
          h="70px"
          px={{ base: 2, md: 5 }}
          gap={{ base: 3, md: 6 }}
        >
          {/* Botón hamburguesa solo en móvil */}
          {!isDesktop && (
            <IconButton
              aria-label="Abrir menú lateral"
              icon={<RiMenuLine />}
              variant="ghost"
              onClick={toggleSidebar}
              flexShrink={0}
            />
          )}

          <HeaderLogo />

          {/* Búsqueda */}
          <Box flex={1} minW={0} maxW="600px" display={headerVisibility.search}>
            <SearchBar placeholder="Buscar..." width="100%" />
          </Box>

          {/* Botones de acción */}
          <HStack spacing={{ base: 2, md: 3 }} flexShrink={0}>
            <Box display={headerVisibility.shop}>{ShopButton}</Box>
            <Box display={headerVisibility.connect}>{ConnectButton}</Box>
            <HStack spacing={3} display={headerVisibility.auth}>
              {AuthButtons}
            </HStack>
          </HStack>
        </Flex>
      </Box>

      {/* Drawer móvil */}
      <HeaderDrawer
        isOpen={isOpen}
        onClose={onClose}
        ShopButton={ShopButton}
        AuthButtons={AuthButtons}
        ConnectButton={ConnectButton}
      />
    </>
  );
};

export default Header;
