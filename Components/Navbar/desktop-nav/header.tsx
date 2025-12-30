"use client"
import Link from "next/link"
import { Appname, navItems } from "../../../Global-exports/global-exports"
import "./header.css"


export const Main_header=()=>{
    
    return(
        <>
        <div className="main-header-div">
            <div className="brand">
                <img src="/aureon-logo-icon.svg" alt="Aureon logo" className="logo" />
                <span>{Appname}</span>
            </div>
            <div className="main-header-elements">
                <div className="element-header">
                <Link href={navItems[2].path}> {navItems[2].name}</Link>
                </div>
                <div className="element-header">
                <Link href={navItems[1].path}> {navItems[1].name}</Link>
                </div>
                <div className="element-header">
                <Link href={navItems[0].path}> {navItems[0].name}</Link>
                </div>
                <div className="element-header">
                <Link href={navItems[3].path}> {navItems[3].name}</Link>
                </div>
                <div className="profile-element-header">
                <Link href={navItems[4].path}>😊</Link>
                </div>
            </div>
        </div>
        </>
    )
}