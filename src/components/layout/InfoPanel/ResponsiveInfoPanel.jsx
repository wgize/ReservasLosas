import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useBreakpointValue,
    Box,
} from "@chakra-ui/react";
import InfoPanel from "./InfoPanel";

const ResponsiveInfoPanel = ({ isOpen, onClose }) => {
    const drawerSize = useBreakpointValue({ base: "xs", sm: "xs", md: "xs", lg: "sm" });

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={drawerSize}>
            <DrawerOverlay />
            <Box
                as={DrawerContent}
                // margen superior e inferior en móvil
                my={{ base: 6, sm: 8 }}
                ml={{ base: 4, sm: 6 }}
                mr={{ base: 4, sm: 4 }}
                borderRadius={{ base: "xl", md: "none" }}
                borderWidth={{ base: "1px", md: "0" }}
                borderColor="gray.300"
                boxShadow={{ base: "2xl", md: "md" }}
                overflow="hidden"
                bg="white"
                maxH={{ base: "calc(100% - 3rem)", sm: "calc(100% - 4rem)" }}
            >
                <DrawerCloseButton />
                <DrawerHeader
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    fontWeight="bold"
                >
                    Información
                </DrawerHeader>
                <DrawerBody p={0} overflowY="auto">
                    <InfoPanel />
                </DrawerBody>
            </Box>
        </Drawer>
    );
};

export default ResponsiveInfoPanel;
