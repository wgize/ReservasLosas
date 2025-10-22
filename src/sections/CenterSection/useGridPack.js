// useGridPack.js
export const useGridPack = (items, cols = 4, rows = 4) => {
    const used = new Set();
    const packed = [];

    for (const it of items) {
        const w = Math.min(it.sizeX || 1, cols);
        const h = Math.min(it.sizeY || 1, rows);
        let placed = false;

        for (let r = 0; r <= rows - h && !placed; r++) {
            for (let c = 0; c <= cols - w && !placed; c++) {
                const cells = [];
                for (let y = r; y < r + h; y++)
                    for (let x = c; x < c + w; x++) cells.push(y * cols + x);

                if (cells.every((i) => !used.has(i))) {
                    cells.forEach((i) => used.add(i));
                    packed.push({
                        ...it,
                        gridColumn: `${c + 1} / span ${w}`,
                        gridRow: `${r + 1} / span ${h}`,
                    });
                    placed = true;
                }
            }
        }
    }

    return packed;
};
