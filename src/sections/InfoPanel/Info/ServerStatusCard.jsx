import { HStack, Text, Box, Badge } from "@chakra-ui/react";
import InfoCard from "../../../components/ui/InfoCard";

const ServerStatusCard = () => (
    <InfoCard title="Estado del servidor">
        <HStack>
            <Badge colorScheme="green">Online</Badge>
            <Text fontSize="sm" color="gray.600">
                play.gaialand.example
            </Text>
        </HStack>
        <HStack mt={2}>
            <Box bg="green.100" px={3} py={1} borderRadius="md" fontSize="sm" color="green.800">
                Online
            </Box>
            <Box bg="gray.100" px={3} py={1} borderRadius="md" fontSize="sm" color="gray.600">
                0 jugadores
            </Box>
        </HStack>
    </InfoCard>
);

export default ServerStatusCard;
