import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar/Sidebar";
import SidebarWrapper from "./Sidebar/SidebarWrapper";
import Header from "./Header/Header";
import { useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom";


import { useOverlayControl } from "../../hooks/useOverlayControl";
import ReportOverlay from "../overlays/ReportOverlay";
import StoreOverlay from "../overlays/StoreOverlay";
import LoginOverlay from "../overlays/LoginOverlay";
import RegisterOverlay from "../overlays/RegisterOverlay";
import SupportOverlay from "../overlays/SupportOverlay";

const MotionGridItem = motion(GridItem);

const Layout = () => {
  const { isSidebarOpen } = useSidebar();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const SIDEBAR_WIDTH = 240;
  const sidebarWidth = isSidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px";

  // Control global de overlays
  const { overlay, openOverlay, closeOverlay } = useOverlayControl();

  return (
    <>
      <Grid
        templateAreas={{
          base: `"header" "main"`,
          lg: `"sidebar header" "sidebar main"`,
        }}
        gridTemplateColumns={{
          base: "1fr",
          lg: `${sidebarWidth} 1fr`,
        }}
        gridTemplateRows={{
          base: "auto 1fr",
          lg: "auto 1fr",
        }}
        minH="100vh"
        transition="grid-template-columns 0.3s ease"
        position="relative"
      >
        {/* Sidebar fijo */}
        {!isMobile && (
          <AnimatePresence>
            {isSidebarOpen && (
              <MotionGridItem
                area="sidebar"
                initial={{ opacity: 0, x: -SIDEBAR_WIDTH }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -SIDEBAR_WIDTH }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                w={`${SIDEBAR_WIDTH}px`}
                h="100vh"
                position="absolute"
                top="0"
                zIndex="9"
                overflow="hidden"
              >
                <Sidebar openOverlay={openOverlay} />
              </MotionGridItem>
            )}
          </AnimatePresence>
        )}

        {/* Sidebar en móvil */}
        {isMobile && <SidebarWrapper openOverlay={openOverlay} />}

        {/* Header */}
        <GridItem area="header" zIndex="10" px={2} borderBottom={"xl"}>
          <Header openOverlay={openOverlay} />
        </GridItem>

        {/* Contenido */}
        <GridItem area="main" overflowY="auto" minH={0}>
          <Outlet />
        </GridItem>
      </Grid>

      {/* Overlays globales */}
      {overlay === "report" && <ReportOverlay isOpen onClose={closeOverlay} />}
      {overlay === "store" && <StoreOverlay isOpen onClose={closeOverlay} />}
      {overlay === "login" && <LoginOverlay isOpen onClose={closeOverlay} />}
      {overlay === "register" && <RegisterOverlay isOpen onClose={closeOverlay} />}
      {overlay === "support" && <SupportOverlay isOpen onClose={closeOverlay} />}
    </>
  );
};

export default Layout;

