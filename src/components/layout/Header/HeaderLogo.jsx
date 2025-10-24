import { Text, Box } from "@chakra-ui/react";
import logo from "../../../resources/bannermicancha.png";
export const HeaderLogo = () => (
  <Box
    as="img"
    src={logo}
    alt="Gaialand"
    h={{ base: "50px", md: "60px" }}
    display={{ base: "flex", sm: "flex", md: "block", lg: "none" }}
  />
);
