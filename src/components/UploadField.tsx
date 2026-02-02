import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

type UploadFieldProps = {
    label: string;
    side: 'left' | 'right';
    onImageSelect: (file: File | null) => void;
};

export const UploadField: React.FC<UploadFieldProps> = ({ label, side, onImageSelect }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onImageSelect(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        onImageSelect(null);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center text-text-main text-sm font-medium px-1">
                <span>{label}</span>
                <span className="text-primary-glow text-xs border border-primary/20 px-2 py-0.5 rounded bg-primary/10">必須</span>
            </div>

            <div
                onClick={() => inputRef.current?.click()}
                className="relative aspect-[3/4] w-full bg-surface border-2 border-dashed border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {preview ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                    >
                        <img src={preview} alt="Hand preview" className="w-full h-full object-cover" />

                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                        >
                            <X size={16} />
                        </button>

                        {/* AI Scan Overlay Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_#F59E0B] animate-[scan_3s_linear_infinite]"></div>
                    </motion.div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted gap-3 group-hover:text-primary transition-colors">
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-primary/10 transition-colors">
                            <Camera size={32} />
                        </div>
                        <p className="text-xs tracking-wide">タップして撮影 / 選択</p>
                    </div>
                )}

                {/* Hand Guide Overlay (Only when no image) */}
                {!preview && (
                    <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center p-6">
                        <img
                            src={side === 'left' ? import.meta.env.BASE_URL + 'images/hand-left.svg' : import.meta.env.BASE_URL + 'images/hand-right.svg'}
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
