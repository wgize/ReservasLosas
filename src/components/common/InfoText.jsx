import { Text } from '@chakra-ui/react';

export const InfoText = ({ children, ...props }) => (
    <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall" {...props}>
        {children}
    </Text>
);
