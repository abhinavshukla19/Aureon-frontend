"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Appname, navItems } from "../../../Global-exports/global-exports"
import "./header.css"


export const Main_header=()=>{
    const pathname = usePathname()
    
    return(
        <>
        <div className="main-header-div">
            <Link href="/" className="brand">
                <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo" />
                <span>{Appname}</span>
            </Link>
            <div className="main-header-elements">
                {navItems.slice(0, 4).map((item, index) => {
                    const isActive = pathname === item.path || 
                        (item.path === "/" && pathname === "/") ||
                        (item.path !== "/" && pathname?.startsWith(item.path));
                    
                    return (
                        <div key={index} className={`element-header ${isActive ? "active" : ""}`}>
                            <Link href={item.path}>{item.name}</Link>
                        </div>
                    );
                })}
                <div className={`profile-element-header ${pathname === navItems[4].path ? "active" : ""}`}>
                    <Link href={navItems[4].path}>😊</Link>
                </div>
            </div>
        </div>
        </>
    )
}