// src/components/common/index.jsx
import { Box, Heading, Text } from '@chakra-ui/react'

export const InfoHeading = ({ children }) => (
    <Heading size="md" color="teal.300">
        {children}
    </Heading>
)

export const InfoText = ({ children }) => (
    <Text fontSize="md" color="gray.200">
        {children}
    </Text>
)

export const RuleCard = ({ title, description }) => (
    <Box
        bg="gray.700"
        p={4}
        borderRadius="md"
        boxShadow="md"
        w="full"
    >
        <Heading size="sm" color="teal.300" mb={2}>
            {title}
        </Heading>
        <Text color="gray.200">{description}</Text>
    </Box>
)

