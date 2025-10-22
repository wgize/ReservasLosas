// components/common/CopyIpButton.jsx
import { Button, IconButton, useClipboard, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { CopyIcon, CheckIcon } from "@chakra-ui/icons"

const CopyIpButton = () => {
    const { onCopy, hasCopied } = useClipboard("PLAY.GAIALAND.NET")
    const isMobile = useBreakpointValue({ base: true, md: false })

    const commonProps = {
        "aria-label": "Copiar IP del servidor",
        onClick: onCopy,
        colorScheme: "yellow",
        bg: "#ffb703",
        color: "white",
        _hover: { bg: "#f4a261" },
        size: "md",
    }

    if (isMobile) {
        return (
            <Tooltip label={hasCopied ? "¡Copiado!" : "Copiar IP"} placement="top">
                <IconButton
                    {...commonProps}
                    icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                />
            </Tooltip>
        )
    }

    return (
        <Button {...commonProps} px={{ base: 3, lg: 8 }} whiteSpace="nowrap">
            PLAY.GAIALAND.NET
        </Button>
    )
}

export default CopyIpButton