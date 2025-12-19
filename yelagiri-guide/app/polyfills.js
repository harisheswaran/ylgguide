'use client';

// Polyfill to fix Image constructor issues
// This fixes the error: "Failed to construct 'Image': Please use the 'new' operator"
if (typeof window !== 'undefined' && typeof window.Image !== 'undefined') {
    const OriginalImage = window.Image;

    // Create a wrapper that works both with and without 'new'
    const ImageWrapper = function (width, height) {
        if (!(this instanceof ImageWrapper)) {
            // Called without 'new', so create a new instance
            return new OriginalImage(width, height);
        }
        // Called with 'new', use the original constructor
        const img = new OriginalImage(width, height);
        return img;
    };

    // Maintain the prototype chain
    ImageWrapper.prototype = OriginalImage.prototype;
    Object.setPrototypeOf(ImageWrapper, OriginalImage);

    // Replace window.Image with our wrapper
    try {
        window.Image = ImageWrapper;
    } catch (e) {
        console.warn('Could not override Image constructor:', e);
    }
}

export { };
