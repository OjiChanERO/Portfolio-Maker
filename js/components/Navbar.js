export function renderNavbar(user) {
    const navbarContainer = document.createElement('div');
    const userDisplay = user
        ? `<div class="navbar-item">
             <div class="buttons">
               <a class="button is-light" data-action="signout">
                 <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                 <span>Log out</span>
               </a>
             </div>
           </div>`
        : `<div class="navbar-item">
             <strong class="has-text-grey">Please sign in to continue</strong>
           </div>`;

    navbarContainer.innerHTML = `
        <nav class="navbar glass-effect" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="#/dashboard">
              <span class="icon-text is-size-4 has-text-weight-bold">
                <span class="icon has-text-primary"><i class="fas fa-briefcase"></i></span>
                <span>PortfolioHub</span>
              </span>
            </a>
          </div>
          <div class="navbar-menu">
            <div class="navbar-end">
              ${userDisplay}
            </div>
          </div>
        </nav>
    `;
    return navbarContainer;
}
