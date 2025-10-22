// sections/ForumNews/NewsGrid.jsx
import { SimpleGrid } from "@chakra-ui/react";
import NewsCard from "./NewsCard";

const NewsGrid = ({ posts }) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
        ))}
    </SimpleGrid>
);

export default NewsGrid;
