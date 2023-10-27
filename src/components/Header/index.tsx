import { HeaderContainer } from "./styles";
import logo from '../../assets/logo.svg'
import {Timer, Scroll } from 'phosphor-react'
import { NavLink } from "react-router-dom";

export function Header(){
    return(
        <HeaderContainer>
            <span>
                <img src={logo} alt="Pomodoro timer" />
            </span>
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24}/>
                </NavLink>
                <NavLink to="/history" title="History">
                    <Scroll size={24}/>
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}