'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const words = [
    'Namaste',
    'नमस्ते',
    'নমস্কার',
    'నమస్తే',
    'ನಮಸ್ಕಾರ',
    'નમસ્તે',
    'നമസ്കാരം',
    'Hello',
];

export default function Preloader() {
    const [index, setIndex] = useState(0);
    const [animationFinished, setAnimationFinished] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const textWrapperRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const handleLoad = () => {
            setPageLoaded(true);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        // Lock scroll
        document.body.classList.add('no-scroll');

        return () => {
            window.removeEventListener('load', handleLoad);
            document.body.classList.remove('no-scroll');
        };
    }, []);

    useEffect(() => {
        if (index < words.length - 1) {
            const timeout = setTimeout(() => {
                gsap.to(textWrapperRef.current, {
                    opacity: 0,
                    duration: 0.15,
                    onComplete: () => {
                        setIndex((prev) => prev + 1);
                        gsap.to(textWrapperRef.current, {
                            opacity: 1,
                            duration: 0.25,
                        });
                    },
                });
            }, 250); // Visibility time per word
            return () => clearTimeout(timeout);
        } else {
            // Last word shown, wait a bit then finish
            const finalTimeout = setTimeout(() => {
                setAnimationFinished(true);
            }, 800);
            return () => clearTimeout(finalTimeout);
        }
    }, [index]);

    useEffect(() => {
        if (animationFinished && pageLoaded) {
            setIsHidden(true);
            const unlockTimeout = setTimeout(() => {
                document.body.classList.remove('no-scroll');
            }, 2000); // Wait for transition to finish
            return () => clearTimeout(unlockTimeout);
        }
    }, [animationFinished, pageLoaded]);

    return (
        <div
            className={`preloader ${isHidden ? 'preloader--hidden' : ''}`}
            id="preloader"
        >
            <p className="preloader__text" ref={textWrapperRef} style={{ opacity: 1 }}>
                <span className="preloader__dot"></span>
                <span id="preloaderWord">{words[index]}</span>
            </p>
        </div>
    );
}
