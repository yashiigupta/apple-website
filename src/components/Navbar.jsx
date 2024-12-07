import React from 'react';

const Navbar = () => {
  return (
    <header className = "w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className = "w-full flex screen-max-width">
        <img src = "/assets/images/apple.svg" alt = "Apple" width={14} height={18} />
        <div className = "flex flex-1 justify-center items-center max-sm:hidden">
          {['Store', 'Mac', 'iPhone', "Support"].map((nav) => {
            return (
              <div key = {nav} className='px-5 text-sm cursor-pointer text-gray hover:text-white transition-all'>
                {nav}
              </div>
            )
          })}
        </div>
        <div className = "flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <img src = "/assets/images/search.svg" alt = "Apple" width={18} height={18} />
          <img src = "/assets/images/bag.svg" alt = "Apple" width={18} height={18} />
        </div>
      </nav>
    </header>
  )
}

export default Navbar;