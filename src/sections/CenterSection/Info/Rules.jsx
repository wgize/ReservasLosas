// Rules.jsx
import {
    Box,
    Heading,
    List,
    ListItem,
    ListIcon,
    useColorModeValue,
    Container,
    VStack,
    Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export const Rules = () => {
    const bg = useColorModeValue("white", "gray.900");
    const color = useColorModeValue("gray.700", "gray.300");

    const rules = [
        "Respeta a todos los miembros y evita lenguaje ofensivo.",
        "Publica solo contenido relacionado al tema del canal o foro.",
        "Verifica tus fuentes antes de compartir información.",
        "Evita el spam o autopromoción excesiva.",
        "Reporta cualquier actividad sospechosa a los administradores.",
    ];

    return (
        <Box bg={bg} py={10}>
            <Container maxW="6xl">
                <VStack align="start" spacing={4}>
                    <Heading as="h2" size="lg">
                        Normas de la Comunidad
                    </Heading>
                    <Divider borderColor={useColorModeValue("gray.200", "gray.600")} />
                    <List spacing={3} color={color}>
                        {rules.map((rule, index) => (
                            <ListItem key={index}>
                                <ListIcon as={CheckCircleIcon} color="green.400" />
                                {rule}
                            </ListItem>
                        ))}
                    </List>
                </VStack>
            </Container>
        </Box>
    );
};
