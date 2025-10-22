import { HStack, IconButton, Text } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

const NewsPagination = ({ page, totalPages, onPageChange }) => (
    <HStack justify="center" spacing={2} mt={6}>
        <IconButton
            icon={<LuChevronLeft />}
            isDisabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
        />
        <Text fontWeight="semibold">
            {page} / {totalPages}
        </Text>
        <IconButton
            icon={<LuChevronRight />}
            isDisabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Página siguiente"
        />
    </HStack>
)

export default NewsPagination
