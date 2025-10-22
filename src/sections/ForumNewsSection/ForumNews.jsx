import { useState, useMemo } from "react"
import { Box, SimpleGrid } from "@chakra-ui/react"
import NewsCard from "./NewsCard"
import NewsPagination from "./NewsPagination"
import { forumCategories } from "../ForumSection/ForumConstants"

const ForumNews = () => {
    const posts = useMemo(() => {
        const { GAIALAND } = forumCategories
        const novedades = GAIALAND.subcategories.find(s => s.id === "novedades").posts
        const actualizaciones = GAIALAND.subcategories.find(s => s.id === "actualizaciones").posts
        return [...novedades, ...actualizaciones]
    }, [])

    const [page, setPage] = useState(1)
    const pageSize = 3
    const totalPages = Math.ceil(posts.length / pageSize)
    const visible = posts.slice((page - 1) * pageSize, page * pageSize)

    return (
        <>
            <Box
                bg="gray.100"
                p={4}
                borderRadius={"2xl"}
            >
                <SimpleGrid columns={1} spacing={4}>
                    {visible.map((post) => (
                        <NewsCard key={post.id} {...post} />
                    ))}
                </SimpleGrid>
                <NewsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </Box>
        </>
    )
}

export default ForumNews
