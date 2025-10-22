import {
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useSidebar } from "../../../context/SidebarContext";
import Sidebar from "./Sidebar";

const SidebarWrapper = ({ openOverlay }) => {
    const { isSidebarOpen, closeSidebar } = useSidebar();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    if (isMobile) {
        return (
            <Drawer isOpen={isSidebarOpen} placement="left" onClose={closeSidebar}>
                <DrawerOverlay />
                <Box
                    as={DrawerContent}
                    maxW={{ base: "60%", sm: "40%" }}
                    my={{ base: 6, sm: 8 }}
                    ml={{ base: 4, sm: 6 }}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    boxShadow="2xl"
                    overflow="hidden"
                    maxH={{ base: "calc(100% - 3rem)", sm: "calc(100% - 4rem)" }}
                >
                    <Sidebar openOverlay={openOverlay} />
                </Box>
            </Drawer>
        );
    }

    return (
        <Box
            as="aside"
            w="260px"
            h="calc(100vh - 1.5rem)"
            mt="0.75rem"
            ml="0.75rem"
            bg="white"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="xl"
            position="sticky"
            top="0.75rem"
            overflow="hidden"
            flexShrink={0}
        >
            <Sidebar />
        </Box>
    );
};

export default SidebarWrapper;
