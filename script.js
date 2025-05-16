/**
 * MaplePoint Group - Main JavaScript
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initAccordion();
    initValueCards();
    initLazyLoading();
    initFormValidation();
    initSmoothScrolling();
  });
  
  /**
   * Mobile Menu Toggle Functionality
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!menuToggle || !menu) return;
  
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('active');
      
      // Toggle menu icon between hamburger and close
      const menuIcon = menuToggle.querySelector('.menu-icon');
      if (menuIcon) {
        menuIcon.innerHTML = isExpanded ? 
          '<path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' : 
          '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      
      // Prevent body scrolling when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
  
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  /**
   * Accordion Functionality
   */
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Close all other accordion items
        accordionHeaders.forEach(item => {
          if (item !== header) {
            item.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current accordion item
        header.setAttribute('aria-expanded', !isExpanded);
      });
    });
  }
  
  /**
   * Value Cards Animation
   */
  function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    if (valueCards.length === 0) return;
    
    valueCards.forEach(card => {
      card.addEventListener('click', () => {
        // Toggle active class on the clicked card
        card.classList.toggle('active');
        
        // Update the max-height of content based on actual content height
        const content = card.querySelector('.value-content');
        if (content) {
          if (card.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0';
          }
        }
      });
    });
  }
  
  /**
   * Lazy Loading for Images
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.innerHTML = '';  // Clear placeholder
              if (src.endsWith('.svg')) {
                // Load SVG content
                fetch(src)
                  .then(response => response.text())
                  .then(svgContent => {
                    img.innerHTML = svgContent;
                    img.classList.add('loaded');
                  })
                  .catch(error => {
                    console.error('Error loading SVG:', error);
                  });
              } else {
                // For other image types (which shouldn't be used in this project)
                console.warn('Non-SVG images are not recommended for this project');
              }
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src && src.endsWith('.svg')) {
          fetch(src)
            .then(response => response.text())
            .then(svgContent => {
              img.innerHTML = svgContent;
              img.classList.add('loaded');
            })
            .catch(error => {
              console.error('Error loading SVG:', error);
            });
        }
      });
    }
  }
  
  /**
   * Form Validation
   */
  function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset previous errors
      const errorMessages = contactForm.querySelectorAll('.error-message');
      errorMessages.forEach(msg => {
        msg.textContent = '';
      });
      
      const formInputs = contactForm.querySelectorAll('input, select, textarea');
      formInputs.forEach(input => {
        input.classList.remove('error');
      });
      
      // Validate form fields
      let isValid = true;
      
      // Name validation
      const nameInput = contactForm.querySelector('#name');
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      }
      
      // Email validation
      const emailInput = contactForm.querySelector('#email');
      if (emailInput) {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue) {
          showError(emailInput, 'Please enter your email address');
          isValid = false;
        } else if (!emailPattern.test(emailValue)) {
          showError(emailInput, 'Please enter a valid email address');
          isValid = false;
        }
      }
      
      // Service dropdown validation
      const serviceSelect = contactForm.querySelector('#service');
      if (serviceSelect && !serviceSelect.value) {
        showError(serviceSelect, 'Please select a service');
        isValid = false;
      }
      
      // Message validation
      const messageTextarea = contactForm.querySelector('#message');
      if (messageTextarea && !messageTextarea.value.trim()) {
        showError(messageTextarea, 'Please enter your message');
        isValid = false;
      }
      
      // If all validations pass, show success message
      if (isValid) {
        // In a real application, you would send form data to a server here
        // For this example, we'll just show a success message
        contactForm.classList.add('hidden');
        
        const formSuccess = document.getElementById('form-success');
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
          formSuccess.classList.add('visible');
        }
        
        // Reset form for future use
        contactForm.reset();
      }
    });
    
    // Helper function to show error messages
    function showError(input, message) {
      input.classList.add('error');
      const errorContainer = input.nextElementSibling;
      if (errorContainer && errorContainer.classList.contains('error-message')) {
        errorContainer.textContent = message;
      }
    }
  }
  
  /**
   * Smooth Scrolling for Anchor Links
   */
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          const menu = document.querySelector('.menu');
          const menuToggle = document.querySelector('.menu-toggle');
          if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
          }
          
          // Scroll to the target element
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for header height
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Helper Functions
   */
  
  // Debounce function to limit execution of event handlers
  function debounce(func, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  // Add event listeners with reduced performance impact
  window.addEventListener('resize', debounce(() => {
    // Reset mobile menu state on window resize
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (window.innerWidth > 768 && menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }, 250));
  
  // Handle page scroll for animations
  window.addEventListener('scroll', debounce(() => {
    // Potential scroll-based animations could be added here
  }, 20));
  


  