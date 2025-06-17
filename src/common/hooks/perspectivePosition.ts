import { useEffect, useRef } from 'react';

export function usePerspectiveEffect(mouseReactContainerId: string, layerId: string, constrainAmount: number = 20) {
    const constrainRef = useRef(constrainAmount);
    
    useEffect(() => {
        const mouseOverContainer = document.getElementById(mouseReactContainerId);
        const layerElement = document.getElementById(layerId);
        
        if (!mouseOverContainer || !layerElement) return;
        
        function transforms(x: number, y: number, el: HTMLElement) {
            const box = el.getBoundingClientRect();
            const calcX = -(y - box.y - (box.height / 2)) / constrainRef.current;
            const calcY = (x - box.x - (box.width / 2)) / constrainRef.current;
            
            return "perspective(100px) "
                + "   rotateX("+ calcX +"deg) "
                + "   rotateY("+ calcY +"deg) ";
        }
        
        function transformElement(el: HTMLElement, xyEl: [number, number, HTMLElement]) {
            el.style.transform = transforms.apply(null, xyEl);
        }
        
        function handleMouseMove(e: MouseEvent) {
            const xy = [e.clientX, e.clientY] as [number, number];
            const position = [...xy, layerElement] as [number, number, HTMLElement];
            
            window.requestAnimationFrame(() => {
                transformElement(layerElement!, position);
            });
        }
        
        mouseOverContainer.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            mouseOverContainer.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseReactContainerId, layerId]);
}