"use client";

import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

function Case() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 1000);
    }, [api, current]);

    // Trusted by logos array
    const logos = [
        { name: "Digital India", id: 1 },
        { name: "PMJDY", id: 2 },
        { name: "PMAY", id: 3 },
        { name: "Kisan Portal", id: 4 },
        { name: "UIDAI", id: 5 },
        { name: "DBT", id: 6 },
        { name: "BharatNet", id: 7 },
        { name: "DigiLocker", id: 8 },
    ];

    // Repeat logos a few times so the carousel feels truly infinite
    const repeatedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="w-full pb-20 pt-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col gap-10 items-center">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">
                        Bharat builds with Yojana-Setu
                    </p>
                    <Carousel setApi={setApi} className="w-full relative px-6 md:px-0" opts={{ loop: true, align: "center", dragFree: true }}>
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none hidden md:block" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none hidden md:block" />
                        <CarouselContent className="flex items-center">
                            {repeatedLogos.map((logo, index) => (
                                <CarouselItem className="basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4 md:pl-8 flex justify-center" key={`${logo.id}-${index}`}>
                                    <span className="text-lg md:text-2xl font-black tracking-[-0.05em] text-slate-300 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
                                        {logo.name}
                                    </span>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export { Case };
