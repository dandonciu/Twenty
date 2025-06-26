
    const container = document.querySelector('.twentytwenty-container');
    const before = document.querySelector('.twentytwenty-before');
    const handle = document.querySelector('.twentytwenty-handle');
    let isDragging = false;  

 handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });


    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const percent = (x / rect.width) * 100;
        before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        handle.style.left = `${percent}%`;
        
        // Blocare la margini
        if (percent <= 1) {
            before.style.clipPath = 'inset(0 99% 0 0)';
            handle.style.left = '0%';
        } else if (percent >= 99) {
            before.style.clipPath = 'inset(0 0% 0 0)';
            handle.style.left = '100%';
        }

    });
