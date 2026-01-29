import React from 'react';
import { SlotMachine } from './SlotMachine';
import { Spacer } from './ui/Spacer';

export const Hero: React.FC = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-text-main py-10">

            {/* Mystic Background Elements */}
            <div className="absolute inset-0 bg-mystic-gradient z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_#6366F1_0%,_transparent_70%)]"></div>

            {/* Content Container */}
            <div className="container relative z-10 px-4 flex flex-col items-center text-center">

                {/* App Title */}
                <div className="mb-2 px-4 py-1 border border-primary/30 rounded-full bg-surface/50 backdrop-blur-sm">
                    <span className="text-primary-glow text-xs md:text-sm font-medium tracking-[0.2em]">PRECISION LIFE FORECAST</span>
                </div>

                <Spacer size="sm" />

                <h1 className="font-serif font-bold leading-tight">
                    <div className="text-2xl md:text-3xl text-text-muted mb-2 font-normal">AI手相解析による</div>
                    <div className="text-4xl md:text-6xl text-white tracking-wider relative inline-block">
                        【精密版】
                        <br className="md:hidden" />
                        人生の転機予報
                        <div className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    </div>
                </h1>

                <Spacer size="md" />

                <p className="text-text-muted max-w-lg mx-auto leading-loose text-base md:text-lg font-medium">
                    あなたの掌（てのひら）には、人生のシナリオが刻まれています。<br />
                    AI解析で、次に訪れる幸運の波を正確に予測します。
                </p>

                <Spacer size="md" />

                {/* Slot Machine Integration */}
                <div className="w-full max-w-md">
                    <SlotMachine />
                </div>

                <Spacer size="lg" />

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-60">
                    <span className="text-xs tracking-widest text-primary">SCROLL</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
                </div>

            </div>
        </section>
    );
};
