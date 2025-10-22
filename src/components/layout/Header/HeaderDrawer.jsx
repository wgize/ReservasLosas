import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
} from "@chakra-ui/react";

export const HeaderDrawer = ({ isOpen, onClose, ShopButton, AuthButtons, ConnectButton }) => (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menú</DrawerHeader>
            <DrawerBody>
                <VStack spacing={4} align="stretch">
                    {ShopButton}
                    {AuthButtons}
                    {ConnectButton}
                </VStack>
            </DrawerBody>
        </DrawerContent>
    </Drawer>
);
