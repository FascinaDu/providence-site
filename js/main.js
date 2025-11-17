/* main.js */
(function() {
    'use strict';

    const App = {
        init() {
            this.setupMenuToggle();
            this.setupSmoothScroll();
            this.setupCurrentYear();
            this.setupFormValidation();
            this.setupScrollHeader();
            this.setupActiveNavLink();
            this.setupScrollToTop();
        },

        setupMenuToggle() {
            const menuToggle = document.querySelector('.navbar__toggle');
            const nav = document.querySelector('.navbar__menu');
            const navLinks = document.querySelectorAll('.navbar__link');

            if (!menuToggle || !nav) {
                console.warn('Menu toggle ou navbar__menu não encontrado');
                return;
            }

            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = nav.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', isOpen);
                
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
                
                console.log('Menu toggled:', isOpen);
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    menuToggle.focus();
                }
            });
        },

        setupSmoothScroll() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    if (href === '#' || href === '') return;
                    
                    const target = document.querySelector(href);
                    
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        if (target.hasAttribute('tabindex') || target.tagName === 'A' || target.tagName === 'BUTTON') {
                            target.focus({ preventScroll: true });
                        }
                    }
                });
            });
        },

        setupCurrentYear() {
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        },

        setupFormValidation() {
            const form = document.getElementById('contact-form');
            
            if (!form) return;

            const inputs = form.querySelectorAll('.form__input, .form__textarea');

            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateField(input);
                    }
                });
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!this.validateField(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    this.submitForm(form);
                }
            });
        },

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            this.removeError(field);

            if (!value && field.hasAttribute('required')) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Digite um e-mail válido';
                }
            } else if (field.type === 'tel' && value) {
                const phoneRegex = /^[\d\s\-\(\)\+]+$/;
                if (!phoneRegex.test(value) || value.length < 10) {
                    isValid = false;
                    errorMessage = 'Digite um telefone válido';
                }
            }

            if (!isValid) {
                this.showError(field, errorMessage);
            }

            return isValid;
        },

        showError(field, message) {
            field.classList.add('is-invalid');
            
            let errorElement = field.parentElement.querySelector('.form__error');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'form__error';
                errorElement.setAttribute('role', 'alert');
                errorElement.style.color = '#DC3545';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.style.display = 'block';
                field.parentElement.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        },

        removeError(field) {
            field.classList.remove('is-invalid');
            
            const errorElement = field.parentElement.querySelector('.form__error');
            if (errorElement) {
                errorElement.remove();
            }
        },

        submitForm(form) {
            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Enviando...';

            // Simulação de envio (substitua pela sua lógica de backend)
            setTimeout(() => {
                this.showSuccessMessage(form);
                form.reset();
                button.disabled = false;
                button.textContent = originalText;
            }, 1500);

            /* Para envio real via email/backend, descomente e configure:
            
            fetch('seu-endpoint-aqui.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    this.showSuccessMessage(form);
                    form.reset();
                } else {
                    throw new Error('Erro ao enviar formulário');
                }
            })
            .catch(error => {
                this.showErrorMessage(form);
                console.error('Erro:', error);
            })
            .finally(() => {
                button.disabled = false;
                button.textContent = originalText;
            });
            */
        },

        showSuccessMessage(form) {
            const message = document.createElement('div');
            message.className = 'form-message form-message--success';
            message.setAttribute('role', 'status');
            message.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            message.style.padding = '1rem';
            message.style.marginBottom = '1.5rem';
            message.style.backgroundColor = '#28A745';
            message.style.color = '#FFFFFF';
            message.style.borderRadius = '0.5rem';
            message.style.textAlign = 'center';
            message.style.fontWeight = '500';
            
            form.insertAdjacentElement('beforebegin', message);
            
            setTimeout(() => {
                message.style.transition = 'opacity 0.3s';
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 5000);
        },

        showErrorMessage(form) {
            const message = document.createElement('div');
            message.className = 'form-message form-message--error';
            message.setAttribute('role', 'alert');
            message.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente.';
            message.style.padding = '1rem';
            message.style.marginBottom = '1.5rem';
            message.style.backgroundColor = '#DC3545';
            message.style.color = '#FFFFFF';
            message.style.borderRadius = '0.5rem';
            message.style.textAlign = 'center';
            message.style.fontWeight = '500';
            
            form.insertAdjacentElement('beforebegin', message);
            
            setTimeout(() => {
                message.style.transition = 'opacity 0.3s';
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 5000);
        },

        setupScrollHeader() {
            const header = document.querySelector('.header');

            if (!header) return;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        },

        setupActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.navbar__link');

            if (!sections.length || !navLinks.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        
                        navLinks.forEach(link => {
                            link.classList.remove('navbar__link--active');
                            
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('navbar__link--active');
                            }
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                observer.observe(section);
            });
        },

        setupScrollToTop() {
            const scrollToTopBtn = document.querySelector('.scroll-to-top');

            if (!scrollToTopBtn) return;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // Inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

})();
