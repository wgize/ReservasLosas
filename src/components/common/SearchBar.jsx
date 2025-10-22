// src/components/common/SearchBar.jsx
import {
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
} from '@chakra-ui/react'
import { RiSearchLine } from 'react-icons/ri'
import { useRef } from 'react'

const SearchBar = ({ placeholder = 'Buscar...', width = '100%', ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      {/* ------- MÓVIL: solo icono ------- */}
      <Box display={{ base: 'block', sm: 'none' }}>
        <IconButton
          ref={btnRef}
          aria-label="Abrir búsqueda"
          icon={<RiSearchLine />}
          variant="outline"
          size="sm"
          onClick={onOpen}
        />
      </Box>

      {/* ------- DESKTOP: input completo ------- */}
      <Box display={{ base: 'none', sm: 'block' }} w={width} {...rest}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <RiSearchLine />
          </InputLeftElement>
          <Input
            placeholder={placeholder}
            size="md"
            bg="gray.50"
            _placeholder={{ color: 'gray.400' }}
            borderRadius="md"
          />
        </InputGroup>
      </Box>

      {/* ------- DRAWER (móvil) ------- */}
      <Drawer isOpen={isOpen} placement="top" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Búsqueda</DrawerHeader>
          <DrawerBody>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <RiSearchLine />
              </InputLeftElement>
              <Input
                placeholder={placeholder}
                size="md"
                bg="gray.50"
                _placeholder={{ color: 'gray.400' }}
                borderRadius="md"
                autoFocus
              />
            </InputGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SearchBar