"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface IconRowContextType {
	isVisible: boolean;
	toggle: () => void;
}

const IconRowContext = createContext<IconRowContextType | undefined>(undefined);

export function IconRowProvider({ children }: { children: ReactNode }) {
	const [isVisible, setIsVisible] = useState(false);

	const toggle = () => {
		setIsVisible((prev) => !prev);
	};

	return (
		<IconRowContext.Provider value={{ isVisible, toggle }}>
			{children}
		</IconRowContext.Provider>
	);
}

export function useIconRow() {
	const context = useContext(IconRowContext);
	if (context === undefined) {
		throw new Error("useIconRow must be used within an IconRowProvider");
	}
	return context;
}
