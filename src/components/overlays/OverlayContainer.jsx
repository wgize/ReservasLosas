// src/components/overlays/OverlayContainer.jsx
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";

const OverlayContainer = ({ isOpen, onClose, children, maxW = { base: "xs", lg: "md" } }) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900" color="white" borderRadius="xl" maxW={maxW} p={4}>
            <ModalCloseButton />
            <ModalBody>{children}</ModalBody>
        </ModalContent>
    </Modal>
);

export default OverlayContainer;
