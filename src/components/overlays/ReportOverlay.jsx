// src/components/overlays/ReportOverlay.jsx
import {
    VStack, HStack, Text, Input, Textarea, Button, Icon, Image,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiUploadCloud } from "react-icons/fi";
import OverlayContainer from "./OverlayContainer";

const ReportOverlay = ({ isOpen, onClose }) => (
    <OverlayContainer isOpen={isOpen} onClose={onClose}>
        <VStack spacing={4} align="stretch">
            <HStack spacing={2}>
                <Icon as={FiAlertTriangle} color="red.400" boxSize={6} />
                <Text fontSize="xl" fontWeight="bold">Enviar reporte</Text>
            </HStack>

            <Input placeholder="Asunto del reporte" focusBorderColor="red.400" />
            <Textarea placeholder="Describe el problema..." rows={5} focusBorderColor="red.400" />
            <Button leftIcon={<FiUploadCloud />} variant="outline" borderColor="red.300">
                Subir imagen
            </Button>

            <Button colorScheme="red" onClick={onClose}>Enviar</Button>
        </VStack>
    </OverlayContainer>
);

export default ReportOverlay;
