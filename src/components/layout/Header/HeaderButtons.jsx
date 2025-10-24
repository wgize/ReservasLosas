import { HStack } from "@chakra-ui/react";
import {
  RiShoppingBag3Line,
  RiUserAddLine,
  RiLoginCircleLine,
} from "react-icons/ri";
import { HoverButton } from "../../common/HoverButton";

export const HeaderButtons = ({ openOverlay }) => {
  const ShopButton = (
    <HoverButton
      icono={RiShoppingBag3Line}
      texto="TIENDA"
      borderColor="white"
      onClick={() => openOverlay("store")}
    />
  );

  const AuthButtons = (
    <>
      <HoverButton
        icono={RiUserAddLine}
        texto="Registrarse"
        borderColor="white"
        tam="md"
        direccion="derecha"
        onClick={() => openOverlay("register")}
      />
      <HoverButton
        icono={RiLoginCircleLine}
        texto="Loguearse"
        borderColor="white"
        tam="md"
        direccion="derecha"
        onClick={() => openOverlay("login")}
      />
    </>
  );

  return { ShopButton, AuthButtons };
};
