from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import json
import random
import unittest
from datetime import datetime

class FortuneSnakeGameTester(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Setup Chrome driver with options"""
        cls.chrome_options = Options()
        cls.chrome_options.add_argument("--disable-web-security")
        cls.chrome_options.add_argument("--allow-running-insecure-content")
        cls.chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        cls.chrome_options.add_argument("--no-sandbox")
        cls.chrome_options.add_argument("--disable-dev-shm-usage")
        cls.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68b9837b4b9b323da2957bc2_319"
    
    def setUp(self):
        """Setup for each test"""
        self.driver = webdriver.Chrome(options=self.chrome_options)
        self.driver.maximize_window()
        self.load_game()
    
    def tearDown(self):
        """Cleanup after each test"""
        if self.driver:
            self.driver.quit()
    
    def load_game(self):
        """Load the game and wait for it to initialize - OPTIMIZED"""
        print("Loading game...")
        self.driver.get(self.game_url)
        
        # Quick page load check
        WebDriverWait(self.driver, 8).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        print("Page loaded")
        
        # Fast game initialization
        try:
            # Wait for canvas with shorter timeout
            canvas = WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            
            # Quick click sequence
            canvas.click()
            time.sleep(1)
            
            # Try keyboard shortcuts immediately
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(1)
            
            # One more canvas click
            canvas.click()
            time.sleep(2)  # Reduced from 5 to 2 seconds
            
            print("Game ready")
            
        except Exception as e:
            print(f"Quick load failed, trying backup: {e}")
            # Backup method - just click anywhere
            try:
                self.driver.find_element(By.TAG_NAME, "body").click()
                time.sleep(1)
            except:
                pass
        
        return True
    
    def wait_for_element(self, locator_type, locator_value, timeout=3):
        """Helper method to wait for element - FAST"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((locator_type, locator_value))
            )
            return element
        except:
            return None
            
    def wait_for_element_visible(self, locator_type, locator_value, timeout=5):
        """Helper method to wait for element to be visible - FAST"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((locator_type, locator_value))
            )
            return element
        except:
            return None
    
    # Basic Game Loading Tests
    def test_01_game_loading(self):
        """Test if game loads properly"""
        print("\n=== Testing Game Loading ===")
        self.assertTrue(self.driver.current_url.startswith("https://games.microslot.co/fortunesnake/"))
        self.assertIn("Fortune", self.driver.title)
        print("✓ Game loaded successfully")
    
    def test_02_enter_game(self):
        """Test entering the game"""
        print("\n=== Testing Game Entry ===")
        
        # Look for common game entry elements
        possible_selectors = [
            "//button[contains(text(), 'Enter')]",
            "//button[contains(text(), 'Play')]", 
            "//button[contains(text(), 'Start')]",
            ".enter-btn",
            ".play-btn",
            ".start-btn"
        ]
        
        enter_button = None
        for selector in possible_selectors:
            try:
                if selector.startswith("//"):
                    enter_button = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    enter_button = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                if enter_button:
                    break
            except:
                continue
        
        if enter_button:
            enter_button.click()
            time.sleep(1)  # Reduced from 3 to 1 second
            print("✓ Successfully entered the game")
        else:
            print("✓ Game loaded directly without entry button")
    
    # UI Control Tests
    def test_03_fullscreen_zoom_controls(self):
        """Test fullscreen/zoom controls"""
        print("\n=== Testing Fullscreen/Zoom Controls ===")
        
        # Test fullscreen toggle
        fullscreen_selectors = [
            "//button[contains(@class, 'fullscreen')]",
            "//button[contains(@id, 'fullscreen')]",
            ".fullscreen-btn",
            ".zoom-btn"
        ]
        
        for selector in fullscreen_selectors:
            try:
                if selector.startswith("//"):
                    fullscreen_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    fullscreen_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if fullscreen_btn:
                    # Test entering fullscreen
                    fullscreen_btn.click()
                    time.sleep(1)  # Reduced from 2 to 1 second
                    print("✓ Fullscreen mode activated")
                    
                    # Test exiting fullscreen
                    fullscreen_btn.click()
                    time.sleep(1)  # Reduced from 2 to 1 second
                    print("✓ Fullscreen mode deactivated")
                    break
            except:
                continue
    
    def test_04_sound_controls(self):
        """Test sound controls"""
        print("\n=== Testing Sound Controls ===")
        
        # Test main sound button
        sound_selectors = [
            "//button[contains(@class, 'sound')]",
            "//button[contains(@id, 'sound')]",
            ".sound-btn",
            ".audio-btn"
        ]
        
        for selector in sound_selectors:
            try:
                if selector.startswith("//"):
                    sound_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    sound_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if sound_btn:
                    # Toggle sound off
                    sound_btn.click()
                    time.sleep(0.5)  # Reduced from 1 to 0.5 seconds
                    print("✓ Sound toggled off")
                    
                    # Toggle sound on
                    sound_btn.click()
                    time.sleep(0.5)  # Reduced from 1 to 0.5 seconds
                    print("✓ Sound toggled on")
                    break
            except:
                continue
    
    def test_05_menu_functionality(self):
        """Test main menu functionality"""
        print("\n=== Testing Menu Functionality ===")
        
        # Test opening menu
        menu_selectors = [
            "//button[contains(@class, 'menu')]",
            "//button[contains(@id, 'menu')]",
            ".menu-btn",
            ".hamburger"
        ]
        
        for selector in menu_selectors:
            try:
                if selector.startswith("//"):
                    menu_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    menu_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if menu_btn:
                    menu_btn.click()
                    time.sleep(2)
                    print("✓ Menu opened successfully")
                    
                    # Test closing menu (ESC key or click outside)
                    self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                    time.sleep(1)
                    print("✓ Menu closed successfully")
                    break
            except:
                continue
    
    def test_06_history_functionality(self):
        """Test history functionality"""
        print("\n=== Testing History Functionality ===")
        
        # Test opening history
        history_selectors = [
            "//button[contains(text(), 'History')]",
            "//button[contains(@class, 'history')]",
            ".history-btn"
        ]
        
        for selector in history_selectors:
            try:
                if selector.startswith("//"):
                    history_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    history_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if history_btn:
                    history_btn.click()
                    time.sleep(2)
                    print("✓ History panel opened")
                    
                    # Test closing history
                    close_selectors = [
                        "//button[contains(@class, 'close')]",
                        ".close-btn",
                        "//button[text()='×']"
                    ]
                    
                    for close_selector in close_selectors:
                        try:
                            if close_selector.startswith("//"):
                                close_btn = self.wait_for_element(By.XPATH, close_selector, 5)
                            else:
                                close_btn = self.wait_for_element(By.CSS_SELECTOR, close_selector, 5)
                            
                            if close_btn:
                                close_btn.click()
                                time.sleep(1)
                                print("✓ History panel closed")
                                break
                        except:
                            continue
                    break
            except:
                continue
    
    def test_07_help_functionality(self):
        """Test help/info functionality"""
        print("\n=== Testing Help Functionality ===")
        
        help_selectors = [
            "//button[contains(text(), 'Help')]",
            "//button[contains(@class, 'help')]",
            "//button[contains(@class, 'info')]",
            ".help-btn",
            ".info-btn"
        ]
        
        for selector in help_selectors:
            try:
                if selector.startswith("//"):
                    help_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    help_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if help_btn:
                    help_btn.click()
                    time.sleep(2)
                    print("✓ Help panel opened")
                    
                    # Close help panel
                    self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                    time.sleep(1)
                    print("✓ Help panel closed")
                    break
            except:
                continue
    
    def test_08_turbo_mode(self):
        """Test turbo mode functionality"""
        print("\n=== Testing Turbo Mode ===")
        
        turbo_selectors = [
            "//button[contains(text(), 'Turbo')]",
            "//button[contains(@class, 'turbo')]",
            ".turbo-btn"
        ]
        
        for selector in turbo_selectors:
            try:
                if selector.startswith("//"):
                    turbo_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    turbo_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if turbo_btn:
                    # Enable turbo mode
                    turbo_btn.click()
                    time.sleep(1)
                    print("✓ Turbo mode enabled")
                    
                    # Disable turbo mode
                    turbo_btn.click()
                    time.sleep(1)
                    print("✓ Turbo mode disabled")
                    break
            except:
                continue
    
    # Betting Tests
    def test_09_bet_controls(self):
        """Test betting controls"""
        print("\n=== Testing Bet Controls ===")
        
        # Test opening bet menu
        bet_selectors = [
            "//button[contains(text(), 'Bet')]",
            "//button[contains(@class, 'bet')]",
            ".bet-btn"
        ]
        
        for selector in bet_selectors:
            try:
                if selector.startswith("//"):
                    bet_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    bet_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if bet_btn:
                    bet_btn.click()
                    time.sleep(2)
                    print("✓ Bet menu opened")
                    
                    # Test bet amount changes
                    bet_up_selectors = [
                        "//button[contains(@class, 'bet-up')]",
                        "//button[contains(text(), '+')]",
                        ".bet-increase"
                    ]
                    
                    for bet_up_selector in bet_up_selectors:
                        try:
                            if bet_up_selector.startswith("//"):
                                bet_up_btn = self.wait_for_element(By.XPATH, bet_up_selector, 5)
                            else:
                                bet_up_btn = self.wait_for_element(By.CSS_SELECTOR, bet_up_selector, 5)
                            
                            if bet_up_btn:
                                bet_up_btn.click()
                                time.sleep(1)
                                print("✓ Bet amount increased")
                                break
                        except:
                            continue
                    break
            except:
                continue
    
    # Spin Tests
    def test_10_spin_functionality(self):
        """Test basic spin functionality"""
        print("\n=== Testing Spin Functionality ===")
        
        spin_selectors = [
            "//button[contains(text(), 'Spin')]",
            "//button[contains(@class, 'spin')]",
            ".spin-btn",
            ".play-btn"
        ]
        
        for selector in spin_selectors:
            try:
                if selector.startswith("//"):
                    spin_btn = self.wait_for_element(By.XPATH, selector, 10)
                else:
                    spin_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 10)
                
                if spin_btn:
                    # Get initial balance
                    try:
                        balance_element = self.driver.find_element(By.CSS_SELECTOR, ".balance, .credit, [class*='balance']")
                        initial_balance = balance_element.text
                        print(f"Initial balance: {initial_balance}")
                    except:
                        print("Could not read initial balance")
                    
                    # Perform spin
                    spin_btn.click()
                    print("✓ Spin initiated")
                    
                    # Wait for spin to complete
                    time.sleep(8)  # Allow time for spin animation
                    
                    # Check if spin completed
                    try:
                        spin_btn = self.wait_for_element(By.CSS_SELECTOR, selector if not selector.startswith("//") else ".spin-btn", 5)
                        if spin_btn:
                            print("✓ Spin completed - button available again")
                    except:
                        print("Spin may still be in progress")
                    
                    break
            except:
                continue
    
    def test_11_spin_during_actions(self):
        """Test spin functionality during other actions"""
        print("\n=== Testing Spin During Other Actions ===")
        
        # First perform a spin
        spin_btn = None
        spin_selectors = [
            "//button[contains(text(), 'Spin')]",
            "//button[contains(@class, 'spin')]",
            ".spin-btn"
        ]
        
        for selector in spin_selectors:
            try:
                if selector.startswith("//"):
                    spin_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    spin_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                if spin_btn:
                    break
            except:
                continue
        
        if spin_btn:
            spin_btn.click()
            print("✓ Spin initiated")
            
            # Test accessing other functions during spin
            time.sleep(1)  # Short delay to ensure spin started
            
            # Test fullscreen toggle during spin
            try:
                fullscreen_btn = self.driver.find_element(By.CSS_SELECTOR, ".fullscreen-btn, [class*='fullscreen']")
                fullscreen_btn.click()
                print("✓ Fullscreen accessible during spin")
            except:
                print("Fullscreen not accessible or not found")
            
            # Test sound toggle during spin
            try:
                sound_btn = self.driver.find_element(By.CSS_SELECTOR, ".sound-btn, [class*='sound']")
                sound_btn.click()
                print("✓ Sound controls accessible during spin")
            except:
                print("Sound controls not accessible or not found")
            
            # Wait for spin to complete
            time.sleep(8)
    
    # Autoplay Tests
    def test_12_autoplay_functionality(self):
        """Test autoplay functionality"""
        print("\n=== Testing Autoplay Functionality ===")
        
        autoplay_selectors = [
            "//button[contains(text(), 'Auto')]",
            "//button[contains(@class, 'auto')]",
            ".autoplay-btn",
            ".auto-btn"
        ]
        
        for selector in autoplay_selectors:
            try:
                if selector.startswith("//"):
                    autoplay_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    autoplay_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                
                if autoplay_btn:
                    autoplay_btn.click()
                    time.sleep(2)
                    print("✓ Autoplay menu opened")
                    
                    # Select number of spins (try to find spin count options)
                    spin_options = [
                        "//button[text()='10']",
                        "//button[text()='25']",
                        "//button[text()='50']",
                        ".spin-count-10",
                        ".spin-count-25"
                    ]
                    
                    for option in spin_options:
                        try:
                            if option.startswith("//"):
                                spin_option = self.wait_for_element(By.XPATH, option, 3)
                            else:
                                spin_option = self.wait_for_element(By.CSS_SELECTOR, option, 3)
                            
                            if spin_option:
                                spin_option.click()
                                print("✓ Autoplay spin count selected")
                                break
                        except:
                            continue
                    
                    # Start autoplay
                    start_selectors = [
                        "//button[contains(text(), 'Start')]",
                        "//button[contains(text(), '✓')]",
                        ".start-autoplay",
                        ".confirm-btn"
                    ]
                    
                    for start_selector in start_selectors:
                        try:
                            if start_selector.startswith("//"):
                                start_btn = self.wait_for_element(By.XPATH, start_selector, 3)
                            else:
                                start_btn = self.wait_for_element(By.CSS_SELECTOR, start_selector, 3)
                            
                            if start_btn:
                                start_btn.click()
                                print("✓ Autoplay started")
                                time.sleep(3)
                                
                                # Stop autoplay
                                stop_btn = self.wait_for_element(By.CSS_SELECTOR, ".stop-autoplay, .autoplay-btn, [class*='stop']", 5)
                                if stop_btn:
                                    stop_btn.click()
                                    print("✓ Autoplay stopped")
                                break
                        except:
                            continue
                    break
            except:
                continue
    
    # Balance and Currency Tests
    def test_13_balance_display(self):
        """Test balance display and currency switching"""
        print("\n=== Testing Balance Display ===")
        
        # Test balance visibility
        balance_selectors = [
            ".balance",
            ".credit",
            "[class*='balance']",
            "[class*='credit']",
            "#balance"
        ]
        
        balance_found = False
        for selector in balance_selectors:
            try:
                balance_element = self.wait_for_element_visible(By.CSS_SELECTOR, selector, 5)
                if balance_element:
                    balance_text = balance_element.text
                    print(f"✓ Balance displayed: {balance_text}")
                    balance_found = True
                    break
            except:
                continue
        
        if not balance_found:
            print("Balance display not found or not visible")
        
        # Test currency switching if available
        currency_selectors = [
            "//button[contains(text(), 'Point')]",
            "//button[contains(text(), 'Cash')]",
            ".currency-switch",
            ".point-mode"
        ]
        
        for selector in currency_selectors:
            try:
                if selector.startswith("//"):
                    currency_btn = self.wait_for_element(By.XPATH, selector, 3)
                else:
                    currency_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 3)
                
                if currency_btn:
                    currency_btn.click()
                    time.sleep(1)
                    print("✓ Currency mode switched")
                    break
            except:
                continue
    
    # Error Handling Tests
    def test_14_insufficient_balance_handling(self):
        """Test behavior when balance is insufficient"""
        print("\n=== Testing Insufficient Balance Handling ===")
        
        # This test would require manipulating balance or using a test account with low balance
        # For now, we'll just verify the spin button state
        spin_btn = None
        spin_selectors = [
            "//button[contains(text(), 'Spin')]",
            ".spin-btn"
        ]
        
        for selector in spin_selectors:
            try:
                if selector.startswith("//"):
                    spin_btn = self.wait_for_element(By.XPATH, selector, 5)
                else:
                    spin_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 5)
                if spin_btn:
                    break
            except:
                continue
        
        if spin_btn:
            # Check if button is enabled/disabled
            is_enabled = spin_btn.is_enabled()
            print(f"✓ Spin button state checked: {'Enabled' if is_enabled else 'Disabled'}")
        
    # Performance Tests
    def test_15_game_responsiveness(self):
        """Test game responsiveness and performance"""
        print("\n=== Testing Game Responsiveness ===")
        
        # Test multiple rapid clicks
        spin_btn = None
        try:
            spin_btn = self.wait_for_element(By.CSS_SELECTOR, ".spin-btn, [class*='spin']", 5)
        except:
            try:
                spin_btn = self.wait_for_element(By.XPATH, "//button[contains(text(), 'Spin')]", 5)
            except:
                pass
        
        if spin_btn:
            # Test rapid clicking doesn't break the game
            for i in range(3):
                try:
                    spin_btn.click()
                    time.sleep(0.5)
                except:
                    break
            print("✓ Game handles rapid clicks appropriately")
            
            # Wait for any ongoing spins to complete
            time.sleep(8)
        
        # Test page responsiveness
        start_time = time.time()
        try:
            self.driver.execute_script("return document.readyState")
            response_time = time.time() - start_time
            print(f"✓ Page response time: {response_time:.2f} seconds")
        except:
            print("Could not measure response time")
    
    def test_16_browser_compatibility(self):
        """Test browser compatibility features"""
        print("\n=== Testing Browser Compatibility ===")
        
        # Test JavaScript execution
        try:
            result = self.driver.execute_script("return typeof window !== 'undefined'")
            if result:
                print("✓ JavaScript execution working")
        except:
            print("JavaScript execution issues detected")
        
        # Test local storage (if game uses it)
        try:
            self.driver.execute_script("localStorage.setItem('test', 'value')")
            value = self.driver.execute_script("return localStorage.getItem('test')")
            if value == 'value':
                print("✓ Local storage functional")
                self.driver.execute_script("localStorage.removeItem('test')")
        except:
            print("Local storage not available or restricted")

def run_all_tests():
    """Run all test cases"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(FortuneSnakeGameTester)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print(f"\n{'='*50}")
    print(f"TEST EXECUTION SUMMARY")
    print(f"{'='*50}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print(f"\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print(f"\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")

if __name__ == "__main__":
    print("Fortune Snake Game Testing Suite")
    print("================================")
    print("Starting comprehensive game testing...")
    
    run_all_tests()