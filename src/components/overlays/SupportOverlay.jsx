// src/components/overlays/SupportOverlay.jsx
import {
    Box,
    Flex,
    IconButton,
    Text,
    VStack,
    HStack,
    Link,
    Fade,
    Divider,
} from "@chakra-ui/react";
import {
    RiWhatsappLine,
    RiDiscordLine,
    RiMailLine,
    RiCloseLine,
} from "react-icons/ri";
import OverlayContainer from "../overlays/OverlayContainer"
const contactList = [
    {
        label: "WhatsApp Soporte",
        icon: RiWhatsappLine,
        value: "+51 999 888 777",
        href: "https://wa.me/51999888777",
    },
    {
        label: "Discord",
        icon: RiDiscordLine,
        value: "support.gaialand",
        href: "https://discord.gg/",
    },
    {
        label: "Correo Técnico",
        icon: RiMailLine,
        value: "soporte@gaialand.com",
        href: "mailto:soporte@gaialand.com",
    },
];

const SupportOverlay = ({ isOpen, onClose }) => {
    return (
        <OverlayContainer isOpen={isOpen} onClose={onClose}>
            <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold" fontSize="lg">
                    Contacto de Soporte
                </Text>
                <IconButton
                    icon={<RiCloseLine />}
                    aria-label="Cerrar"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                />
            </Flex>

            <Divider mb={3} />

            <VStack spacing={3} align="stretch">
                {contactList.map((c) => (
                    <HStack
                        key={c.label}
                        spacing={3}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                        transition="all 0.2s"
                    >
                        <Box as={c.icon} boxSize={5} color="blue.500" />
                        <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{c.label}</Text>
                            <Link href={c.href} fontSize="sm" color="blue.600" isExternal>
                                {c.value}
                            </Link>
                        </VStack>
                    </HStack>
                ))}
            </VStack>
        </OverlayContainer>
    );
};

export default SupportOverlay;
