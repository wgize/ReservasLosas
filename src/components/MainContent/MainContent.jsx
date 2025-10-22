import { Box, Flex, Grid, useDisclosure, useBreakpointValue } from '@chakra-ui/react'
import CenterSection from '../../sections/CenterSection/CenterSection'
import InfoPanel from '../layout/InfoPanel/InfoPanel'
import ResponsiveInfoPanel from '../layout/InfoPanel/ResponsiveInfoPanel'

const MainContent = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isMobile = useBreakpointValue({ base: true, md: true, lg: false })

    return (
        <Flex
            direction="column"
            h="calc(100vh - 80px)"
            p={{ base: 0, lg: 1 }}
            position="relative"
        >
            <Grid
                templateColumns={{ base: '1fr', lg: '3fr 1fr' }}
                gap={2}
                p={1}
                flex="1"
                h="full"
                w="full"
                overflow="auto"
            >
                <Box h="full" overflow="hidden">
                    <CenterSection onInfoOpen={onOpen}>{children}</CenterSection>
                </Box>

                {!isMobile && (
                    <Box h="full" overflow="hidden">
                        <InfoPanel />
                    </Box>
                )}
            </Grid>

            {isMobile && <ResponsiveInfoPanel isOpen={isOpen} onClose={onClose} />}
        </Flex >
    )
}

export default MainContent