import { Divider } from "@chakra-ui/react";
import { NEWS_DATA } from "../data/constants";
import { useGridPack } from "../sections/CenterSection/useGridPack";
import ScrollContainer from "../components/common/ScrollContainer";
import NewsGrid from "../sections/CenterSection/NewsGrid";
import { AboutUs, Rules, Contact } from "../sections/CenterSection/Info";
import JoinBanner from "../sections/CenterSection/JoinBanner";
import MainContent from "../components/MainContent/MainContent";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollWithOffset } from "../components/utils/ScrollWithOffset";
import ForumNews from "../sections/ForumNewsSection/ForumNews";
import MapCanchas from "../components/map/pageMap";

function HomePage() {
  const { hash } = useLocation();
  const COLS = 4;
  const ROWS = 4;
  const packedNews = useGridPack(NEWS_DATA, COLS, ROWS);

  useEffect(() => {
    if (!hash || hash === "#") return;

    const id = hash.replace("#", "");

    const attemptScroll = (attempt = 0) => {
      const success = scrollWithOffset(id);

      if (success) {
        console.log(`Scroll exitoso a: ${id}`);
        return;
      } else if (attempt < 5) {
        // Más intentos
        console.log(`Intento ${attempt + 1} fallado, reintentando...`);
        setTimeout(() => attemptScroll(attempt + 1), 300 * (attempt + 1));
      } else {
        console.warn(`No se pudo hacer scroll a: ${id} después de 5 intentos`);
      }
    };

    // Primer intento inmediato
    attemptScroll();
  }, [hash]);
  return (
    <MainContent>
      <MapCanchas />
      <JoinBanner />
      <NewsGrid packedItems={packedNews} cols={COLS} />
      <Divider my={4} borderColor="gray.300" />
      <ForumNews />
    </MainContent>
  );
}
export default HomePage;
