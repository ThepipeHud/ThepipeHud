// Funcionalidad del círculo de usuario y autenticación

class UserAuth {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initEventListeners();
        this.updateUserButton();
        this.updateUserMenu();
        this.updateFavoriteButton();
    }

    initEventListeners() {
        const loginLink = document.querySelector('[href="#login"]');
        const signupLink = document.querySelector('[href="#signup"]');
        this.userMenu = document.querySelector('.user-menu');

        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupModal();
            });
        }

        if (this.userMenu) {
            this.userMenu.addEventListener('click', (e) => this.handleMenuClick(e));
        }

        const favoriteBtn = document.querySelector('.favorite-toggle');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
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
        modal.id = `${type}-modal`;

        if (type === 'login') {
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-avatar">
                            <div class="user-placeholder"><span class="user-icon">👤</span></div>
                        </div>
                        <h2>Iniciar sesión</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email:</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Contraseña:</label>
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
                        <div class="modal-avatar">
                            <div class="user-placeholder"><span class="user-icon">👤</span></div>
                        </div>
                        <h2>Crear cuenta</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-email">Email:</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Contraseña:</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm">Confirmar contraseña:</label>
                            <input type="password" id="signup-confirm" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-name">Nombre completo:</label>
                            <input type="text" id="signup-name" placeholder="Tu nombre">
                        </div>
                        <div class="form-group">
                            <label for="signup-nickname">Apodo:</label>
                            <input type="text" id="signup-nickname" placeholder="Tu apodo">
                        </div>
                        <!-- Avatar se asigna desde el modal de perfil mediante subida local -->
                        <button type="submit" class="btn-submit">Crear cuenta</button>
                    </form>
                </div>
            `;
        }

        // Cerrar modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Manejar envío del formulario
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
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
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;

        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.updateUserButton();
            this.updateUserMenu();
            this.updateFavoriteButton();
        }
    }

    handleSignup(form) {
        const email = form.querySelector('#signup-email').value;
        const password = form.querySelector('#signup-password').value;
        const confirm = form.querySelector('#signup-confirm').value;
        const fullName = form.querySelector('#signup-name').value;
        const nickname = form.querySelector('#signup-nickname').value;

        if (password !== confirm) {
            return;
        }

        if (this.users.find(u => u.email === email)) {
            return;
        }

        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            profile: {
                name: fullName || '',
                nickname: nickname || '',
                avatar: ''
            },
            favorites: []
        };

        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateUserButton();
        this.updateUserMenu();
        this.updateFavoriteButton();
    }

    updateUserButton() {
        const userBtn = document.querySelector('.user-btn');
        if (!userBtn) return;

        if (this.currentUser && this.currentUser.profile && this.currentUser.profile.avatar) {
            userBtn.innerHTML = `<img class="user-avatar" src="${this.currentUser.profile.avatar}" alt="Avatar de usuario">`;
        } else {
            userBtn.innerHTML = '<div class="user-placeholder"><span class="user-icon">👤</span></div>';
        }

        userBtn.style.background = 'var(--surface-alt)';
        if (this.currentUser) {
            userBtn.title = this.currentUser.email;
        } else {
            userBtn.removeAttribute('title');
        }
    }

    isFavorite() {
        if (!this.currentUser) return false;
        return Array.isArray(this.currentUser.favorites) && this.currentUser.favorites.includes('soul-eater');
    }

    toggleFavorite() {
        if (!this.currentUser) return;
        this.currentUser.favorites = Array.isArray(this.currentUser.favorites) ? this.currentUser.favorites : [];
        const favoriteIndex = this.currentUser.favorites.indexOf('soul-eater');

        if (favoriteIndex === -1) {
            this.currentUser.favorites.push('soul-eater');
        } else {
            this.currentUser.favorites.splice(favoriteIndex, 1);
        }

        this.saveCurrentUser();
        this.syncCurrentUserToUsers();
        this.updateFavoriteButton();
    }

    updateFavoriteButton() {
        const favoriteBtn = document.querySelector('.favorite-toggle');
        if (!favoriteBtn) return;
        if (this.currentUser) {
            favoriteBtn.style.display = 'inline-flex';
            if (this.isFavorite()) {
                favoriteBtn.textContent = '★';
                favoriteBtn.classList.add('active');
                favoriteBtn.setAttribute('aria-label', 'Quitar de favoritos');
            } else {
                favoriteBtn.textContent = '☆';
                favoriteBtn.classList.remove('active');
                favoriteBtn.setAttribute('aria-label', 'Agregar a favoritos');
            }
        } else {
            favoriteBtn.style.display = 'none';
        }
    }

    updateUserMenu() {
        if (!this.userMenu) return;

        if (this.currentUser) {
            this.userMenu.innerHTML = `
                <a href="#profile" data-action="profile"><span class="menu-icon"><img class="menu-avatar-img" src="${this.currentUser.profile && this.currentUser.profile.avatar ? this.currentUser.profile.avatar : '../ThepipeHud.jpeg'}" alt="avatar"></span>Mi perfil</a>
                <a href="#logout" data-action="logout">Cerrar sesión</a>
            `;
        } else {
            this.userMenu.innerHTML = `
                <a href="#login" data-action="login"><span class="menu-icon"><div class="user-placeholder"><span class="user-icon">👤</span></div></span>Iniciar sesión</a>
                <a href="#signup" data-action="signup"><span class="menu-icon"><div class="user-placeholder"><span class="user-icon">👤</span></div></span>Crear cuenta</a>
            `;
        }
    }

    handleMenuClick(e) {
        const link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();

        const action = link.dataset.action;
        if (action === 'login') {
            this.showLoginModal();
        } else if (action === 'signup') {
            this.showSignupModal();
        } else if (action === 'logout') {
            this.logout();
            this.updateUserButton();
            this.updateUserMenu();
        } else if (action === 'profile') {
            this.showProfileModal();
        }
    }

    showProfileModal() {
        const profile = this.currentUser.profile || {};
        const favoriteLabel = this.isFavorite() ? 'Sí' : 'No';

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content profile-modal">
                <div class="modal-header">
                    <h2>Mi perfil</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="profile-form">
                    <div class="profile-preview">
                        <div class="avatar-wrap">
                            ${profile.avatar ? `<img src="${profile.avatar}" alt="Avatar de usuario">` : '<span class="profile-icon">👤</span>'}
                            <button type="button" class="edit-pencil" aria-label="Editar avatar">✎</button>
                        </div>
                        <div>
                            <p class="profile-name">${profile.name || 'Nombre no registrado'}</p>
                            <p class="profile-nickname">${profile.nickname ? `@${profile.nickname}` : 'Sin apodo'}</p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" value="${this.currentUser.email}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="profile-name">Nombre completo</label>
                            <input type="text" id="profile-name" value="${profile.name || ''}" placeholder="Tu nombre">
                        </div>
                        <div class="form-group">
                            <label for="profile-nickname">Apodo</label>
                            <input type="text" id="profile-nickname" value="${profile.nickname || ''}" placeholder="Tu apodo">
                        </div>
                        <p><strong>Favorito:</strong> ${favoriteLabel}</p>
                        <input type="file" id="profile-avatar-file" accept="image/*" style="display:none">
                        <button type="submit" class="btn-submit">Guardar cambios</button>
                    </div>
                </form>
            </div>
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        const form = modal.querySelector('#profile-form');
        const avatarFileInput = modal.querySelector('#profile-avatar-file');
        const avatarWrap = modal.querySelector('.avatar-wrap');
        const avatarImg = modal.querySelector('.profile-preview img');

        // Click en el wrap o lápiz abre el selector de archivos
        avatarWrap.addEventListener('click', () => avatarFileInput.click());
        const editPencil = modal.querySelector('.edit-pencil');
        if (editPencil) editPencil.addEventListener('click', (e) => { e.stopPropagation(); avatarFileInput.click(); });

        // Cambio: leer directamente el archivo y guardar como data URL (sin recorte)
        const processFile = (file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                this.currentUser.profile = this.currentUser.profile || {};
                this.currentUser.profile.avatar = dataUrl;
                this.saveCurrentUser();
                this.syncCurrentUserToUsers();
                this.updateUserButton();

                // actualizar vista del modal
                const existingImg = modal.querySelector('.profile-preview img');
                if (existingImg) {
                    existingImg.src = dataUrl;
                } else {
                    const span = modal.querySelector('.profile-icon');
                    const imgEl = document.createElement('img');
                    imgEl.src = dataUrl; imgEl.alt = 'Avatar de usuario';
                    avatarWrap.replaceChild(imgEl, span);
                }
            };
            reader.readAsDataURL(file);
        };

        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            processFile(file);
        });

        // Soporte de arrastrar y soltar en avatarWrap (sin cropper)
        avatarWrap.addEventListener('dragover', (ev) => { ev.preventDefault(); avatarWrap.classList.add('drag-over'); });
        avatarWrap.addEventListener('dragleave', () => { avatarWrap.classList.remove('drag-over'); });
        avatarWrap.addEventListener('drop', (ev) => {
            ev.preventDefault();
            avatarWrap.classList.remove('drag-over');
            const file = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
            if (file) processFile(file);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#profile-name').value.trim();
            const nickname = form.querySelector('#profile-nickname').value.trim();

            this.currentUser.profile = this.currentUser.profile || {};
            this.currentUser.profile.name = name;
            this.currentUser.profile.nickname = nickname;

            this.saveCurrentUser();
            this.syncCurrentUserToUsers();
            this.updateUserButton();
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    loadUsers() {
        const stored = localStorage.getItem('thepipe_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('thepipe_users', JSON.stringify(this.users));
    }

    syncCurrentUserToUsers() {
        if (!this.currentUser || !this.currentUser.email) return;
        const existingIndex = this.users.findIndex(u => u.email === this.currentUser.email);
        if (existingIndex !== -1) {
            this.users[existingIndex] = this.currentUser;
        } else {
            this.users.push(this.currentUser);
        }
        this.saveUsers();
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

    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateUserButton();
        this.updateFavoriteButton();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new UserAuth();
});
