import React from 'react';

interface FooterProps {
    onClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onClick }) => {
    return (
        <footer
            onClick={onClick}
            className="bg-background text-text-muted py-8 border-t border-white/5 font-sans cursor-default select-none"
        >
            <div className="container px-4 mx-auto text-center">
                <p className="text-xs mb-4 opacity-50">
                    ※本サービスはAI技術を用いたエンターテイメント目的のシミュレーションです。<br />
                    将来の出来事を保証するものではありません。
                </p>
                <div className="text-sm font-medium">
                    &copy; {new Date().getFullYear()} Precision Life Forecast AI. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};
