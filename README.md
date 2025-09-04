# Fortune Snake Game Test Automation Suite

## Overview
This automated test suite is designed to validate the functionality of the Fortune Snake slot game. It uses Selenium WebDriver with Python to perform comprehensive testing of game features, UI elements, and gameplay mechanics.

## Prerequisites
- Python 3.7 or higher
- Google Chrome browser
- ChromeDriver (matching your Chrome version)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GameTest
```

2. Install required packages:
```bash
pip install selenium
pip install webdriver_manager
```

3. Configure ChromeDriver:
   - Download ChromeDriver from: https://sites.google.com/chromium.org/driver/
   - Add it to your system PATH or place in project directory

## Project Structure
```
GameTest/
│
├── fortune_snake_tests.py    # Main test suite
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## Test Categories

1. Basic Game Loading Tests
   - Game loading verification
   - Game entry testing
   
2. UI Control Tests
   - Fullscreen/zoom controls
   - Sound controls
   - Menu functionality
   - History panel
   - Help/info panel
   - Turbo mode

3. Gameplay Tests
   - Betting controls
   - Spin functionality
   - Autoplay features
   - Balance management

4. Performance Tests
   - Game responsiveness
   - Browser compatibility

## Running Tests

1. Simple test execution:
```bash
python fortune_snake_tests.py
```

2. To run specific test categories:
```bash
python -m unittest fortune_snake_tests.py -k test_01_game_loading
python -m unittest fortune_snake_tests.py -k test_03_fullscreen_zoom_controls
```

## Test Results
- Tests results are displayed in the console
- Summary includes:
  - Total tests run
  - Number of failures
  - Number of errors
  - Success rate percentage

## Configuration

The test suite uses these default settings:
```python
game_url = "https://games.microslot.co/fortunesnake/index.html?token=xxx"
chrome_options = [
    "--disable-web-security",
    "--allow-running-insecure-content",
    "--disable-features=VizDisplayCompositor"
]
```

## Troubleshooting

1. If ChromeDriver fails to start:
   - Verify Chrome version matches ChromeDriver version
   - Ensure ChromeDriver is in PATH
   - Check Chrome installation

2. If tests fail to interact with elements:
   - Increase wait times in `wait_for_element_visible` method
   - Check element selectors
   - Verify game URL is accessible

3. If game doesn't load:
   - Check internet connection
   - Verify game token in URL
   - Clear browser cache

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.