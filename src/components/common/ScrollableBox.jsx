// components/layout/InfoPanel/ScrollableBox.jsx
import { Box } from "@chakra-ui/react";

const ScrollableBox = ({ maxH = "300px", children }) => (
    <Box
        maxH={maxH}
        overflowY="auto"
        css={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
                background: "gray.300",
                borderRadius: "12px",
            },
        }}
    >
        {children}
    </Box>
);

export default ScrollableBox;
