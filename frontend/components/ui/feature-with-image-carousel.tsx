import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

function Feature() {
    const views = [
        { src: "/view1.png", alt: "User Login & Scheme Discovery" },
        { src: "/view2.png", alt: "Scheme Eligibility and Details" },
        { src: "/view3.png", alt: "Facilitator Dashboard View" },
    ];

    return (
        <div id="platform" className="w-full py-20 lg:py-40">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-10 md:gap-20">
                    <div className="flex gap-6 flex-col items-start">
                        <div>
                            <Badge className="bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20 uppercase tracking-widest text-[10px] py-1 px-3">
                                Platform
                            </Badge>
                        </div>
                        <div className="flex gap-4 flex-col">
                            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-medium text-left leading-tight text-slate-900">
                                A Phygital Bridge to Government Benefits
                            </h2>
                            <p className="text-lg md:text-xl max-w-xl leading-relaxed tracking-tight text-slate-600 font-light text-left">
                                Empowering citizens and facilitators alike. Yojana-Setu simplifies the complex world of government schemes through a seamless interface designed for every Indian.
                            </p>
                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-[#138808]/10 flex items-center justify-center text-[#138808] shrink-0">✔</div>
                                    <p className="text-slate-700">Multi-language Voice-First interfaces</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-[#138808]/10 flex items-center justify-center text-[#138808] shrink-0">✔</div>
                                    <p className="text-slate-700">Offline-first facilitator workflows</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-[#138808]/10 flex items-center justify-center text-[#138808] shrink-0">✔</div>
                                    <p className="text-slate-700">Real-time eligibility tracking</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-full px-6 relative group">
                        <Carousel className="w-full ring-1 ring-slate-200 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50">
                            <CarouselContent>
                                {views.map((view, index) => (
                                    <CarouselItem key={index}>
                                        <div className="flex rounded-md aspect-video bg-slate-50 items-center justify-center overflow-hidden">
                                            <img
                                                src={view.src}
                                                alt={view.alt}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 bg-white border-t border-slate-100 italic text-sm text-slate-500 text-center">
                                            {view.alt}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="hidden md:block">
                                <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur" />
                                <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Feature };
