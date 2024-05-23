document.getElementById('searchBtn').addEventListener('click', searchColor);

function searchColor() {
    const colorInput = document.getElementById('colorInput').value.trim();
    let color;

    if (colorInput.startsWith('#')) {
        // Hex format
        color = hexToRgb(colorInput);
        if (!color) {
            alert('Invalid hex color code.');
            return;
        }
    } else {
        // RGB format
        const rgb = colorInput.split(' ').map(Number);
        if (rgb.length !== 3 || rgb.some(n => isNaN(n) || n < 0 || n > 255)) {
            alert('Please enter a valid RGB color code in the format "r g b".');
            return;
        }
        color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    displayColor(color);
    fetchSimilarColors(color);
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const result = regex.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
}

function displayColor(color) {
    const colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.backgroundColor = color;
}

function fetchSimilarColors(color) {
    // Convert RGB color to array of integers
    const rgb = color.match(/\d+/g).map(Number);

    // Call Colormind API to get a palette based on the given color
    fetch('http://colormind.io/api/', {
        method: 'POST',
        body: JSON.stringify({ model: "default", input: [[rgb[0], rgb[1], rgb[2]], "N", "N", "N", "N"] })
    })
    .then(response => response.json())
    .then(data => {
        const colors = data.result.filter(c => !(c[0] === rgb[0] && c[1] === rgb[1] && c[2] === rgb[2]));
        displaySimilarColors(colors);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displaySimilarColors(colors) {
    const similarColorsContainer = document.getElementById('similarColors');
    similarColorsContainer.innerHTML = '';

    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        similarColorsContainer.appendChild(colorBox);
    });
}
