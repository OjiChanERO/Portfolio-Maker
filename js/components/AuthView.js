// js/components/AuthView.js
export function renderAuthView() {
    const container = document.createElement('div');
    container.className = 'main-container';
    container.innerHTML = `
        <div class="columns is-centered">
            <div class="column is-half" style="margin-top: 5vh;">
                <div class="box glass-effect">
                    <h1 class="title has-text-centered">PortfolioHub</h1>
                    <p class="subtitle has-text-centered">Sign in or create an account</p>
                    <form id="auth-form">
                        <div class="field">
                            <label class="label">Full Name (for signup)</label>
                            <div class="control has-icons-left">
                                <!-- ADDED autocomplete="name" -->
                                <input class="input" type="text" name="fullName" placeholder="e.g. Alex Smith" autocomplete="name">
                                <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control has-icons-left">
                                <!-- ADDED autocomplete="email" -->
                                <input class="input" type="email" name="email" placeholder="e.g. alex@example.com" required autocomplete="email">
                                <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control has-icons-left">
                                <!-- ADDED autocomplete="current-password" -->
                                <input class="input" type="password" name="password" placeholder="********" required autocomplete="current-password">
                                <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                            </div>
                        </div>
                        <div class="field is-grouped">
                            <div class="control">
                                <button type="submit" class="button is-primary" data-action="signin">
                                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                                    <span>Sign In</span>
                                </button>
                            </div>
                            <div class="control">
                                <button type="button" class="button is-light" data-action="signup">
                                    <span class="icon"><i class="fas fa-user-plus"></i></span>
                                    <span>Sign Up</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    return container;
}
