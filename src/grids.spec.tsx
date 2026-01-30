import { act, fireEvent, render, screen } from "@testing-library/react"
import { Grid } from "./Grid"
import React from "react"

describe("Grids test", () => {
    it("renders the right number of cells in the grid", () => {
        render(<Grid size={3} />);

        const cell = screen.getAllByRole("button");
        expect(cell.length).toBe(9);
    })

    it("selects a cell on click", () => {
        render(<Grid size={2} />);

        const cells = screen.getAllByRole("button");
        const firstCell = cells[0];

        expect(firstCell).toHaveClass("bg-gray-500");

        fireEvent.click(firstCell);

        expect(firstCell).toHaveClass("bg-blue-500");
    })

    it("deselects all cells in order after all are selected", async () => {
        jest.useFakeTimers();
        render(<Grid size={2} />);

        const cells = screen.getAllByRole("button")

        for (const cell of cells) {
            fireEvent.click(cell);
        }

        expect(cells[0]).toHaveClass("bg-blue-500");

        await act(async () => {
            jest.advanceTimersByTime(500)
        });
        expect(cells[0]).toHaveClass("bg-gray-500");

        await act(async () => {
            jest.advanceTimersByTime(1500)
        });
        cells.forEach(cell => expect(cell).toHaveClass("bg-gray-500"));

        jest.useRealTimers();
    })


    it("prevents selecting a cell during deselection process", async () => {
        jest.useFakeTimers();
        render(<Grid size={2} />);

        const cells = screen.getAllByRole("button")

        for (const cell of cells) {
            fireEvent.click(cell);
        }

        expect(cells[0]).toHaveClass("bg-blue-500");

        await act(async () => {
            jest.advanceTimersByTime(500)
        });
        expect(cells[0]).toHaveClass("bg-gray-500");

        fireEvent.click(cells[0]);
        expect(cells[0]).toHaveClass("bg-gray-500");

        jest.useRealTimers();
     })
})