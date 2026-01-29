import React from 'react';

type SpacerProps = {
    size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizes = {
    sm: 'h-8',   // 32px
    md: 'h-16',  // 64px
    lg: 'h-24',  // 96px
    xl: 'h-32',  // 128px
};

export const Spacer: React.FC<SpacerProps> = ({ size = 'md' }) => {
    return <div className={sizes[size]} aria-hidden="true" />;
};
