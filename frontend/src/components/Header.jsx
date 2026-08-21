import './Header.css';
import {FaSignInAlt,FaSignOutAlt,FaUser} from 'react-icons/fa'


 import { Link } from 'react-router-dom'
function Header() {
  return (
    <header className='header'>
        <div className='logo'>
         <Link to='/'>Task Setter</Link>
          <div class="header-right">
                <Link to='/login'>
                <FaSignInAlt/> login
                </Link>
                <Link to='/register '>
                <FaUser/> Register
                </Link>
          </div>
        </div>
    </header> 
  )
}

export default Header