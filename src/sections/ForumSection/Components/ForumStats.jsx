import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  HStack,
  Badge,
  Divider,
  Avatar,
  Tooltip,
  AvatarGroup
} from '@chakra-ui/react';
import {
  FaUsers,
  FaComments,
  FaFileAlt,
  FaUserPlus,
  FaCircle,
  FaGamepad
} from 'react-icons/fa';

const ForumStats = ({ stats }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  // Mock data para usuarios online
  const onlineUsers = [
    { name: 'GamerPro', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'BuilderMaster', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'PvPKing', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Explorer', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Admin', avatar: 'https://i.pravatar.cc/150?img=5' }
  ];

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      mb={8}
      boxShadow="md"
      position="relative"
      overflow="hidden"
    >
      {/* Efecto de fondo con patrón */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="200px"
        h="200px"
        opacity={0.05}
        bg="radial-gradient(circle, #9D5CFF 0%, transparent 70%)"
        transform="translate(50%, -50%)"
      />

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'start', lg: 'center' }}
        gap={6}
      >
        {/* Estadísticas principales */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} flex="2">
          <Stat>
            <StatLabel fontSize="sm" color={mutedColor}>
              <HStack spacing={2}>
                <Icon as={FaFileAlt} />
                <Text>Total Temas</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="3xl" color="purple.500" fontWeight="bold">
              {stats.totalThreads}
            </StatNumber>
            <StatHelpText fontSize="xs">
              +12 este mes
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color={mutedColor}>
              <HStack spacing={2}>
                <Icon as={FaComments} />
                <Text>Total Posts</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="3xl" color="blue.500" fontWeight="bold">
              {stats.totalPosts}
            </StatNumber>
            <StatHelpText fontSize="xs">
              +156 esta semana
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color={mutedColor}>
              <HStack spacing={2}>
                <Icon as={FaUsers} />
                <Text>Miembros</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="3xl" color="green.500" fontWeight="bold">
              {stats.totalMembers}
            </StatNumber>
            <StatHelpText fontSize="xs">
              +23 hoy
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color={mutedColor}>
              <HStack spacing={2}>
                <Icon as={FaCircle} color="green.400" />
                <Text>Online Ahora</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="3xl" color="green.400" fontWeight="bold">
              {stats.onlineNow}
            </StatNumber>
            <StatHelpText fontSize="xs">
              usuarios activos
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Usuarios online y nuevo miembro */}
        <Box flex="1" minW={{ base: '100%', lg: '300px' }}>
          <Box bg="gray.50" borderRadius="lg" p={4}>
            <Heading size="sm" color={textColor} mb={3}>
              Usuarios Online
            </Heading>

            <AvatarGroup size="sm" max={5} mb={3}>
              {onlineUsers.map((user, index) => (
                <Tooltip key={index} label={user.name} placement="top">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    border="2px solid white"
                  />
                </Tooltip>
              ))}
            </AvatarGroup>

            <Divider mb={3} />

            <HStack spacing={2} align="center">
              <Icon as={FaUserPlus} color="blue.500" />
              <Text fontSize="sm" color={textColor}>
                Bienvenido:
              </Text>
              <Badge colorScheme="blue" variant="subtle">
                {stats.newestMember}
              </Badge>
            </HStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ForumStats;