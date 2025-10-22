// NewsPost.jsx
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  Link,
  Icon,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

const NewsPost = ({
  image,
  title,
  description,
  user,
  userAvatar,
  tags = [],
  date,
  gridColumn,
  gridRow,
}) => {
  return (
    <Box
      gridColumn={gridColumn}
      gridRow={gridRow}
      position="relative"
      borderRadius="2xl"
      bgImage={`url(${image})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      h="full"
      overflow="hidden"
      role="group"
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bg: "blackAlpha.300",
        borderRadius: "2xl",
        zIndex: 1,
        transition: "background 0.4s ease",
      }}
      _hover={{
        _before: {
          bg: "linear-gradient(to bottom right, rgba(115, 122, 111, 0.75), rgba(0,0,0,.55))",
        },
      }}
    >
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={2}
        p={4}
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        h="full"
        transition="transform 0.4s ease"
        _groupHover={{ display: "none" }} // 2. sube hasta el borde
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "lg", md: "xl" }}
          color="white"
          lineHeight="short"
          textShadow="0 2px 4px rgba(0,0,0,.8)"
          mb={0} // 3. pegado al borde
        >
          {title}
        </Text>
      </Box>
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={2}
        p={4}
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        h="full"
        transition="transform 0.4s ease"
        transform="translateY(100%)" // 1. empieza abajo
        _groupHover={{ transform: "translateY(0)" }} // 2. sube hasta el borde
      >
        {/* Título: sin margen inferior */}
        <Text
          fontWeight="bold"
          fontSize={{ base: "lg", md: "xl" }}
          color="white"
          lineHeight="short"
          textShadow="0 2px 4px rgba(0,0,0,.8)"
          mb={0} // 3. pegado al borde
        >
          {title}
        </Text>

        {/* Detalles: empieza debajo y sube con el padre */}
        <Box
          mt={2}
          opacity={0}
          transform="translateY(100%)" // 4. oculto debajo
          pointerEvents="none"
          transition="all 0.4s ease"
          _groupHover={{
            opacity: 1,
            transform: "translateY(0)", // 5. aparece justo debajo
            pointerEvents: "auto",
          }}
        >
          {tags.length > 0 && (
            <HStack spacing={2} flexWrap="wrap" mb={1}>
              {tags.map((t, i) => (
                <Badge
                  key={i}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="white"
                  bg={
                    t === "Noticia"
                      ? "blue.500"
                      : t === "Evento"
                      ? "green.500"
                      : t === "Actualización"
                      ? "orange.400"
                      : "gray.500"
                  }
                  boxShadow="0 0 8px rgba(0,0,0,.4)"
                >
                  {t}
                </Badge>
              ))}
            </HStack>
          )}

          <Divider borderColor="whiteAlpha.400" my={1} />

          <Text
            color="whiteAlpha.900"
            fontSize={{ base: "sm", md: "md" }}
            textShadow="0 1px 3px rgba(0,0,0,.6)"
            mb={2}
          >
            {description}
          </Text>

          <HStack justify="space-between" w="full" spacing={2} align="center">
            <HStack spacing={2}>
              <Link
                href={`/perfil/${user}`}
                color="whiteAlpha.900"
                fontSize="xs"
                fontWeight="medium"
                textShadow="0 1px 3px rgba(0,0,0,.8)"
                _hover={{
                  textDecoration: "underline",
                  color: "teal.200",
                }}
              >
                {user}
              </Link>
              <Text
                color="whiteAlpha.800"
                fontSize="xs"
                textShadow="0 1px 3px rgba(0,0,0,.8)"
              >
                {date}
              </Text>
            </HStack>
            <Avatar
              size="xs"
              src={userAvatar}
              name={user}
              icon={<Icon as={FiUser} boxSize={3} />}
            />
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsPost;
