import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { performanceImages, performanceImgPositions } from "../constants/index.js";
import { useMediaQuery } from "react-responsive";

// Register ScrollTrigger plugin safely
gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const sectionEl = sectionRef.current;
            if (!sectionEl) return;

            // 1. Target scoped elements specifically within this component instance
            const contentParagraph = sectionEl.querySelector(".content p");
            const heading = sectionEl.querySelector("h2");

            // Optional: Animate the Heading (if fading in/out)
            if (heading) {
                gsap.fromTo(
                    heading,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                            end: "top 60%",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }

            // 2. Text Paragraph Animation (Scoped to sectionEl)
            if (contentParagraph) {
                gsap.fromTo(
                    contentParagraph,
                    { opacity: 0, y: 15 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: contentParagraph,
                            start: "top 80%",
                            end: "top 50%",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }

            // 3. Desktop Image Layout & Positioning Animation
            if (!isMobile) {
                const tl = gsap.timeline({
                    defaults: { duration: 2, ease: "power1.inOut", overwrite: "auto" },
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });

                performanceImgPositions.forEach((item) => {
                    if (item.id === "p5") return;

                    // Use GSAP utility selector scoped specifically to sectionRef
                    const imgElement = sectionEl.querySelector(`.${item.id}`);
                    if (!imgElement) return;

                    const vars = {};
                    if (typeof item.left === "number") vars.left = `${item.left}%`;
                    if (typeof item.right === "number") vars.right = `${item.right}%`;
                    if (typeof item.bottom === "number") vars.bottom = `${item.bottom}%`;
                    if (item.transform) vars.transform = item.transform;

                    tl.to(imgElement, vars, 0);
                });
            }
        },
        { scope: sectionRef, dependencies: [isMobile] }
    );

    return (
        <section id="performance" ref={sectionRef} className="relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-6">
                Next-level graphics performance. Game on.
            </h2>

            <div className="wrapper relative w-full min-h-[400px]">
                {performanceImages.map((item, index) => (
                    <img
                        key={item.id || index}
                        src={item.src}
                        className={`${item.id} absolute transition-all`}
                        alt={item.alt || `Performance Image #${index + 1}`}
                    />
                ))}
            </div>

            <div className="content mt-12">
                <p className="text-gray-400 text-lg leading-relaxed">
                    Run graphics-intensive workflows with a responsiveness that keeps up
                    with your imagination. The M4 family of chips features a GPU with a
                    second-generation hardware-accelerated ray tracing engine that renders
                    images faster, so{" "}
                    <span className="text-white font-semibold">
                        gaming feels more immersive and realistic than ever.
                    </span>{" "}
                    And Dynamic Caching optimizes fast on-chip memory to dramatically
                    increase average GPU utilization — driving a huge performance boost
                    for the most demanding pro apps and games.
                </p>
            </div>
        </section>
    );
};

export default Performance;