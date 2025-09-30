import '../assets/css/bulma.min.css'
import '../assets/css/styles.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
    const [isMenuActive, setMenuActive] = useState(false)

    const BarrMenu = () => {
        setMenuActive(!isMenuActive)
    }
    return ( 
    <>
    <nav className='navbar is-fixed-top' role='navigation' aria-label='main navigation'>
        <div className='navbar-brand mt-2 mb-2'>
            <Link to={'/'} className='navbar-item'>
            <strong>COSETTE</strong>
            </Link>
            <Link role='button' className={`navbar-burger has-text-white ${isMenuActive ? 'is-active' : ''}`} data-target="navMenu" aria-label='menu' aria-expanded={isMenuActive} onClick={BarrMenu}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </Link>
        </div>
        <div className={`navbar-menu ${isMenuActive ? 'is-active' : ''}`} id='navMenu'>
            <div className='navbar-start'>
                <Link to="/status" className='navbar-item is-tab' onClick={() => setMenuActive(false)}>Status</Link>
                <Link to="/sobre" className='navbar-item is-tab' onClick={() => setMenuActive(false)}>Sobre</Link>
                <Link to="/contato" className='navbar-item is-tab' onClick={() => setMenuActive(false)}>Contato</Link>
                <Link to="/docs" className='navbar-item is-tab' onClick={() => setMenuActive(false)}>Docs</Link>
            </div>
        </div>
    </nav>
    </> );
}
 
export default Header;<></>