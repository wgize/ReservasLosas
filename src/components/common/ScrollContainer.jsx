import { Box } from "@chakra-ui/react";

const ScrollContainer = ({ children }) => (
    <Box
        h="full"
        w="full"
        overflowY="auto"
        overflowX="hidden"
        px={2}
        css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
                background: "#b0b0b0",
                borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "#999",
            },
        }}
    >
        {children}
    </Box>
);

export default ScrollContainer;
