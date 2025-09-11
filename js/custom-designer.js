// custom-designer.js - Custom design functionality
(function () {
    const designUpload = document.getElementById('design-upload');
    const designOverlay = document.getElementById('design-overlay');
    const designPreview = document.getElementById('design-preview');
    const addCustomBtn = document.getElementById('add-custom-to-cart');
    const garmentOptions = document.querySelectorAll('.garment-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const sizeSelect = document.getElementById('size-select');
    const frontPreview = document.getElementById('front-preview');

    let currentDesign = null;
    let selectedGarment = 'tshirt';
    let selectedColor = 'white';

    // ✅ Garment + color image maps
    const garmentColorMap = {
        tshirt: {
            white: './assets/products/tshirt/white-tshirt.png',
            black: './assets/products/tshirt/black-tshirt.png',
            red: './assets/products/tshirt/red-tshirt.png',
            blue: './assets/products/tshirt/blue-tshirt.png',
            green: './assets/products/tshirt/green-tshirt.png'
        },
        hoodie: {
            white: './assets/products/hoodie/white-hoodie.png',
            black: './assets/products/hoodie/black-hoodie.png',
            navy: './assets/products/hoodie/blue-hoodie.png',
            red: './assets/products/hoodie/red-hoodie.png',
            green: './assets/products/hoodie/green-hoodie.png'
        },
        fullsleeve: {
            white: './assets/products/fullsleeve/white-fullsleeve.png',
            black: './assets/products/fullsleeve/black-fullsleeve.png',
            blue: './assets/products/fullsleeve/blue-fullsleeve.png',
            red: './assets/products/fullsleeve/red-fullsleeve.png',
            green: './assets/products/fullsleeve/green-fullsleeve.png'
        }
    };

    // Update garment preview based on selected garment & color
    function updateGarmentPreview() {
        const garmentImages = garmentColorMap[selectedGarment] || garmentColorMap['tshirt'];
        const selectedImage = garmentImages[selectedColor] || garmentImages['white'];

        // Set garment image
        frontPreview.style.background = `url('${selectedImage}') no-repeat center center / contain`;

        // Adjust text color for readability
        if (['black', 'navy', 'red'].includes(selectedColor)) {
            frontPreview.style.color = 'white';
        } else {
            frontPreview.style.color = 'black';
        }
    }

    // Handle garment type selection
    garmentOptions.forEach(option => {
        option.addEventListener('click', () => {
            garmentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedGarment = option.dataset.garment;
            selectedColor = 'white'; // reset to white when garment changes
            updateGarmentPreview();
        });
    });

    // Handle color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedColor = option.dataset.color;
            updateGarmentPreview();
        });
    });

    // Handle design upload
    designUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentDesign = e.target.result;
            designPreview.src = currentDesign;
            designOverlay.style.display = 'block';

            // Update file upload label
            const label = document.querySelector('.file-upload-label');
            label.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                <span>Design uploaded successfully!</span>
                <small>Click to change design</small>
            `;
            label.classList.add('has-file');
        };
        reader.readAsDataURL(file);
    });

    // Handle drag and drop
    const fileUploadLabel = document.querySelector('.file-upload-label');

    fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.add('dragover');
    });

    fileUploadLabel.addEventListener('dragleave', () => {
        fileUploadLabel.classList.remove('dragover');
    });

    fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            designUpload.files = files;
            designUpload.dispatchEvent(new Event('change'));
        }
    });

    // Add custom design to cart
    addCustomBtn.addEventListener('click', () => {
        if (!currentDesign) {
            alert('Please upload a design first');
            return;
        }

        const customProduct = {
            id: `custom-${Date.now()}`,
            title: `Custom ${selectedGarment.charAt(0).toUpperCase() + selectedGarment.slice(1)}`,
            price: 499,
            category: 'custom',
            img: garmentColorMap[selectedGarment][selectedColor],
            size: sizeSelect.value,
            color: selectedColor,
            isCustom: true,
            designImage: currentDesign,
            garmentType: selectedGarment
        };

        if (window.addToCart) {
            window.addToCart(customProduct);

            // Reset form
            currentDesign = null;
            designOverlay.style.display = 'none';
            designUpload.value = '';

            const label = document.querySelector('.file-upload-label');
            label.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Click to upload or drag & drop</span>
                <small>PNG, JPG, SVG up to 10MB</small>
            `;
            label.classList.remove('has-file');
        }
    });

    // Initialize
    updateGarmentPreview();
})();

// --- Drag & Resize Functionality ---
(function () {
    const overlay = document.getElementById('design-overlay');
    const resizeHandle = document.getElementById('resize-handle');

    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    // Dragging
    overlay.addEventListener('mousedown', (e) => {
        if (e.target === resizeHandle) return; // prevent conflict
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = overlay.offsetLeft;
        startTop = overlay.offsetTop;
        e.preventDefault();
    });

    // Resizing
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = overlay.offsetWidth;
        startHeight = overlay.offsetHeight;
        e.preventDefault();
        e.stopPropagation();
    });

    // Mouse move (apply drag/resize)
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            overlay.style.left = `${startLeft + dx}px`;
            overlay.style.top = `${startTop + dy}px`;
        } else if (isResizing) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            overlay.style.width = `${startWidth + dx}px`;
            overlay.style.height = `${startHeight + dy}px`;
        }
    });

    // Stop drag/resize
    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });
})();
