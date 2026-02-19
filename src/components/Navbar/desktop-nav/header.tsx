"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Appname, navItems } from "../../Global-exports/global-exports"
import "./header.css"

// Mobile Nav Icons
const MobileIcons: Record<string, React.ReactElement> = {
    menu: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    ),
    movies: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="2 12 12 17 22 12"/>
        </svg>
    ),
    home: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    ),
    settings: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M1 12h6m6 0h6m-13.2 5.2l4.2-4.2m0-6l-4.2-4.2"/>
        </svg>
    ),
    profile: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    list: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
    )
}

const getMobileIcon = (name: string): React.ReactElement => {
    const iconKey = name.toLowerCase().replace(/\s+/g, '')
    return MobileIcons[iconKey] || MobileIcons.menu
}

export const Main_header = () => {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <>
            {/* Desktop/Tablet Navigation */}
            <nav className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
                <Link href="/" className="brand">
                    <div className="logo-container">
                        <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo-img" />
                    </div>
                    <span className="brand-text">{Appname}</span>
                </Link>

                <div className="nav-links">
                    {navItems.slice(0, 4).map((item, index) => {
                        const isActive = pathname === item.path || 
                            (item.path === "/" && pathname === "/") ||
                            (item.path !== "/" && pathname?.startsWith(item.path))
                        
                        return (
                            <Link 
                                key={index} 
                                href={item.path}
                                className={`nav-link ${isActive ? "active" : ""}`}
                            >
                                <span className="nav-link-text">{item.name}</span>
                                {isActive && <span className="active-indicator" />}
                            </Link>
                        )
                    })}
                </div>

                <div className="nav-actions">
                    <Link href={navItems[4]?.path || "/profile"} className="profile-link">
                        <div className={`user-avatar ${pathname === navItems[4]?.path ? "active" : ""}`}>
                            <span>A</span>
                            <div className="avatar-ring" />
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                <div className="mobile-nav-background" />
                <div className="mobile-nav-content">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.path || 
                            (item.path === "/" && pathname === "/") ||
                            (item.path !== "/" && pathname?.startsWith(item.path))
                        
                        return (
                            <Link 
                                key={index}
                                href={item.path}
                                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                            >
                                <div className="mobile-icon-container">
                                    <div className="mobile-icon-bg" />
                                    {getMobileIcon(item.name)}
                                </div>
                                <span className="mobile-nav-label">{item.name}</span>
                                {isActive && (
                                    <div className="mobile-active-indicator">
                                        <div className="mobile-glow" />
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}