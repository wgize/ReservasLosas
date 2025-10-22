// src/components/overlays/LoginOverlay.jsx
import { VStack, Input, Button, Text, Icon, HStack } from "@chakra-ui/react";
import { FiLogIn } from "react-icons/fi";
import OverlayContainer from "./OverlayContainer";

const LoginOverlay = ({ isOpen, onClose }) => (
    <OverlayContainer isOpen={isOpen} onClose={onClose}>
        <VStack spacing={4} align="stretch">
            <HStack>
                <Icon as={FiLogIn} color="teal.400" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold">Iniciar sesión</Text>
            </HStack>

            <Input placeholder="Usuario o correo" focusBorderColor="teal.400" />
            <Input type="password" placeholder="Contraseña" focusBorderColor="teal.400" />

            <Button colorScheme="teal">Entrar</Button>
            <Text fontSize="sm" textAlign="center" color="gray.400">
                ¿Olvidaste tu contraseña?
            </Text>
        </VStack>
    </OverlayContainer>
);

export default LoginOverlay;
