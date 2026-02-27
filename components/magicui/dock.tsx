"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useRef } from "react";

export interface DockProps extends VariantProps<typeof dockVariants> {
    className?: string;
    iconSize?: number;
    iconMagnification?: number;
    iconDistance?: number;
    direction?: "top" | "middle" | "bottom";
    children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
    "mx-auto w-max max-w-[calc(100vw-2rem)] h-full p-2 flex items-end gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    (
        {
            className,
            children,
            iconSize = 40,
            iconMagnification = DEFAULT_MAGNIFICATION,
            iconDistance = DEFAULT_DISTANCE,
            direction = "bottom",
            ...props
        },
        ref,
    ) => {
        const mouseX = useMotionValue(Infinity);

        const renderChildren = () => {
            return React.Children.map(children, (child) => {
                if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
                    return React.cloneElement(child, {
                        ...child.props,
                        mouseX: mouseX,
                        size: iconSize,
                        magnification: iconMagnification,
                        distance: iconDistance,
                    });
                }
                return child;
            });
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                {...props}
                className={cn(dockVariants({ className }), {
                    "items-start": direction === "top",
                    "items-center": direction === "middle",
                    "items-end": direction === "bottom",
                })}
            >
                {renderChildren()}
            </motion.div>
        );
    },
);

Dock.displayName = "Dock";

export interface DockIconProps {
    size?: number;
    magnification?: number;
    distance?: number;
    mouseX?: any;
    className?: string;
    children?: React.ReactNode;
    props?: React.PropsWithChildren;
    label?: string;
    onClick?: () => void;
}

const DockIcon = ({
    size,
    magnification,
    distance,
    mouseX,
    className,
    children,
    label,
    onClick,
    ...props
}: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            layout
            initial={{ width: size, height: size }}
            animate={{
                width: isHovered && label ? "auto" : size,
            }}
            className={cn(
                "flex cursor-pointer items-center justify-start rounded-full overflow-hidden",
                className,
            )}
            transition={{
                type: "spring",
                stiffness: 600, // Increased stiffness for a much faster open
                damping: 25     // Lower damping for a snappier feeling
            }}
            {...props}
        >
            <div className="flex items-center justify-center whitespace-nowrap h-full">
                <div
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: size, height: size }}
                >
                    {children}
                </div>
                <AnimatePresence>
                    {isHovered && label && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 600,
                                damping: 25,
                            }}
                            className="text-sm font-medium overflow-hidden"
                        >
                            <span className="pl-1 pr-4 inline-block">{label}</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
