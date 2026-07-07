import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import Antigravity from '@/components/ui/Antigravity';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 relative overflow-hidden">
            {/* Antigravity Background */}
            <div className="absolute inset-0 z-0 opacity-100 bg-[#F5E6FB] dark:bg-black">
                <Antigravity
                    count={480}
                    magnetRadius={17}
                    ringRadius={10}
                    waveSpeed={0.4}
                    waveAmplitude={1.6}
                    particleSize={3.5}
                    lerpSpeed={0.1}
                    color="#4C0585"
                    autoAnimate={false}
                    particleVariance={1}
                    rotationSpeed={0}
                    depthFactor={1}
                    pulseSpeed={3}
                    particleShape="capsule"
                    fieldStrength={10}
                />
            </div>

            {/* Content overlay (removed blur and opacity to make background clearer) */}
            <div className="absolute inset-0 z-10 pointer-events-none"></div>

            <div className="w-full max-w-sm z-20 relative">
                <div className="flex flex-col gap-8 bg-card p-8 rounded-2xl shadow-2xl border border-border">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <AppLogoIcon className="size-6 fill-current text-primary" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
