"use client";
import { useRef, useEffect } from "react";

export default function InfiniteScrollSentinel({onVisible}: {onVisible: ()=>void}) {
    const ref = useRef<HTMLDivElement>(null);
    const onVisibleRef = useRef(onVisible); 
    onVisibleRef.current = onVisible;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onVisibleRef.current();
                }
            }, {rootMargin: "200px"} // determines the height at which the fetch triggers 
        )

        observer.observe(el);
        return () => observer.disconnect();
    }, [onVisible]); 

    return <div ref={ref} className="h-12.5"></div>;
}