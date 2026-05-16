class UserAuth {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initEventListeners();
        this.updateUserButton();
        this.updateUserMenu();
    }

    initEventListeners() {
        document.querySelectorAll('[href="#login"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.showLoginModal();
            });
        });

        document.querySelectorAll('[href="#signup"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.showSignupModal();
            });
        });
    }

    loadUsers() {
        const stored = localStorage.getItem('thepipe_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('thepipe_users', JSON.stringify(this.users));
    }

    loadCurrentUser() {
        const stored = localStorage.getItem('thepipe_current_user');
        return stored ? JSON.parse(stored) : null;
    }

    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('thepipe_current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('thepipe_current_user');
        }
    }

    showLoginModal() {
        const modal = this.createModal('login');
        document.body.appendChild(modal);
    }

    showSignupModal() {
        const modal = this.createModal('signup');
        document.body.appendChild(modal);
    }

    createModal(type) {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.dataset.modalType = type;

        if (type === 'login') {
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Iniciar sesión</h2>
                        <button class="modal-close" aria-label="Cerrar">&times;</button>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Contraseña</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn-submit">Iniciar sesión</button>
                    </form>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Crear cuenta</h2>
                        <button class="modal-close" aria-label="Cerrar">&times;</button>
                    </div>
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Contraseña</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm">Confirmar contraseña</label>
                            <input type="password" id="signup-confirm" required>
                        </div>
                        <button type="submit" class="btn-submit">Crear cuenta</button>
                    </form>
                </div>
            `;
        }

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => modal.remove());

        const form = modal.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (type === 'login') {
                this.handleLogin(form);
            } else {
                this.handleSignup(form);
            }
            modal.remove();
        });

        return modal;
    }

    handleLogin(form) {
        const email = form.querySelector('#login-email').value.trim();
        const password = form.querySelector('#login-password').value.trim();
        const user = this.users.find((u) => u.email === email && u.password === password);

        if (!user) {
            alert('Email o contraseña incorrecta.');
            return;
        }

        this.currentUser = user;
        this.saveCurrentUser();
        this.updateUserButton();
    }

    handleSignup(form) {
        const email = form.querySelector('#signup-email').value.trim();
        const password = form.querySelector('#signup-password').value.trim();
        const confirm = form.querySelector('#signup-confirm').value.trim();

        if (password !== confirm) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (this.users.some((u) => u.email === email)) {
            alert('Ya existe una cuenta con ese email.');
            return;
        }

        const newUser = {
            id: Date.now(),
            email,
            password,
            profile: { avatar: '', name: '', nickname: '' },
            favorites: []
        };

        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateUserButton();
    }

    updateUserButton() {
        const userBtn = document.querySelector('.user-btn');
        if (!userBtn) return;

        if (this.currentUser && this.currentUser.profile && this.currentUser.profile.avatar) {
            userBtn.innerHTML = `<img class="user-avatar" src="${this.currentUser.profile.avatar}" alt="Avatar de usuario">`;
        } else {
            userBtn.innerHTML = '<div class="user-placeholder"><span class="user-icon">👤</span></div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserAuth();
});