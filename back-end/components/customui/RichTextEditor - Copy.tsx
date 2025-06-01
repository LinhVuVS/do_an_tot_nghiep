"use client";

import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const quillRef = useRef<ReactQuill>(null);

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                // Gọi API để tải lên hình ảnh
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                const data = await res.json();
                const url = data.url;

                // Chèn hình ảnh vào trình soạn thảo
                const quill = quillRef.current?.getEditor();
                const range = quill?.getSelection();
                quill?.insertEmbed(range?.index || 0, "image", url);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image"];

    return (
        <ReactQuill ref={quillRef} theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
    );
};

export default RichTextEditor;
