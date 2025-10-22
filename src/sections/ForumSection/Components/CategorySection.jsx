/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Text,
  Heading,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Badge,
  HStack,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { FaGamepad, FaUsers, FaChevronRight } from 'react-icons/fa';
import ForumCard from './ForumCard';

const CategorySection = ({ categoryData, categoryKey, targetId, visibleId }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  // encontramos el índice del subcategory que coincide
  const defaultIndex = categoryData.subcategories
    .map((s) => s.id)
    .indexOf(targetId || visibleId);

  // Calcular estadísticas de la categoría
  const totalPosts = categoryData.subcategories.reduce(
    (acc, sub) => acc + sub.posts.length,
    0
  );
  const totalReplies = categoryData.subcategories.reduce(
    (acc, sub) => acc + sub.posts.reduce((postAcc, post) => postAcc + post.replies, 0),
    0
  );

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
      {/* Header de la categoría con efecto gradiente */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="4px"
        bg={`linear-gradient(90deg, ${categoryData.color}, ${categoryData.color}dd, ${categoryData.color}99)`}
      />

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'start', lg: 'center' }}
        mb={6}
        gap={4}
      >
        <Flex align="center" gap={4}>
          <Box
            fontSize="3xl"
            p={3}
            bg={`${categoryData.color}1A`}
            borderRadius="xl"
            color={categoryData.color}
          >
            <Icon as={categoryKey === 'GAIALAND' ? FaGamepad : FaUsers} />
          </Box>

          <Box>
            <Heading size="lg" color={textColor} mb={1}>
              {categoryData.title}
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              {categoryData.description}
            </Text>
          </Box>
        </Flex>

        {/* Estadísticas rápidas */}
        <SimpleGrid columns={3} spacing={4}>
          <Stat textAlign="center">
            <StatLabel fontSize="xs" color={mutedColor}>
              Temas
            </StatLabel>
            <StatNumber fontSize="xl" color={categoryData.color}>
              {totalPosts}
            </StatNumber>
          </Stat>

          <Stat textAlign="center">
            <StatLabel fontSize="xs" color={mutedColor}>
              Respuestas
            </StatLabel>
            <StatNumber fontSize="xl" color={textColor}>
              {totalReplies}
            </StatNumber>
          </Stat>

          <Stat textAlign="center">
            <StatLabel fontSize="xs" color={mutedColor}>
              Subcategorías
            </StatLabel>
            <StatNumber fontSize="xl" color={textColor}>
              {categoryData.subcategories.length}
            </StatNumber>
          </Stat>
        </SimpleGrid>
      </Flex>

      <Divider mb={6} />

      {/* Acordeón de subcategorías */}
      <Accordion
        allowMultiple
        index={defaultIndex >= 0 ? [defaultIndex] : []}
        onChange={(expanded) => { /* no-op, solo para evitar warning */ }}
        key={visibleId}
      >

        {categoryData.subcategories.map((subcategory, index) => {
          const totalSubReplies = subcategory.posts.reduce((acc, post) => acc + post.replies, 0);

          return (
            <Box id={subcategory.id} key={subcategory.id}>
              <AccordionItem border="none" mb={4}>
                <h2>
                  <AccordionButton
                    bg={`${categoryData.color}0D`}
                    _hover={{ bg: `${categoryData.color}1A` }}
                    _expanded={{ bg: `${categoryData.color}1A`, borderBottomRadius: 'none' }}
                    borderRadius="lg"
                    p={4}
                  >
                    <Flex
                      flex="1"
                      align="center"
                      justify="space-between"
                      textAlign="left"
                    >
                      <Box>
                        <Heading size="md" color={textColor} mb={1}>
                          {subcategory.title}
                        </Heading>
                        <Text fontSize="sm" color={mutedColor}>
                          {subcategory.description}
                        </Text>
                      </Box>

                      <Flex align="center" gap={4}>
                        <HStack spacing={2}>
                          <Badge colorScheme="purple" variant="subtle">
                            {subcategory.posts.length} temas
                          </Badge>
                          <Badge colorScheme="blue" variant="subtle">
                            {totalSubReplies} respuestas
                          </Badge>
                        </HStack>

                        <AccordionIcon color={categoryData.color} fontSize="xl" />
                      </Flex>
                    </Flex>
                  </AccordionButton>
                </h2>

                <AccordionPanel
                  pb={4}
                  px={0}
                  bg={`${categoryData.color}05`}
                  borderBottomRadius="lg"
                >
                  {subcategory.posts.length === 0 ? (
                    <Box textAlign="center" py={8} color={mutedColor}>
                      <Text>No hay publicaciones en esta categoría aún.</Text>
                      <Text fontSize="sm">¡Sé el primero en crear un tema!</Text>
                    </Box>
                  ) : (
                    subcategory.posts.map((post) => (
                      <ForumCard key={post.id} post={post} isSubCategory={true} />
                    ))
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Box>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default CategorySection;