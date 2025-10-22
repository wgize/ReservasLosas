import { VStack, Box } from "@chakra-ui/react";
import DiscordCard from "../../../sections/InfoPanel/Info/DiscordCard";
import ServerStatusCard from "../../../sections/InfoPanel/Info/ServerStatusCard";
import EventsCard from "../../../sections/InfoPanel/Info/EventsCard";
import MembersCard from "../../../sections/InfoPanel/Info/MembersCard";
import NewsCard from "../../../sections/InfoPanel/Info/NewsCard";
import ScrollableBox from "../../common/ScrollableBox";

const InfoPanel = () => {
  return (
    <Box
      h="100%"
      overflowY="auto"
      px={{ base: 2, md: 0 }}
      bg={{ base: "gray.50", md: "transparent" }}
      w="100%"
      py={3}
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.400",
          borderRadius: "3px",
        },
      }}
    >
      <VStack spacing={4} align="stretch" w="100%">
        <DiscordCard />
        <ServerStatusCard />
        <EventsCard />
        <MembersCard />
      </VStack>
    </Box>
  );
};

export default InfoPanel;
