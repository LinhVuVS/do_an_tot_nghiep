"use client";

import { useState, useRef, useEffect } from "react";

import { Bold } from "lucide-react";
import { Italic } from "lucide-react";
import { Underline } from "lucide-react";
interface WordLikeEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const WordLikeEditor = ({ value, onChange }: WordLikeEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastHtmlRef = useRef<string>("");

    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    };

    const restoreCursorPosition = (savedRange: Range | null) => {
        if (savedRange) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(savedRange);
            }
        }
    };

    const isFormatActive = (command: string) => {
        return document.queryCommandState(command);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.ctrlKey && e.key === "b") {
            e.preventDefault();
            document.execCommand("bold", false, isFormatActive("bold") ? "false" : "true");
        } else if (e.ctrlKey && e.key === "i") {
            e.preventDefault();
            document.execCommand("italic", false, isFormatActive("italic") ? "false" : "true");
        } else if (e.ctrlKey && e.key === "u") {
            e.preventDefault();
            document.execCommand("underline", false, isFormatActive("underline") ? "false" : "true");
        } else if (e.key === "Enter") {
            e.preventDefault();
            document.execCommand("insertHTML", false, "<div><br></div>");
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (editorRef.current) {
            const newHtml = editorRef.current.innerHTML;
            if (newHtml !== lastHtmlRef.current) {
                lastHtmlRef.current = newHtml;
                onChange(newHtml);
            }
        }
    };

    const handleColorChange = (color: string) => {
        document.execCommand("foreColor", false, color);
    };

    const handleFontSizeChange = (size: string) => {
        document.execCommand("fontSize", false, size);
    };

    useEffect(() => {
        if (editorRef.current && value !== lastHtmlRef.current) {
            const savedRange = saveCursorPosition();
            editorRef.current.innerHTML = value;
            lastHtmlRef.current = value;
            restoreCursorPosition(savedRange);
        }
    }, [value]);

    return (
        <div>
            <div className="flex " style={{ marginBottom: "10px" }}>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => document.execCommand("bold", false)}>
                        <Bold />
                    </button>
                    <button onClick={() => document.execCommand("italic", false)}>
                        <Italic />
                    </button>
                    <button onClick={() => document.execCommand("underline", false)}>
                        <Underline />
                    </button>
                </div>
                <input
                    type="color"
                    onChange={(e) => handleColorChange(e.target.value)}
                    style={{ marginLeft: "10px" }}
                />
                <select onChange={(e) => handleFontSizeChange(e.target.value)} style={{ marginLeft: "10px" }}>
                    <option value="1">8px</option>
                    <option value="2">10px</option>
                    <option value="3">16px</option>
                    <option value="4">18px</option>
                    <option value="5">24px</option>
                    <option value="6">32px</option>
                    <option value="7">48px</option>
                </select>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "100px",
                    outline: "none",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                }}
            />
        </div>
    );
};

export default WordLikeEditor;
