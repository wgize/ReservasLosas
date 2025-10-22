import { Box } from '@chakra-ui/react';

export const ScrollBox = ({ children, maxH = '300px', ...props }) => (
    <Box
        maxH={maxH}
        overflowY="auto"
        pr={2}
        css={{
            '&::-webkit-scrollbar': { w: '4px' },
            '&::-webkit-scrollbar-thumb': {
                bg: 'gray.300',
                borderRadius: '24px',
            },
        }}
        {...props}
    >
        {children}
    </Box>
);