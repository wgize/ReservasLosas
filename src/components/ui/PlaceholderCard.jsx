import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

const PlaceholderCard = ({ height = "150px", width = "100%", flex }) => {
  const placeholderBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      bg={placeholderBg}
      borderRadius="xl"
      boxShadow="sm"
      p={4}
      h={height}
      w={width}
      flex={flex}
      opacity={0.6}
      _hover={{ opacity: 0.8 }}
      transition="opacity 0.2s ease"
    />
  );
};

export default PlaceholderCard;