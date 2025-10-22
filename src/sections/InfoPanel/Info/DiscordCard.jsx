import { HStack, Text, Button, Icon, Link } from "@chakra-ui/react";
import InfoCard from "../../../components/ui/InfoCard";
import { RiDiscordFill } from "react-icons/ri";

const DiscordCard = () => (
    <InfoCard
        bg="#5865F2"
        title={
            <HStack spacing={2}>
                <Icon as={RiDiscordFill} color="white" boxSize={6} />
                <Text fontWeight="bold" color="white" fontSize="lg">
                    Discord
                </Text>
            </HStack>
        }
        action={
            <Link
                href="https://discord.com/invite/cubecraft"
                isExternal
                _hover={{ textDecoration: "none" }}
            >
                <Button
                    bg="white"
                    color="black"
                    size="sm"
                    fontWeight="bold"
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 10px rgba(88,101,242,0.4)",
                    }}
                    _active={{
                        transform: "translateY(0)",
                        boxShadow: "0 2px 6px rgba(147, 152, 207, 0.74)",
                    }}
                    borderRadius="md"
                    transition="all 0.2s ease"
                >
                    Join
                </Button>
            </Link>
        }
    >
        <Text fontSize="md" color="white" fontWeight="medium">
            0 miembros online
        </Text>
    </InfoCard>
);

export default DiscordCard;
