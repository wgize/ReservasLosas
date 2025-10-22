import { VStack, Box, Text, Badge, Flex } from "@chakra-ui/react";
import InfoCard from "../../../components/ui/InfoCard";
import ScrollableBox from "../../../components/common/ScrollableBox";
import { EVENTOS } from "../../../data/constants";

const NewsCard = () => (
    <InfoCard title="Últimas noticias">
        <ScrollableBox maxH="500px">
            <VStack spacing={4} align="stretch">
                {EVENTOS.map((evento, index) => (
                    <Box
                        key={index}
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="white"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{
                            boxShadow: "md",
                            borderColor: "gray.300",
                            transform: "translateY(-2px)",
                        }}
                    >
                        <Flex gap={4}>
                            <Box
                                w="80px"
                                h="80px"
                                borderRadius="md"
                                overflow="hidden"
                                flexShrink={0}
                            >
                                <Box
                                    as="img"
                                    src={evento.image}
                                    alt={evento.title}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Box>
                            <Box flex={1} minW={0}>
                                <Badge
                                    colorScheme={
                                        evento.tag === "Actualización"
                                            ? "blue"
                                            : evento.tag === "Competitivo"
                                                ? "green"
                                                : evento.tag === "Servidor"
                                                    ? "orange"
                                                    : "purple"
                                    }
                                    fontSize="xs"
                                    mb={1}
                                >
                                    {evento.tag}
                                </Badge>
                                <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                                    {evento.title}
                                </Text>
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                    {evento.desc}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                ))}
            </VStack>
        </ScrollableBox>
    </InfoCard>
);

export default NewsCard;
