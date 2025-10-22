// Contact.jsx
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    IconButton,
    Link,
    useColorModeValue,
    Flex,
    Image,
    Container,
    Divider,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Contact = () => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const iconColor = useColorModeValue("gray.600", "gray.300");
    const text = useColorModeValue("gray.700", "gray.300");

    const socials = [
        {
            icon: FaGithub,
            label: "GitHub",
            href: "https://github.com/example",
        },
        {
            icon: FaLinkedin,
            label: "LinkedIn",
            href: "https://linkedin.com/in/example",
        },
        {
            icon: FaTwitter,
            label: "Twitter",
            href: "https://twitter.com/example",
        },
    ];

    return (
        <Box bg={bg} py={10}>
            <Container maxW="6xl">
                <VStack align="start" spacing={5}>
                    <Heading as="h2" size="lg">
                        Contacto
                    </Heading>
                    <Divider borderColor={useColorModeValue("gray.200", "gray.600")} />
                    <Flex
                        align="center"
                        justify="space-between"
                        direction={{ base: "column", md: "row" }}
                        gap={6}
                    >
                        <Text fontSize="md" color={text} flex="1">
                            Si deseas colaborar con el programador sin paga, aportar ideas o realizar
                            consultas, puedes contactarnos a través del correo o redes sociales.
                        </Text>

                        <Image
                            src="/src/resources/yape.png"
                            alt="Código QR de Yape"
                            boxSize={{ base: "120px", md: "150px" }}
                            borderRadius="md"
                            boxShadow="md"
                        />
                    </Flex>

                    <HStack spacing={5} pt={3}>
                        <Link href="mailto:contact@example.com">
                            <IconButton
                                aria-label="Correo electrónico"
                                icon={<EmailIcon />}
                                variant="ghost"
                                color={iconColor}
                                size="lg"
                            />
                        </Link>
                        {socials.map((s) => (
                            <Link key={s.label} href={s.href} isExternal>
                                <IconButton
                                    aria-label={s.label}
                                    icon={<s.icon />}
                                    variant="ghost"
                                    color={iconColor}
                                    size="lg"
                                />
                            </Link>
                        ))}
                    </HStack>
                </VStack>
            </Container>
        </Box>
    );
};
