import {
  Box,
  Flex,
  Text,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import { FaThumbtack, FaComment, FaEye, FaClock, FaHashtag } from 'react-icons/fa';

// eslint-disable-next-line no-unused-vars
const ForumCard = ({ post, isSubCategory = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      mb={3}
      transition="all 0.2s"
      _hover={{
        bg: hoverBgColor,
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      cursor="pointer"
      position="relative"
      overflow="hidden"
    >
      {/* Efecto de brillo para posts fijados */}
      {post.pinned && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="2px"
          bg="linear-gradient(90deg, #9D5CFF, #5B86E5)"
          opacity={0.8}
        />
      )}

      <Flex align="start" justify="space-between">
        <Box flex="1">
          <Flex align="center" gap={3} mb={2}>
            {post.pinned && (
              <Tooltip label="Post Fijado" placement="top">
                <Icon
                  as={FaThumbtack}
                  color="purple.500"
                  fontSize="sm"
                  transform="rotate(-45deg)"
                />
              </Tooltip>
            )}

            <Text
              fontSize="lg"
              fontWeight="bold"
              color={textColor}
              _hover={{ color: 'purple.500' }}
              transition="color 0.2s"
            >
              {post.title}
            </Text>
          </Flex>

          {/* Tags */}
          <HStack spacing={2} mb={3} flexWrap="wrap">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                colorScheme="purple"
                variant="subtle"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1} align="center">
                  <Icon as={FaHashtag} fontSize="xs" />
                  <Text>{tag}</Text>
                </HStack>
              </Badge>
            ))}
          </HStack>

          {/* Información del autor y actividad */}
          <Flex
            align="center"
            gap={4}
            fontSize="sm"
            color={mutedColor}
            flexWrap="wrap"
          >
            <Text>
              Por: <Text as="span" color={textColor} fontWeight="medium">{post.author}</Text>
            </Text>

            <Divider orientation="vertical" height="20px" />

            <HStack spacing={1}>
              <Icon as={FaClock} fontSize="xs" />
              <Text>{post.lastActivity}</Text>
            </HStack>

            <Divider orientation="vertical" height="20px" />

            <HStack spacing={4}>
              <HStack spacing={1}>
                <Icon as={FaComment} fontSize="xs" />
                <Text fontWeight="medium">{post.replies}</Text>
              </HStack>

              <HStack spacing={1}>
                <Icon as={FaEye} fontSize="xs" />
                <Text fontWeight="medium">{post.views}</Text>
              </HStack>
            </HStack>
          </Flex>
        </Box>

        {/* Indicador visual para posts activos */}
        {post.replies > 20 && (
          <Box
            position="absolute"
            top={2}
            right={2}
            w={3}
            h={3}
            bg="green.400"
            borderRadius="full"
            animation="pulse 2s infinite"
          />
        )}
      </Flex>
    </Box>
  );
};

export default ForumCard;