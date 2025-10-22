import { Text } from "@chakra-ui/react";
import InfoCard from "../../../components/ui/InfoCard";

const MembersCard = () => (
    <InfoCard title="Miembros online">
        <Text fontSize="sm" color="gray.600">
            Ninguno conectado
        </Text>
    </InfoCard>
);

export default MembersCard;
