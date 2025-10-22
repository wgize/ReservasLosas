import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useColorModeValue,
  HStack,
  Icon,
  Badge,
  SimpleGrid,
  Divider,
  Container
} from '@chakra-ui/react';
import { FaPlus, FaGamepad, FaUsers, FaFire, FaTrophy, FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CategorySection from './CategorySection';
import ForumStats from './ForumStats';
import { forumCategories, forumStats } from '../ForumConstants';
import MainContent from '../../../components/MainContent/MainContent';
import { useSmartScroll } from "../../../hooks/useSmartSctroll";


// Componente de animación para los títulos
const MotionHeading = motion(Heading);
const ForumPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const { hash } = useLocation();
  const [targetId, setTargetId] = useState(null);
  const [visibleId, setVisibleId] = useState(null);

  useSmartScroll({
    maxAttempts: 12, // Más intentos para foro con acordeones
    initialDelay: 600,
    onElementFound: (id, element) => {
      setTargetId(id);
      console.log(`Scroll en foro a: ${id}`);

      // Si es un acordeón, asegurarse de que esté abierto
      const accordionItem = element.closest('.chakra-accordion__item');
      if (accordionItem) {
        const accordionButton = accordionItem.querySelector('.chakra-accordion__button');
        if (accordionButton && accordionButton.getAttribute('aria-expanded') === 'false') {
          setTimeout(() => accordionButton.click(), 200);
        }
      }
    }
  });

  return (

    <MainContent>
      <Box
        id="inicio"
        minH="100vh"
        bg={bgColor}
        position="relative"
        overflow="hidden"
        borderRadius={"2xl"}
      >
        {/* Fondo con patrón de videojuegos */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.03}
          bgImage=""
        />

        <Container maxW="7xl" py={8} position="relative" zIndex={1}>
          {/* Header principal del foro */}
          <Box textAlign="center" mb={12}>
            <MotionHeading
              size="2xl"
              color={textColor}
              mb={4}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              🎮 Foro Gaialand
            </MotionHeading>

            <Text
              fontSize="xl"
              color={mutedColor}
              maxW="600px"
              mx="auto"
              mb={8}
            >
              Únete a nuestra comunidad de jugadores. Comparte estrategias, creaciones y mantente al tanto de las últimas novedades del servidor.
            </Text>

            {/* Botones de acción rápida */}
            <Flex
              justify="center"
              gap={4}
              wrap="wrap"
              mb={8}
            >
              <Button
                leftIcon={<FaPlus />}
                colorScheme="purple"
                size="lg"
                variant="solid"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.2s"
              >
                Nuevo Tema
              </Button>

              <Button
                leftIcon={<FaDiscord />}
                colorScheme="blue"
                size="lg"
                variant="outline"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.2s"
              >
                Unirse a Discord
              </Button>
            </Flex>

            {/* Características destacadas */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Icon as={FaFire} fontSize="3xl" color="orange.500" mb={3} />
                <Heading size="md" mb={2}>Eventos Activos</Heading>
                <Text fontSize="sm" color={mutedColor}>
                  Torneos y competencias en curso
                </Text>
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Icon as={FaTrophy} fontSize="3xl" color="yellow.500" mb={3} />
                <Heading size="md" mb={2}>Ranking</Heading>
                <Text fontSize="sm" color={mutedColor}>
                  Mejores jugadores del mes
                </Text>
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Icon as={FaGamepad} fontSize="3xl" color="purple.500" mb={3} />
                <Heading size="md" mb={2}>Guías</Heading>
                <Text fontSize="sm" color={mutedColor}>
                  Tutoriales y consejos
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Estadísticas del foro */}
          <ForumStats stats={forumStats} />

          {/* Categorías del foro */}
          <Box mb={8}>
            <Heading size="xl" color={textColor} mb={6} textAlign="center">
              Categorías del Foro
            </Heading>

            {Object.entries(forumCategories).map(([key, category]) => (
              <CategorySection
                key={key}
                categoryData={category}
                categoryKey={key}
                targetId={targetId}
                visibleId={visibleId}
              />
            ))}
          </Box>

          {/* Footer informativo */}
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            textAlign="center"
            boxShadow="md"
          >
            <Heading size="md" color={textColor} mb={3}>
              ¿Nuevo en Gaialand?
            </Heading>
            <Text color={mutedColor} mb={4}>
              Lee nuestras reglas y únete a la comunidad. ¡Estamos aquí para ayudarte!
            </Text>
            <HStack spacing={4} justify="center">
              <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
                Servidor Activo 24/7
              </Badge>
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                Staff Amigable
              </Badge>
              <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                Eventos Semanales
              </Badge>
            </HStack>
          </Box>
        </Container>
      </Box>
    </MainContent>
  );
};

export default ForumPage;