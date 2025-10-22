// NewsBanner.jsx
import { Box, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import imajoin from "../../resources/mine1.jpg";
const MotionBox = motion(Box);

const JoinBanner = () => {
  return (
    <MotionBox
      id="inicio"
      w="100%"
      h={{ base: "100px", md: "200px" }}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
      bgImage={imajoin}
      bgSize="cover"
      bgPosition="center"
      boxShadow="xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      {/* capa de oscurecimiento */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0, 0, 0, 0.45)"
        backdropFilter="blur(0.5px)"
      />

      {/* Contenido */}
      <Flex
        position="relative"
        zIndex="1"
        h="100%"
        align="center"
        justify="space-between"
        px={{ base: 6, md: 12 }}
      >
        <VStack align="start" spacing={3} color="white">
          <Box mr={5}>
            <Text fontSize={{ base: "sm", md: "3xl" }} fontWeight="bold">
              Here to play Minecraft?
            </Text>
            <Text fontSize={{ base: "xs", md: "lg" }} opacity={0.9}>
              Join and start playing on our Minecraft server now!
            </Text>
          </Box>
        </VStack>

        <Button
          variant="outline"
          colorScheme="whiteAlpha"
          size={{ base: "md", md: "lg" }}
          borderWidth="2px"
          borderColor="whiteAlpha.800"
          _hover={{
            bg: "whiteAlpha.200",
            transform: "translateY(-2px) scale(1.05)",
            boxShadow: "0 8px 20px rgba(255,255,255,0.2)",
          }}
          _active={{
            transform: "translateY(0)",
            boxShadow: "0 4px 10px rgba(255,255,255,0.1)",
          }}
          transition="all 0.2s ease"
        >
          <Text fontSize={{ base: "xs", sm: "sm" }} textTransform="uppercase">
            GO ?
          </Text>
        </Button>
      </Flex>
    </MotionBox>
  );
};

export default JoinBanner;
