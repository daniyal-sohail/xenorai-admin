import { useEffect, type RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: () => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            // If click is inside element, ignore
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler(); // Click outside → run handler
        };

        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}
