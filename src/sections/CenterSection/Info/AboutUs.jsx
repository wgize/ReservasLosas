// AboutUs.jsx
import {
    Box,
    Heading,
    Text,
    VStack,
    useColorModeValue,
    Divider,
    Container,
} from "@chakra-ui/react";

export const AboutUs = () => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const text = useColorModeValue("gray.700", "gray.300");

    return (
        <Box bg={bg} py={10}>
            <Container maxW="6xl">
                <VStack align="start" spacing={4}>
                    <Heading as="h2" size="lg" color={useColorModeValue("gray.800", "white")}>
                        Sobre Nosotros
                    </Heading>
                    <Divider borderColor={useColorModeValue("gray.200", "gray.600")} />
                    <Text fontSize="md" color={text}>
                        Este espacio fue creado para compartir artículos, noticias y análisis sobre
                        tecnología, desarrollo e innovación. Nuestro objetivo es ofrecer contenido
                        actualizado, de calidad y relevante para la comunidad.
                    </Text>
                    <Text fontSize="md" color={text}>
                        Buscamos fomentar la colaboración y el aprendizaje continuo entre estudiantes,
                        profesionales y entusiastas del sector. Valoramos el conocimiento abierto y la
                        participación activa.
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
};
