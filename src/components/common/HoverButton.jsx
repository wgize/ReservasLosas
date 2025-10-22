import { Button, Icon, Text, HStack, useBreakpointValue } from "@chakra-ui/react"

export default function HoverButton({
  icono,
  tam = "lg",
  texto = "Comprar",
  direccion = "izquierda",
  w = "200px",
  ...props
}) {
  const esDerecha = direccion === "derecha"
  const isMobile = useBreakpointValue({ base: true, xl: false }) // true en pantallas pequeñas
  const iconHoverTransform = esDerecha ? "translateX(8px)" : "translateX(-8px)"
  const textInitialTransform = esDerecha ? "translateX(-8px)" : "translateX(8px)"

  return (
    <Button
      colorScheme="gray"
      variant="outline"
      size={tam}
      w={isMobile ? "24px" : w}
      justifyContent="center"
      overflow="hidden"
      role="group"
      position="relative"
      transition="all 0.2s ease"
      _hover={isMobile ? { bg: "gray.100" } : { bg: "gray.100", px: 6 }}
      {...props}
    >
      <HStack
        w="full"
        align="center"
        justify="center"
        spacing={isMobile ? 0 : 3}
      >
        {esDerecha ? (
          <>
            {!isMobile && (
              <Text
                opacity={0}
                transform={textInitialTransform}
                transition="all 0.2s ease"
                _groupHover={{ opacity: 1, transform: "translateX(0)" }}
              >
                {texto}
              </Text>
            )}

            <Icon
              as={icono}
              boxSize={tam === "xs" ? 4 : 5}
              ml={esDerecha ? "auto" : 0}
              transition="transform 0.2s ease"
              _groupHover={
                isMobile ? {} : { transform: iconHoverTransform }
              }
            />
          </>
        ) : (
          <>
            <Icon
              as={icono}
              boxSize={tam === "xs" ? 4 : 5}
              mr={esDerecha ? 0 : "auto"}
              transition="transform 0.2s ease"
              _groupHover={
                isMobile ? {} : { transform: iconHoverTransform }
              }
            />

            {!isMobile && (
              <Text
                opacity={0}
                transform={textInitialTransform}
                transition="all 0.2s ease"
                _groupHover={{ opacity: 1, transform: "translateX(0)" }}
              >
                {texto}
              </Text>
            )}
          </>
        )}
      </HStack>
    </Button>
  )
}

export { HoverButton }
