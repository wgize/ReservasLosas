// src/components/overlays/StoreOverlay.jsx
import { VStack, Text, Button, Image } from "@chakra-ui/react";
import OverlayContainer from "./OverlayContainer";

const StoreOverlay = ({ isOpen, onClose }) => {
    const redirect = () => {
        window.open("https://tienda-gaialand.com", "_blank");
        onClose();
    };

    return (
        <OverlayContainer isOpen={isOpen} onClose={onClose}>
            <VStack spacing={4} align="center">
                <Image src="/assets/store_thanks.png" boxSize="120px" alt="Tienda" />
                <Text fontSize="xl" fontWeight="bold">¡Gracias por apoyar el proyecto!</Text>
                <Text fontSize="sm" textAlign="center">
                    Serás redirigido a la tienda oficial para obtener objetos y beneficios exclusivos.
                </Text>
                <Button colorScheme="teal" onClick={redirect}>Ir a la tienda</Button>
            </VStack>
        </OverlayContainer>
    );
};

export default StoreOverlay;
