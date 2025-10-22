import { Box, HStack, Divider, useColorModeValue } from "@chakra-ui/react";

const InfoCard = ({ title, action, children,...props}) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="xl"
      boxShadow="sm"
      p={4}
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s ease"
      {...props}
    >
      <HStack justify="space-between" mb={2} align="center">
        <Box fontWeight="bold">{title}</Box>
        {action}
      </HStack>
      <Divider mb={3} />
      {children}
    </Box>
  );
};

export default InfoCard;
