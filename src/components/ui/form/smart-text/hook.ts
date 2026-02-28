import { useCallback } from "react";

export function useSmartTextarea(onChange?: (value: string) => void) {
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key !== "Enter") return;

            const textarea = e.currentTarget;
            const { selectionStart, value } = textarea;

            const beforeCursor = value.substring(0, selectionStart);
            const currentLine = beforeCursor.split("\n").pop() || "";

            const bulletMatch = currentLine.match(/^(\s*[-*]\s)/);
            const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);

            let insertText = "";

            if (bulletMatch) {
                insertText = `\n${bulletMatch[1]}`;
            } else if (numberMatch) {
                const nextNumber = Number(numberMatch[2]) + 1;
                insertText = `\n${numberMatch[1]}${nextNumber}. `;
            }

            if (insertText) {
                e.preventDefault();

                const newValue =
                    value.substring(0, selectionStart) +
                    insertText +
                    value.substring(textarea.selectionEnd);

                onChange?.(newValue);

                requestAnimationFrame(() => {
                    textarea.selectionStart = textarea.selectionEnd =
                        selectionStart + insertText.length;
                });
            }
        },
        [onChange],
    );

    return { handleKeyDown };
}
