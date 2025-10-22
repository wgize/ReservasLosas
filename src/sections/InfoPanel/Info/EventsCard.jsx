import { Box, Text } from "@chakra-ui/react";
import InfoCard from "../../../components/ui/InfoCard";
import ScrollableBox from "../../../components/common/ScrollableBox";
import { EVENTOS } from "../../../data/constants";

const EventsCard = () => (
    <InfoCard title="Próximos eventos">
        <ScrollableBox maxH="150px">
            <Box fontSize="sm" color="gray.600">
                {EVENTOS.map((event) => (
                    <Box key={event.title} mb={2}>
                        <Text fontWeight="bold" color="gray.700">
                            {event.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {event.desc}
                        </Text>
                    </Box>
                ))}
            </Box>
        </ScrollableBox>
    </InfoCard>
);

export default EventsCard;
