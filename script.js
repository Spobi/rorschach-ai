// NEW: Password protection code (add this at the TOP of your JavaScript file)
const passwordScreen = document.getElementById('password-screen');
const mainApp = document.getElementById('main-app');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const errorMessage = document.getElementById('error-message');

const correctPassword = 'inkblot';

function checkPassword() {
    const enteredPassword = passwordInput.value;
    if (enteredPassword === correctPassword) {
        passwordScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        generateInkblot(); // Generate first inkblot when password is correct
    } else {
        errorMessage.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

passwordSubmit.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Focus on password input when page loads
window.addEventListener('load', function() {
    passwordInput.focus();
});

// KEEP ALL YOUR EXISTING CODE BELOW THIS LINE

// Get elements from HTML
const canvas = document.getElementById('rorschach-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const submitBtn = document.getElementById('submit-btn');
const userInterpretation = document.getElementById('user-interpretation');
const result = document.getElementById('result');
const interpretationText = document.getElementById('interpretation-text');

// NEW: Handle placeholder removal when clicking in text box
userInterpretation.addEventListener('focus', function() {
    this.placeholder = '';
});

userInterpretation.addEventListener('blur', function() {
    // Only restore placeholder if the text box is empty
    if (this.value.trim() === '') {
        this.placeholder = 'Tell me... what do you see?';
    }
});

// Generate a random inkblot
function generateInkblot() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background to slightly lighter dark blue (matches canvas background)
    ctx.fillStyle = '#021943';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create random inkblot in baby blue
    ctx.fillStyle = '#a8d8f0';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw only on the left half first
    generateLeftHalf();

    // Mirror to the right half
    mirrorToRightHalf();

    // Hide result when generating new inkblot
    result.classList.add('hidden');
    userInterpretation.value = '';

    // Restore placeholder when generating new inkblot
    userInterpretation.placeholder = 'Tell me... what do you see?';

    // Function to generate the left half of the inkblot
    function generateLeftHalf() {
        // Function to create a splatter with drips and irregular edges
        function createSplatter(x, y, size) {
            // Main splat body
            const points = [];
            const numPoints = 15 + Math.floor(Math.random() * 10);

            // Create random jagged points for splatter outline
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * Math.PI * 2;
                // Make the radius vary dramatically for jagged edges
                const variance = Math.random() > 0.7 ? 0.4 + Math.random() * 1.2 : 0.7 + Math.random() * 0.5;
                const distance = size * variance;
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance;
                points.push({ x: px, y: py });
            }

            // Draw the splatter with bezier curves for smoother transitions
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                // Control points for bezier
                const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) * 0.5 + (Math.random() * 20 - 10);
                const cp1y = points[i - 1].y + (points[i].y - points[i - 1].y) * 0.5 + (Math.random() * 20 - 10);

                ctx.quadraticCurveTo(cp1x, cp1y, points[i].x, points[i].y);
            }

            // Close the shape back to first point
            const cp1x = points[points.length - 1].x + (points[0].x - points[points.length - 1].x) * 0.5 + (Math.random() * 20 - 10);
            const cp1y = points[points.length - 1].y + (points[0].y - points[points.length - 1].y) * 0.5 + (Math.random() * 20 - 10);
            ctx.quadraticCurveTo(cp1x, cp1y, points[0].x, points[0].y);

            ctx.closePath();
            ctx.fill();

            // Add drips and splatters coming off the main shape
            const numDrips = Math.floor(Math.random() * 8) + 3;

            for (let i = 0; i < numDrips; i++) {
                // Only create drips/splatters that point away from center
                const angle = Math.random() * Math.PI - Math.PI / 2;
                const dripLength = size * (0.3 + Math.random() * 0.7);
                const startX = x + Math.cos(angle) * (size * 0.8);
                const startY = y + Math.sin(angle) * (size * 0.8);
                const endX = startX + Math.cos(angle) * dripLength;
                const endY = startY + Math.sin(angle) * dripLength;

                // Drip width varies
                const width = 3 + Math.random() * 12;

                // Draw drip/splatter
                ctx.beginPath();

                // 70% chance of teardrop/drip, 30% chance of small splatter
                if (Math.random() > 0.3) {
                    // Teardrop/drip shape
                    ctx.moveTo(startX - width / 2, startY);
                    ctx.quadraticCurveTo(
                        endX + (Math.random() * 10 - 5),
                        endY + (Math.random() * 10),
                        endX + width / 2, endY
                    );
                    ctx.quadraticCurveTo(
                        endX + width + (Math.random() * 5),
                        endY - width / 2,
                        endX, endY - width
                    );
                    ctx.quadraticCurveTo(
                        endX - width - (Math.random() * 5),
                        endY - width / 2,
                        endX - width / 2, endY
                    );
                    ctx.quadraticCurveTo(
                        startX + (Math.random() * 10 - 5),
                        startY + (Math.random() * 10),
                        startX - width / 2, startY
                    );
                } else {
                    // Small irregular splatter
                    const splatterSize = 5 + Math.random() * 15;
                    // Simple circle instead of recursive splatter
                    ctx.beginPath();
                    ctx.arc(endX, endY, splatterSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fill();
            }

            // Add small satellite droplets
            const numDroplets = Math.floor(Math.random() * 10) + 5;

            for (let i = 0; i < numDroplets; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = size * (0.7 + Math.random() * 1.3);
                const dropX = x + Math.cos(angle) * distance;
                const dropY = y + Math.sin(angle) * distance;
                const dropSize = 1 + Math.random() * 5;

                // Draw droplet
                ctx.beginPath();
                // Various droplet shapes
                if (Math.random() > 0.6) {
                    // Circle droplet
                    ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
                } else if (Math.random() > 0.3) {
                    // Oval droplet
                    ctx.ellipse(
                        dropX, dropY,
                        dropSize, dropSize * (0.3 + Math.random() * 0.7),
                        Math.random() * Math.PI, 0, Math.PI * 2
                    );
                } else {
                    // Tiny splatter droplet
                    const miniPoints = [];
                    const miniNumPoints = 3 + Math.floor(Math.random() * 4);

                    for (let j = 0; j < miniNumPoints; j++) {
                        const miniAngle = (j / miniNumPoints) * Math.PI * 2;
                        const miniRadius = dropSize * (0.5 + Math.random() * 0.8);
                        const mx = dropX + Math.cos(miniAngle) * miniRadius;
                        const my = dropY + Math.sin(miniAngle) * miniRadius;
                        miniPoints.push({ x: mx, y: my });
                    }

                    ctx.moveTo(miniPoints[0].x, miniPoints[0].y);
                    for (let j = 1; j < miniPoints.length; j++) {
                        ctx.lineTo(miniPoints[j].x, miniPoints[j].y);
                    }
                }
                ctx.closePath();
                ctx.fill();
            }
        }

        // Create a central main splatter
        createSplatter(centerX - 50, centerY, 80 + Math.random() * 50);

        // Create 3-5 additional clusters distributed across the canvas
        const numClusters = 3 + Math.floor(Math.random() * 3);

        // Distribute vertically
        for (let i = 0; i < numClusters; i++) {
            // Position this cluster vertically along the canvas
            const yPosition = (i + 1) * (canvas.height / (numClusters + 1));

            // Randomly offset from center horizontally, but stay within left half
            const xOffset = Math.random() * 100;
            const x = centerX - 100 - xOffset;

            // Create a primary splatter for this cluster
            const clusterSize = 40 + Math.random() * 60;
            createSplatter(x, yPosition, clusterSize);

            // Add 2-4 smaller splatters around this cluster
            const numSplatters = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numSplatters; j++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 60;
                const splatterX = x + Math.cos(angle) * distance;
                const splatterY = yPosition + Math.sin(angle) * distance;

                // Only create if it's in the left side
                if (splatterX > 0 && splatterX < centerX) {
                    createSplatter(splatterX, splatterY, 15 + Math.random() * 30);
                }
            }
        }
    }

    // Function to mirror the left half to the right half
    function mirrorToRightHalf() {
        // Get the image data from left half
        const imageData = ctx.getImageData(0, 0, centerX, canvas.height);

        // Create a temporary canvas to manipulate the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = centerX;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Put the left half image data onto the temp canvas
        tempCtx.putImageData(imageData, 0, 0);

        // Draw the temp canvas onto the main canvas, flipped horizontally
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(tempCanvas, -canvas.width, 0);
        ctx.restore();
    }
}

// Analyze user's interpretation using our server
async function analyzeInterpretation() {
    const text = userInterpretation.value.trim();

    if (!text) {
        alert("Please tell me what you see first!");
        return;
    }

    // Show loading message
    interpretationText.textContent = "Analyzing your response...";
    result.classList.remove('hidden');

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();
        interpretationText.textContent = data.interpretation;

    } catch (error) {
        interpretationText.textContent = "Sorry, I couldn't analyze your response at the moment. Please try again!";
        console.error('Error:', error);
    }
}

// Event listeners
generateBtn.addEventListener('click', generateInkblot);
submitBtn.addEventListener('click', analyzeInterpretation);

// Generate initial inkblot when page loads
window.onload = generateInkblot;