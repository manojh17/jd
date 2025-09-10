// custom-designer.js - Custom design functionality
(function() {
    const designUpload = document.getElementById('design-upload');
    const designOverlay = document.getElementById('design-overlay');
    const designPreview = document.getElementById('design-preview');
    const addCustomBtn = document.getElementById('add-custom-to-cart');
    const garmentOptions = document.querySelectorAll('.garment-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const neckSelect = document.getElementById('neck-type');
    const sizeSelect = document.getElementById('size-select');
    const frontPreview = document.getElementById('front-preview');

    let currentDesign = null;
    let selectedGarment = 'tshirt';
    let selectedColor = 'white';

    // Update garment preview based on color
    function updateGarmentPreview() {
        const colorMap = {
            'white': '#f8f9fa',
            'black': '#1a1a1a',
            'navy': '#1e3a8a',
            'red': '#dc2626',
            'blue': '#2563eb',
            'gray': '#6b7280'
        };
        
        frontPreview.style.backgroundColor = colorMap[selectedColor] || '#f8f9fa';
        
        // Adjust text color for dark backgrounds
        if (['black', 'navy'].includes(selectedColor)) {
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
            img: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600',
            size: sizeSelect.value,
            color: selectedColor,
            neck: neckSelect.value,
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