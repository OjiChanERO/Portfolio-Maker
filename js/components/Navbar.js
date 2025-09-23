export function renderNavbar(user, currentPath = '#/dashboard') {
  const navbarContainer = document.createElement('div');
  
  const userDisplay = user
      ? `<div class="navbar-item">
           <div class="buttons">
             <span class="navbar-item has-text-weight-medium">
               Welcome back!
             </span>
             <a class="button is-light" data-action="signout">
               <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
               <span>Log out</span>
             </a>
           </div>
         </div>`
      : `<div class="navbar-item">
           <span class="has-text-grey">Please sign in to continue</span>
         </div>`;

  // Navigation items with active states
  const navigationItems = `
    <div class="navbar-start">
      <a class="navbar-item ${currentPath === '#/dashboard' ? 'is-active' : ''}" href="#/dashboard">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-tachometer-alt"></i>
          </span>
          <span>Dashboard</span>
        </span>
      </a>
      <a class="navbar-item ${currentPath === '#/skillmap' ? 'is-active' : ''}" href="#/skillmap">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-project-diagram"></i>
          </span>
          <span>Skill Map</span>
        </span>
      </a>
    </div>
  `;

  navbarContainer.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item" href="#/dashboard">
              <span class="icon-text is-size-3 has-text-weight-bold">
                <span class="icon has-text-primary mr-2">
                  <i class="fas fa-briefcase"></i>
                </span>
                <span>PortfolioHub</span>
              </span>
            </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div id="navbarMenu" class="navbar-menu">
            ${user ? navigationItems : ''}
            <div class="navbar-end">
              ${userDisplay}
            </div>
          </div>
        </div>
      </nav>
  `;

  // Add mobile menu toggle
  const burger = navbarContainer.querySelector('.navbar-burger');
  const menu = navbarContainer.querySelector('.navbar-menu');
  
  if (burger && menu) {
      burger.addEventListener('click', () => {
          burger.classList.toggle('is-active');
          menu.classList.toggle('is-active');
      });
  }

  return navbarContainer;
}
