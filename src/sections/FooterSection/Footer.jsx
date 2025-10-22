// Footer.jsx
import {
    Box,
    Container,
    SimpleGrid,
    Text,
    Stack,
    Link,
    IconButton,
    useColorModeValue,
    Divider,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
    const bg = useColorModeValue("gray.100", "gray.900");
    const color = useColorModeValue("gray.700", "gray.300");
    const iconColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Box bg={bg} color={color} borderTop="1px solid" borderColor="gray.200" id="nosotros">
            <Container as={Stack} maxW="6xl" py={10} spacing={8}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                    {/* Sección 1 */}
                    <Stack spacing={3}>
                        <Text fontWeight="bold" fontSize="lg">
                            Comunidad Tech
                        </Text>
                        <Text fontSize="sm">
                            Un espacio para compartir conocimiento, fomentar el desarrollo y conectar
                            mentes creativas.
                        </Text>
                    </Stack>

                    {/* Sección 2 */}
                    <Stack spacing={3}>
                        <Text fontWeight="bold" fontSize="lg">
                            Enlaces Rápidos
                        </Text>
                        <Link href="#nosotros">Sobre Nosotros</Link>
                        <Link href="#Reglas">Normas</Link>
                        <Link href="#Contacto">Contacto</Link>
                    </Stack>

                    {/* Sección 3 */}
                    <Stack spacing={3}>
                        <Text fontWeight="bold" fontSize="lg">
                            Síguenos
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <IconButton
                                as={Link}
                                href="https://github.com/example"
                                aria-label="GitHub"
                                icon={<FaGithub />}
                                variant="ghost"
                                color={iconColor}
                                _hover={{ color: "blue.500" }}
                            />
                            <IconButton
                                as={Link}
                                href="https://linkedin.com/in/example"
                                aria-label="LinkedIn"
                                icon={<FaLinkedin />}
                                variant="ghost"
                                color={iconColor}
                                _hover={{ color: "blue.500" }}
                            />
                            <IconButton
                                as={Link}
                                href="https://twitter.com/example"
                                aria-label="Twitter"
                                icon={<FaTwitter />}
                                variant="ghost"
                                color={iconColor}
                                _hover={{ color: "blue.500" }}
                            />
                        </Stack>
                    </Stack>
                </SimpleGrid>

                <Divider borderColor="gray.300" />

                <Text fontSize="sm" textAlign="center" pt={2}>
                    © {new Date().getFullYear()} Comunidad Tech. Todos los derechos reservados.
                </Text>
            </Container>
        </Box>
    );
};

export default Footer;
