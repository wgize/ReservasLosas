import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useBreakpointValue } from '@chakra-ui/react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  /* ---------- estado responsive ---------- */
  const defaultState = useBreakpointValue({ base: false, lg: true }); // cerrado en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultState);

  /* sincronizar cambios de breakpoint */
  useEffect(() => {
    setIsSidebarOpen(defaultState);
  }, [defaultState]);

  const toggleSidebar = () =>
    setIsSidebarOpen((prev) => !prev);

  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar: () => setIsSidebarOpen(false),
    openSidebar: () => setIsSidebarOpen(true),
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

/* Hook tipado */
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      'useSidebar debe usarse dentro de <SidebarProvider>'
    );
  }
  return ctx;
};