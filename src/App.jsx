import Layout from './components/layout/Layout';
import { SidebarProvider } from './context/SidebarContext';
import { Box, VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom'
import Footer from './sections/FooterSection/Footer';
export default function App() {
  return (
    /* Contenedor que PUEDE crecer y generar scroll */
    <Box>
      <Box
        /*altura fija = viewport completo */
        h="100vh"
        display="flex"
        flexDirection="column"
        py={6}
      >
        {/* Cajón centrado (sobre el fondo) */}
        <Box
          position="relative"
          maxW={{ base: "95%", md: "1400px", xl: "1500" }}
          mx="auto"
          shadow="xl"
          borderRadius="xl"
          overflow="hidden"
          my={-4}
        >
          <SidebarProvider>
            <VStack spacing={0} w="100%" align="stretch">
              <Layout>
                <Outlet />
              </Layout>
            </VStack>
          </SidebarProvider>

        </Box>
      </Box>
      <Footer />
    </Box>
  );
}