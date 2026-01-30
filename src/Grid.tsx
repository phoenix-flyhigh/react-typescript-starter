import React, { useCallback, useMemo, useState } from "react";

export const Grid = ({ size }: { size: number }) => {
    const cells = useMemo(() => Array.from({ length: size * size }, (_, index) => index), [size]);

    const [selectionOrder, setSelectionOrder] = useState<number[]>([]);
    const selectedCells = useMemo(() => new Set(selectionOrder), [selectionOrder]);

    const [deselectionInProgress, setDeselectionInProgress] = useState(false);

    const deselectAll = useCallback(() => {
        setDeselectionInProgress(true);
        const timer = setInterval(() => {
            setSelectionOrder(prev => {
                if(prev.length === 0) {
                    setDeselectionInProgress(false);
                    clearInterval(timer);
                    return prev;
                }
                return prev.slice(1);
            })
        }, 500)
    }, [])

    const handleClick = useCallback((cell: number) => {
        if (deselectionInProgress) return;
        if (selectedCells.has(cell)) return;

        const newSelectionOrder = [...selectionOrder, cell];
        setSelectionOrder(newSelectionOrder);

        if (newSelectionOrder.length === cells.length) {
            deselectAll();
        }
    }, [deselectionInProgress, selectionOrder.length, cells.length]);

    return (
        <div
            className="grid gap-2"
            style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            }}
        >
            {cells.map((cell) => (
                <div
                    key={cell}
                    role="button"
                    tabIndex={1}
                    className={`aspect-square flex justify-center items-center w-20 h-20 ${selectedCells.has(cell) ? "bg-blue-500" : "bg-gray-500"}`}
                    aria-disabled={selectedCells.has(cell)}
                    onClick={() => {
                        handleClick(cell);
                    }}
                >
                </div>
            ))}
        </div>
    );
}