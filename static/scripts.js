document.addEventListener('DOMContentLoaded', function() {
    // Chat widget enhancements for iMessage-like animations
    function enhanceChatWidget() {
        // Wait for the chat widget to be fully loaded
        const checkInterval = setInterval(() => {
            const chatWidget = document.querySelector('.chat-widget-container');
            if (chatWidget) {
                clearInterval(checkInterval);
                setupChatWidgetAnimations();
            }
        }, 500);

        // Maximum check time of 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    function setupChatWidgetAnimations() {
        // Create a MutationObserver to watch for new messages
        const messagesContainer = document.querySelector('.chat-widget-messages-container');
        if (!messagesContainer) return;

        // Create and add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-widget-typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.style.display = 'none';
        messagesContainer.appendChild(typingIndicator);

        // Watch for new messages
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Process each added node
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if it's a message
                            if (node.classList && (
                                node.classList.contains('chat-widget-message') || 
                                node.classList.contains('user-message') || 
                                node.classList.contains('assistant-message')
                            )) {
                                // Apply animations based on message type
                                if (node.classList.contains('user') || node.classList.contains('user-message')) {
                                    node.style.animationName = 'message-slide-in-right';
                                } else {
                                    node.style.animationName = 'message-slide-in-left';
                                    
                                    // Hide typing indicator when assistant message arrives
                                    typingIndicator.style.display = 'none';
                                }
                            }
                        }
                    });
                }
            });
        });

        // Start observing
        observer.observe(messagesContainer, { childList: true, subtree: true });

        // Intercept the send button click to show typing indicator
        const sendButton = document.querySelector('.chat-widget-send-button');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                // Show typing indicator after user sends a message
                setTimeout(() => {
                    typingIndicator.style.display = 'flex';
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                    // Hide typing indicator after a random time (1-3 seconds)
                    setTimeout(() => {
                        typingIndicator.style.display = 'none';
                    }, Math.random() * 2000 + 1000);
                }, 500);
            });
        }

        // Also intercept Enter key in the input field
        const inputField = document.querySelector('.chat-widget-input');
        if (inputField) {
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // Show typing indicator after user sends a message
                    setTimeout(() => {
                        typingIndicator.style.display = 'flex';
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        
                        // Hide typing indicator after a random time (1-3 seconds)
                        setTimeout(() => {
                            typingIndicator.style.display = 'none';
                        }, Math.random() * 2000 + 1000);
                    }, 500);
                }
            });
        }
    }

    // Initialize chat widget enhancements
    enhanceChatWidget();

    // Ensure all project buttons work correctly
    const projectButtons = document.querySelectorAll('.button.github-button, .button.demo-button, .button.paper-button');
    projectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default only if there's an issue
            if (!this.getAttribute('href')) {
                e.preventDefault();
                console.error('Button missing href attribute:', this);
            } else {
                console.log('Opening link:', this.getAttribute('href'));
                // The default behavior will open the link
            }
        });
    });
    // Add parallax effect to background elements
    const parallaxElements = document.querySelectorAll('.particle, .cyber-circle, .cyber-line');
    parallaxElements.forEach(element => {
        element.classList.add('parallax');
    });
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || Math.random() * 0.05 + 0.01);
            const offsetX = (0.5 - mouseX) * speed * 100;
            const offsetY = (0.5 - mouseY) * speed * 100;
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
    
    // Typing animation
    const typingElements = document.querySelectorAll('.typing-element');
    typingElements.forEach(element => {
        const text = element.getAttribute('data-text') || element.textContent;
        element.textContent = '';
        element.classList.add('typing');
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                element.classList.remove('typing');
            }
        }
        
        // Start typing effect when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    });
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let suffix = '';
        let displayValue;
        
        // Check if this is the Universities/Organisation Speech counter (value of 6)
        const isUniversitySpeech = target === 6 && 
            counter.closest('.stat-card') && 
            counter.closest('.stat-card').querySelector('.stat-label').textContent.includes('Universities');
        
        // Format the number with appropriate suffix
        if (target >= 1000000) {
            suffix = 'M+';
            displayValue = (target / 1000000).toFixed(1);
        } else if (target >= 1000) {
            suffix = 'K+';
            displayValue = (target / 1000).toFixed(0);
        } else if (target > 100 || isUniversitySpeech) {
            suffix = isUniversitySpeech ? '' : '+';
            displayValue = target;
        } else {
            suffix = '%';
            displayValue = target;
        }
        
        // Add animation effect
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const increment = target > 100 ? Math.ceil(target / (duration / 20)) : 1;
        const startTime = performance.now();
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (target > 100) {
                startValue = Math.min(Math.floor(target * progress), target);
            } else {
                startValue = Math.min(Math.floor(target * progress), target);
            }
            
            // Format the display
            let currentDisplay;
            if (target >= 1000000) {
                currentDisplay = (startValue / 1000000).toFixed(1);
            } else if (target >= 1000) {
                currentDisplay = (startValue / 1000).toFixed(0);
            } else {
                currentDisplay = startValue;
            }
            
            counter.textContent = currentDisplay + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        // Start animation when counter is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(counter);
    });
    
    // Expanded view toggle for mobile
    const expandButton = document.getElementById('expandButton');
    const bodyElement = document.body;
    
    // Function to show all sections with a smooth animation
    function showAllSections() {
        const sections = document.querySelectorAll('#highlights, #experience, #projects, #skills');
        bodyElement.classList.add('expanded');
        
        sections.forEach((section, index) => {
            section.style.display = 'block';
            // Staggered animation for each section
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.maxHeight = 'none';
                section.style.overflow = 'visible';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Scroll to the first section with smooth animation
        if (sections.length > 0) {
            setTimeout(() => {
                sections[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
    
    // Function to hide sections with animation
    function hideSections() {
        const sections = document.querySelectorAll('#highlights, #experience, #projects, #skills');
        bodyElement.classList.remove('expanded');
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.display = 'none';
                section.style.maxHeight = '0';
                section.style.overflow = 'hidden';
            }, 300);
        });
    }
    
    // Add expand button functionality
    if (expandButton) {
        expandButton.addEventListener('click', function() {
            if (bodyElement.classList.contains('expanded')) {
                this.textContent = 'View Full Portfolio';
                hideSections();
                
                // Scroll back to top with smooth animation
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                this.textContent = 'Collapse View';
                showAllSections();
            }
        });
        
        // Initial state based on screen size
        if (window.innerWidth <= 480 && !bodyElement.classList.contains('expanded')) {
            hideSections();
            expandButton.textContent = 'View Full Portfolio';
        } else {
            showAllSections();
            expandButton.textContent = 'Collapse View';
            bodyElement.classList.add('expanded');
        }
    }
    
    // Mobile view check
    function checkMobileView() {
        if (!expandButton) return;
        
        if (window.innerWidth > 480) {
            expandButton.style.display = 'none';
            showAllSections();
            bodyElement.classList.add('expanded');
        } else {
            expandButton.style.display = 'block';
            
            // Initially hide sections on mobile if not expanded
            if (!bodyElement.classList.contains('expanded')) {
                hideSections();
            }
        }
    }
    
    // Initial check for mobile view
    checkMobileView();
    
    // Check on resize with debounce for better performance
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkMobileView, 250);
    });
});
