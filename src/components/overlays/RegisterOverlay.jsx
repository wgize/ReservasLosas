// src/components/overlays/RegisterOverlay.jsx
import { VStack, Input, Button, Text, Icon, HStack } from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import OverlayContainer from "./OverlayContainer";

const RegisterOverlay = ({ isOpen, onClose }) => (
    <OverlayContainer isOpen={isOpen} onClose={onClose}>
        <VStack spacing={4} align="stretch">
            <HStack>
                <Icon as={FiUserPlus} color="purple.400" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold">Registro de nuevo jugador</Text>
            </HStack>

            <Input placeholder="Usuario" focusBorderColor="purple.400" />
            <Input placeholder="Correo electrónico" focusBorderColor="purple.400" />
            <Input type="password" placeholder="Contraseña" focusBorderColor="purple.400" />

            <Button colorScheme="purple">Registrar</Button>
        </VStack>
    </OverlayContainer>
);

export default RegisterOverlay;
