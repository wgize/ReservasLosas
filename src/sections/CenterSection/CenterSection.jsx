import { IconButton, useBreakpointValue, Box } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import ScrollContainer from "../../components/common/ScrollContainer";

const CenterSection = ({ onInfoOpen, children }) => {
    const showTrigger = useBreakpointValue({ base: true, lg: false });

    return (
        <Box pos="relative" w="full" h="full" py={3}>
            {showTrigger && (
                <IconButton
                    aria-label="Abrir panel de información"
                    icon={<ArrowForwardIcon />}
                    onClick={onInfoOpen}
                    pos="absolute"
                    top={4}
                    right={4}
                    zIndex={10}
                    size="sm"
                    colorScheme="teal"
                    variant="solid"
                    rounded="full"
                />
            )}

            <ScrollContainer>{children}</ScrollContainer>
        </Box>
    );
};

export default CenterSection;
