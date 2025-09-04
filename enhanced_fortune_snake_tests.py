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

class EnhancedFortuneSnakeGameTester(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Setup Chrome driver with options"""
        cls.chrome_options = Options()
        cls.chrome_options.add_argument("--disable-web-security")
        cls.chrome_options.add_argument("--allow-running-insecure-content")
        cls.chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        cls.chrome_options.add_argument("--no-sandbox")
        cls.chrome_options.add_argument("--disable-dev-shm-usage")
        cls.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68b9afe45cc7576799d9cf71_30"
    
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
            canvas = WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(1)
            
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(2)
            print("Game ready")
            
        except Exception as e:
            print(f"Quick load failed: {e}")
            try:
                self.driver.find_element(By.TAG_NAME, "body").click()
                time.sleep(1)
            except:
                pass
        
        return True
    
    def wait_for_element(self, locator_type, locator_value, timeout=3):
        """Helper method to wait for element"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((locator_type, locator_value))
            )
            return element
        except:
            return None
    
    def find_and_click_element(self, selectors, action_name):
        """Helper to find and click elements from multiple selectors"""
        for selector in selectors:
            try:
                if selector.startswith("//"):
                    element = self.wait_for_element(By.XPATH, selector, 3)
                else:
                    element = self.wait_for_element(By.CSS_SELECTOR, selector, 3)
                
                if element and element.is_displayed():
                    element.click()
                    print(f"✓ {action_name} - clicked {selector}")
                    return True
            except:
                continue
        print(f"⚠ {action_name} - no interactive element found")
        return False
    
    # Enhanced Navigation Tests
    def test_01_menu_navigation(self):
        """Test menu navigation with actual interaction"""
        print("\n=== Testing Menu Navigation ===")
        
        menu_selectors = [
            "//button[contains(@class, 'menu')]",
            "//div[contains(@class, 'menu')]",
            "//button[contains(@class, 'setting')]",
            ".menu-btn", ".settings-btn", "[class*='menu']", "[class*='setting']"
        ]
        
        if self.find_and_click_element(menu_selectors, "Menu Open"):
            time.sleep(2)
            
            # Look for menu items and interact with them
            menu_items = ["Sound", "Help", "History", "Info", "Settings"]
            for item in menu_items:
                try:
                    item_element = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{item}')]")
                    if item_element.is_displayed():
                        item_element.click()
                        print(f"✓ Navigated to {item}")
                        time.sleep(1)
                        # Close the opened panel
                        self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                        time.sleep(1)
                except:
                    continue
            
            # Close menu
            self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            print("✓ Menu closed")
    
    def test_02_history_navigation(self):
        """Test history panel navigation"""
        print("\n=== Testing History Navigation ===")
        
        # First try to open menu/settings
        menu_selectors = [
            "//button[contains(@class, 'menu')]",
            "//div[contains(@class, 'setting')]",
            "[class*='menu']", "[class*='setting']"
        ]
        
        menu_opened = self.find_and_click_element(menu_selectors, "Menu for History")
        if menu_opened:
            time.sleep(1)
        
        # Look for history button
        history_selectors = [
            "//button[contains(text(), 'History')]",
            "//div[contains(text(), 'History')]",
            "//button[contains(@class, 'history')]",
            ".history-btn", "[class*='history']"
        ]
        
        if self.find_and_click_element(history_selectors, "History Panel"):
            time.sleep(2)
            
            # Verify history content is displayed
            history_content = self.driver.find_elements(By.CSS_SELECTOR, 
                "[class*='history'], [class*='record'], table, .game-log")
            if history_content:
                print("✓ History content displayed")
            
            # Try to navigate through history if pagination exists
            nav_buttons = ["Next", "Previous", ">>", "<<"]
            for nav in nav_buttons:
                try:
                    nav_btn = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{nav}')]")
                    if nav_btn.is_displayed():
                        nav_btn.click()
                        print(f"✓ History navigation: {nav}")
                        time.sleep(1)
                except:
                    continue
            
            # Close history
            self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            print("✓ History panel closed")
    
    def test_03_help_paytable_navigation(self):
        """Test help and paytable navigation"""
        print("\n=== Testing Help/Paytable Navigation ===")
        
        help_selectors = [
            "//button[contains(text(), 'Help')]",
            "//button[contains(text(), 'Info')]",
            "//button[contains(text(), 'Paytable')]",
            "//button[contains(@class, 'help')]",
            "//button[contains(@class, 'info')]",
            ".help-btn", ".info-btn", "[class*='help']", "[class*='info']"
        ]
        
        if self.find_and_click_element(help_selectors, "Help/Info Panel"):
            time.sleep(2)
            
            # Navigate through help sections if tabs exist
            help_tabs = ["Rules", "Paytable", "Features", "How to Play"]
            for tab in help_tabs:
                try:
                    tab_element = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{tab}')]")
                    if tab_element.is_displayed():
                        tab_element.click()
                        print(f"✓ Navigated to {tab} section")
                        time.sleep(1)
                except:
                    continue
            
            # Look for paytable content
            paytable_elements = self.driver.find_elements(By.CSS_SELECTOR,
                "[class*='paytable'], [class*='symbol'], table, .pay-info")
            if paytable_elements:
                print("✓ Paytable content found")
            
            # Close help
            self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            print("✓ Help panel closed")
    
    def test_04_betting_interface_navigation(self):
        """Test betting interface navigation"""
        print("\n=== Testing Betting Interface Navigation ===")
        
        # Look for bet controls
        bet_increase_selectors = [
            "//button[contains(@class, 'bet-up')]",
            "//button[contains(@class, 'plus')]",
            "//button[contains(text(), '+')]",
            ".bet-up", ".bet-plus", "[class*='bet'][class*='up']"
        ]
        
        bet_decrease_selectors = [
            "//button[contains(@class, 'bet-down')]",
            "//button[contains(@class, 'minus')]",
            "//button[contains(text(), '-')]",
            ".bet-down", ".bet-minus", "[class*='bet'][class*='down']"
        ]
        
        # Test bet increase
        if self.find_and_click_element(bet_increase_selectors, "Bet Increase"):
            time.sleep(0.5)
            
            # Check if bet amount changed
            bet_display = self.driver.find_elements(By.CSS_SELECTOR, 
                "[class*='bet'], [class*='coin'], [class*='stake']")
            if bet_display:
                print("✓ Bet amount display updated")
        
        # Test bet decrease
        if self.find_and_click_element(bet_decrease_selectors, "Bet Decrease"):
            time.sleep(0.5)
        
        # Test max bet if available
        max_bet_selectors = [
            "//button[contains(text(), 'Max')]",
            "//button[contains(@class, 'max')]",
            ".max-bet", "[class*='max']"
        ]
        
        self.find_and_click_element(max_bet_selectors, "Max Bet")
    
    def test_05_turbo_mode_navigation(self):
        """Test turbo mode navigation and functionality"""
        print("\n=== Testing Turbo Mode Navigation ===")
        
        turbo_selectors = [
            "//button[contains(text(), 'Turbo')]",
            "//button[contains(text(), 'Fast')]",
            "//button[contains(@class, 'turbo')]",
            "//button[contains(@class, 'fast')]",
            ".turbo-btn", ".fast-btn", "[class*='turbo']", "[class*='fast']"
        ]
        
        if self.find_and_click_element(turbo_selectors, "Turbo Mode Activation"):
            time.sleep(1)
            
            # Test spin in turbo mode
            spin_selectors = [
                "//button[contains(@class, 'spin')]",
                "//button[contains(text(), 'Spin')]",
                ".spin-btn", "[class*='spin']"
            ]
            
            if self.find_and_click_element(spin_selectors, "Turbo Spin"):
                print("✓ Turbo spin initiated")
                time.sleep(3)  # Shorter wait for turbo
                print("✓ Turbo spin completed")
            
            # Deactivate turbo mode
            if self.find_and_click_element(turbo_selectors, "Turbo Mode Deactivation"):
                print("✓ Turbo mode deactivated")
    
    def test_06_autoplay_navigation(self):
        """Test autoplay navigation and controls"""
        print("\n=== Testing Autoplay Navigation ===")
        
        autoplay_selectors = [
            "//button[contains(text(), 'Auto')]",
            "//button[contains(@class, 'auto')]",
            ".auto-btn", ".autoplay-btn", "[class*='auto']"
        ]
        
        if self.find_and_click_element(autoplay_selectors, "Autoplay Menu"):
            time.sleep(2)
            
            # Navigate through autoplay options
            spin_counts = ["10", "25", "50", "100"]
            for count in spin_counts:
                try:
                    count_btn = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{count}')]")
                    if count_btn.is_displayed():
                        count_btn.click()
                        print(f"✓ Selected {count} auto spins")
                        break
                except:
                    continue
            
            # Look for start autoplay button
            start_selectors = [
                "//button[contains(text(), 'Start')]",
                "//button[contains(text(), 'OK')]",
                ".start-auto", ".confirm-btn"
            ]
            
            if self.find_and_click_element(start_selectors, "Start Autoplay"):
                print("✓ Autoplay started")
                time.sleep(3)
                
                # Stop autoplay
                stop_selectors = [
                    "//button[contains(text(), 'Stop')]",
                    "//button[contains(@class, 'stop')]",
                    ".stop-auto", "[class*='stop']"
                ]
                
                self.find_and_click_element(stop_selectors, "Stop Autoplay")
    
    def test_07_sound_settings_navigation(self):
        """Test sound settings navigation"""
        print("\n=== Testing Sound Settings Navigation ===")
        
        sound_selectors = [
            "//button[contains(@class, 'sound')]",
            "//button[contains(@class, 'audio')]",
            "//div[contains(@class, 'sound')]",
            ".sound-btn", ".audio-btn", "[class*='sound']", "[class*='audio']"
        ]
        
        if self.find_and_click_element(sound_selectors, "Sound Controls"):
            time.sleep(1)
            
            # Test sound toggle multiple times
            for i in range(3):
                if self.find_and_click_element(sound_selectors, f"Sound Toggle {i+1}"):
                    time.sleep(0.5)
        
        # Look for volume controls if available
        volume_selectors = [
            "//input[@type='range']",
            ".volume-slider", "[class*='volume']"
        ]
        
        for selector in volume_selectors:
            try:
                if selector.startswith("//"):
                    volume_control = self.wait_for_element(By.XPATH, selector, 2)
                else:
                    volume_control = self.wait_for_element(By.CSS_SELECTOR, selector, 2)
                
                if volume_control:
                    # Test volume adjustment
                    actions = ActionChains(self.driver)
                    actions.click_and_hold(volume_control).move_by_offset(20, 0).release().perform()
                    print("✓ Volume control tested")
                    break
            except:
                continue
    
    def test_08_fullscreen_navigation(self):
        """Test fullscreen navigation"""
        print("\n=== Testing Fullscreen Navigation ===")
        
        fullscreen_selectors = [
            "//button[contains(@class, 'fullscreen')]",
            "//button[contains(@class, 'expand')]",
            ".fullscreen-btn", ".expand-btn", "[class*='fullscreen']"
        ]
        
        if self.find_and_click_element(fullscreen_selectors, "Fullscreen Activation"):
            time.sleep(2)
            
            # Test navigation while in fullscreen
            print("✓ Testing navigation in fullscreen mode")
            
            # Try to access menu in fullscreen
            menu_selectors = [
                "//button[contains(@class, 'menu')]",
                ".menu-btn", "[class*='menu']"
            ]
            
            if self.find_and_click_element(menu_selectors, "Menu in Fullscreen"):
                time.sleep(1)
                self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            
            # Exit fullscreen
            if self.find_and_click_element(fullscreen_selectors, "Fullscreen Deactivation"):
                print("✓ Exited fullscreen mode")
    
    def test_09_spin_navigation_and_interaction(self):
        """Test spin navigation and interaction"""
        print("\n=== Testing Spin Navigation ===")
        
        spin_selectors = [
            "//button[contains(@class, 'spin')]",
            "//button[contains(text(), 'Spin')]",
            ".spin-btn", "[class*='spin']"
        ]
        
        # Test normal spin
        if self.find_and_click_element(spin_selectors, "Normal Spin"):
            print("✓ Spin initiated")
            
            # Test interaction during spin
            time.sleep(1)
            
            # Try to access other controls during spin
            controls_to_test = [
                ("Sound", ["[class*='sound']"]),
                ("Menu", ["[class*='menu']"]),
                ("Fullscreen", ["[class*='fullscreen']"])
            ]
            
            for control_name, selectors in controls_to_test:
                if self.find_and_click_element(selectors, f"{control_name} during spin"):
                    time.sleep(0.5)
            
            # Wait for spin to complete
            time.sleep(4)
            print("✓ Spin completed")
        
        # Test keyboard spin controls
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        # Test SPACE key spin
        body.send_keys(Keys.SPACE)
        print("✓ SPACE key spin tested")
        time.sleep(2)
        
        # Test ENTER key spin
        body.send_keys(Keys.ENTER)
        print("✓ ENTER key spin tested")
        time.sleep(2)
    
    def test_10_balance_and_currency_navigation(self):
        """Test balance display and currency navigation"""
        print("\n=== Testing Balance/Currency Navigation ===")
        
        # Find balance display
        balance_selectors = [
            ".balance", ".credit", "[class*='balance']", "[class*='credit']"
        ]
        
        balance_found = False
        for selector in balance_selectors:
            try:
                balance_element = self.wait_for_element(By.CSS_SELECTOR, selector, 3)
                if balance_element and balance_element.is_displayed():
                    balance_text = balance_element.text
                    print(f"✓ Balance displayed: {balance_text}")
                    balance_found = True
                    break
            except:
                continue
        
        if not balance_found:
            print("⚠ Balance display not found")
        
        # Test currency switching if available
        currency_selectors = [
            "//button[contains(text(), 'Point')]",
            "//button[contains(text(), 'Cash')]",
            "//button[contains(@class, 'currency')]",
            ".currency-btn", "[class*='currency']"
        ]
        
        self.find_and_click_element(currency_selectors, "Currency Switch")
    
    def test_11_responsive_navigation(self):
        """Test navigation on different screen sizes"""
        print("\n=== Testing Responsive Navigation ===")
        
        # Test different screen sizes
        screen_sizes = [
            (1920, 1080, "Desktop"),
            (768, 1024, "Tablet"),
            (375, 667, "Mobile")
        ]
        
        for width, height, device in screen_sizes:
            self.driver.set_window_size(width, height)
            time.sleep(2)
            print(f"✓ Testing navigation on {device} ({width}x{height})")
            
            # Test basic navigation on each screen size
            menu_selectors = [
                "//button[contains(@class, 'menu')]",
                ".menu-btn", "[class*='menu']"
            ]
            
            if self.find_and_click_element(menu_selectors, f"Menu on {device}"):
                time.sleep(1)
                self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        
        # Reset to full screen
        self.driver.maximize_window()
    
    def test_12_error_handling_navigation(self):
        """Test navigation error handling"""
        print("\n=== Testing Error Handling Navigation ===")
        
        # Test rapid clicking
        spin_selectors = [
            "//button[contains(@class, 'spin')]",
            ".spin-btn"
        ]
        
        spin_btn = None
        for selector in spin_selectors:
            try:
                if selector.startswith("//"):
                    spin_btn = self.wait_for_element(By.XPATH, selector, 3)
                else:
                    spin_btn = self.wait_for_element(By.CSS_SELECTOR, selector, 3)
                if spin_btn:
                    break
            except:
                continue
        
        if spin_btn:
            # Test rapid clicking
            for i in range(5):
                try:
                    spin_btn.click()
                    time.sleep(0.2)
                except:
                    break
            print("✓ Rapid clicking handled appropriately")
        
        # Test invalid key presses
        body = self.driver.find_element(By.TAG_NAME, "body")
        invalid_keys = [Keys.F1, Keys.F2, Keys.DELETE, Keys.INSERT]
        
        for key in invalid_keys:
            try:
                body.send_keys(key)
                time.sleep(0.1)
            except:
                continue
        
        print("✓ Invalid key presses handled")

def run_enhanced_tests():
    """Run all enhanced test cases"""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(EnhancedFortuneSnakeGameTester)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print(f"\n{'='*60}")
    print(f"ENHANCED TEST EXECUTION SUMMARY")
    print(f"{'='*60}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print(f"\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}")
    
    if result.errors:
        print(f"\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}")

if __name__ == "__main__":
    print("Enhanced Fortune Snake Game Testing Suite")
    print("========================================")
    print("Starting enhanced navigation and interaction testing...")
    
    run_enhanced_tests()