// NewsGrid.jsx
import { Grid, useBreakpointValue } from '@chakra-ui/react';
import NewsPost from '../../components/ui/NewsPost';

const NewsGrid = ({ packedItems, cols = 4 }) => {
    /* devuelve true cuando estamos en 1 columna */
    const isSingleColumn = useBreakpointValue({ base: true, sm: true, lg: false });

    return (
        <Grid

            my={3}
            id="home"
            gridTemplateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: `repeat(${Math.min(cols, 3)}, 1fr)`,
                lg: `repeat(${cols}, 1fr)`,
            }}
            gridAutoRows="200px"
            gap={4}
            maxW="1200px"
            mx="auto"
        >
            {
                packedItems.map((item, idx) => {
                    /* eliminamos las props que desbordan */
                    const { gridColumn, gridRow, ...rest } = item;
                    return (
                        <NewsPost
                            key={idx}
                            {...rest}
                            {...(!isSingleColumn && { gridColumn, gridRow })} // solo cuando hay >1 columna
                        />
                    );
                })
            }
        </Grid >
    );
};

export default NewsGrid;