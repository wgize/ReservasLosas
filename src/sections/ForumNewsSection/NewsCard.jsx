import { Box, Heading, Text, HStack, Badge, Stack } from "@chakra-ui/react"

const NewsCard = ({ title, author, replies, views, lastActivity, tags }) => (
    <Box
        bg="white"
        borderWidth="1px"
        borderRadius="xl"
        p={4}
        _hover={{ shadow: "md", transform: "scale(1.02)" }}
        transition="all 0.2s"
    >
        <Stack spacing={2}>
            <Heading fontSize="lg">{title}</Heading>
            <Text fontSize="sm" color="gray.500">
                Por {author} • {lastActivity}
            </Text>
            <HStack spacing={2}>
                {tags.map((tag) => (
                    <Badge key={tag} colorScheme="purple">
                        {tag}
                    </Badge>
                ))}
            </HStack>
            <HStack justify="space-between" fontSize="sm" color="gray.400">
                <Text>Respuestas: {replies}</Text>
                <Text>Vistas: {views}</Text>
            </HStack>
        </Stack>
    </Box>
)

export default NewsCard
