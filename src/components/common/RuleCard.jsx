import { HStack, Box, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export const RuleCard = ({ rule, desc }) => (
  <HStack align="start" spacing={3}>
    <CheckCircleIcon color="green.400" mt={1} />
    <Box>
      <Text fontWeight="bold" fontSize="md">
        {rule}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {desc}
      </Text>
    </Box>
  </HStack>
);