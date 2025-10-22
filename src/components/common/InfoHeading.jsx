import { Heading } from '@chakra-ui/react';

export const InfoHeading = ({ children, ...props }) => (
    <Heading
        as="h2"
        size="lg"
        color="teal.400"
        borderBottom="2px solid"
        borderColor="teal.200"
        pb={2}
        mb={3}
        {...props}
    >
        {children}
    </Heading>
);
