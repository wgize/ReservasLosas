import l_1 from "../resources/mine1.jpg";
import l_2 from "../resources/mine2.jpg";
import l_3 from "../resources/mine3.jpg";
import l_4 from "../resources/mine4.jpg";

export const NAV_ITEMS = [
  { icon: "RiHome2Line", label: "Inicio", path: "/" },
  { icon: "RiGamepadLine", label: "Novedades", path: "/foro", id: "novedades" },
  { icon: "RiChat3Line", label: "Foro", path: "/foro", id: "inicio" },
  { icon: "RiShoppingBag3Line", label: "Tienda", overlay: "store" },
  { icon: "RiAlertLine", label: "Reportar", overlay: "report" },
  { icon: "RiBookOpenLine", label: "Reglas", path: "/foro", id: "reglas" },
  { icon: "RiCustomerService2Line", label: "Soporte", overlay: "support" },
  { icon: "RiTeamLine", label: "Nosotros", path: "/", id: "nosotros" },
];

export const EVENTOS = [
  {
    title: "SkyBlock",
    desc: "Crea tu isla y compite con amigos.",
    image: "../resources/mine1.jpg",
    tag: "Actualización",
  },
  {
    title: "BlockWars",
    desc: "Defiende tu base, conquista el mapa.",
    image: "../resources/mine2.png",
    tag: "Competitivo",
  },
  {
    title: "Mmiancra",
    desc: "Explora, construye y sobrevive con amigos.",
    image: "../resources/mine3.png",
    tag: "Servidor",
  },
  {
    title: "TNT Spleef",
    desc: "¡No te caigas! Destruye el suelo de tus oponentes.",
    image: "../resources/mine4.png",
    tag: "Evento",
  },
];

// data/newsData.js
export const NEWS_DATA = [
  {
    id: 1,
    image: l_1,
    title: "SkyBlock",
    description: "Crea tu isla y compite con amigos.",
    user: "Admin",
    userAvatar: "/avatars/admin.jpg",
    tags: ["Actualización", "SkyBlock"],
    sizeX: "2",
    sizeY: "2",
  },
  {
    id: 2,
    image: l_2,
    title: "BlockWars",
    description: "Explora, construye y sobrevive con amigos.",
    user: "Moderador",
    userAvatar: "/avatars/moderator.jpg",
    tags: ["Evento", "Competitivo"],
    sizeX: "2",
    sizeY: "1",
  },
  {
    id: 3,
    image: l_3,
    title: "TNT Spleef",
    description: "¡No te caigas! Destruye el suelo de tus oponentes.",
    user: "Developer",
    userAvatar: "/avatars/dev.jpg",
    tags: ["Servidor", "Técnico"],
    sizeX: "2",
    sizeY: "1",
  },
  {
    id: 4,
    image: l_4,
    title: "Nueva Actualización de SkyBlock",
    description:
      "Descubre las nuevas arenas y características añadidas al modo SkyBlock.",
    user: "Admin",
    userAvatar: "/avatars/admin.jpg",
    tags: ["Actualización", "SkyBlock"],
    sizeX: "4",
    sizeY: "1",
  },
];
