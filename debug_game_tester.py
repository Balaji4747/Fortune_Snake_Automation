from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import json

class DebugGameTester:
    def __init__(self):
        self.driver = None
        self.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68b9afe45cc7576799d9cf71_30"
    
    def setup_driver(self):
        """Setup Chrome driver"""
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
    
    def load_game(self):
        """Load game and wait for initialization"""
        print("Loading game...")
        self.driver.get(self.game_url)
        
        WebDriverWait(self.driver, 10).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        
        # Click canvas to start game
        try:
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(3)
            
            # Try keyboard shortcuts
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(5)  # Wait longer for game to fully load
            
            print("Game loaded successfully")
        except Exception as e:
            print(f"Game loading issue: {e}")
    
    def inspect_page_elements(self):
        """Inspect what elements are actually on the page"""
        print("\n" + "="*60)
        print("INSPECTING PAGE ELEMENTS")
        print("="*60)
        
        # Find all buttons
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        print(f"\nFound {len(buttons)} buttons:")
        for i, btn in enumerate(buttons[:10]):  # Show first 10
            try:
                text = btn.text.strip()
                classes = btn.get_attribute('class') or ''
                id_attr = btn.get_attribute('id') or ''
                visible = btn.is_displayed()
                print(f"  Button {i+1}: text='{text}' class='{classes}' id='{id_attr}' visible={visible}")
            except:
                print(f"  Button {i+1}: Could not read properties")
        
        # Find all divs with classes
        divs = self.driver.find_elements(By.CSS_SELECTOR, "div[class]")
        print(f"\nFound {len(divs)} divs with classes (showing first 15):")
        for i, div in enumerate(divs[:15]):
            try:
                classes = div.get_attribute('class') or ''
                text = div.text.strip()[:30]  # First 30 chars
                visible = div.is_displayed()
                print(f"  Div {i+1}: class='{classes}' text='{text}' visible={visible}")
            except:
                print(f"  Div {i+1}: Could not read properties")
        
        # Find all clickable elements
        clickable = self.driver.find_elements(By.CSS_SELECTOR, "[onclick], [class*='btn'], [class*='button']")
        print(f"\nFound {len(clickable)} potentially clickable elements:")
        for i, elem in enumerate(clickable[:10]):
            try:
                tag = elem.tag_name
                classes = elem.get_attribute('class') or ''
                onclick = elem.get_attribute('onclick') or ''
                text = elem.text.strip()[:20]
                visible = elem.is_displayed()
                print(f"  Clickable {i+1}: {tag} class='{classes}' onclick='{onclick}' text='{text}' visible={visible}")
            except:
                print(f"  Clickable {i+1}: Could not read properties")
    
    def test_actual_interactions(self):
        """Test interactions with actual found elements"""
        print("\n" + "="*60)
        print("TESTING ACTUAL INTERACTIONS")
        print("="*60)
        
        # Find and test all visible buttons
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        clickable_buttons = []
        
        for btn in buttons:
            try:
                if btn.is_displayed() and btn.is_enabled():
                    clickable_buttons.append(btn)
            except:
                continue
        
        print(f"\nFound {len(clickable_buttons)} clickable buttons")
        
        # Test clicking each button
        for i, btn in enumerate(clickable_buttons[:5]):  # Test first 5 buttons
            try:
                text = btn.text.strip()
                classes = btn.get_attribute('class') or ''
                
                print(f"\nTesting button {i+1}: '{text}' (class: {classes})")
                
                # Click the button
                btn.click()
                time.sleep(2)
                
                print(f"✓ Successfully clicked button: {text}")
                
                # Check if anything changed on page
                new_elements = self.driver.find_elements(By.CSS_SELECTOR, "[style*='block'], .active, .open, .visible")
                if new_elements:
                    print(f"  → {len(new_elements)} new elements appeared")
                
                # Try to close any opened panels
                self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                time.sleep(1)
                
            except Exception as e:
                print(f"✗ Failed to click button {i+1}: {e}")
        
        # Test canvas interactions
        print(f"\nTesting canvas interactions...")
        try:
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            
            # Test different click positions
            actions = ActionChains(self.driver)
            
            # Click center
            actions.move_to_element(canvas).click().perform()
            time.sleep(1)
            print("✓ Canvas center click")
            
            # Click different areas
            size = canvas.size
            width, height = size['width'], size['height']
            
            # Click corners and edges
            positions = [
                (width//4, height//4, "top-left area"),
                (3*width//4, height//4, "top-right area"),
                (width//2, height//2, "center area"),
                (width//4, 3*height//4, "bottom-left area"),
                (3*width//4, 3*height//4, "bottom-right area")
            ]
            
            for x, y, desc in positions:
                try:
                    actions.move_to_element_with_offset(canvas, x-width//2, y-height//2).click().perform()
                    time.sleep(1)
                    print(f"✓ Canvas {desc} click")
                except:
                    print(f"✗ Canvas {desc} click failed")
                    
        except Exception as e:
            print(f"✗ Canvas interaction failed: {e}")
    
    def test_keyboard_interactions(self):
        """Test keyboard interactions"""
        print(f"\nTesting keyboard interactions...")
        
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        # Test various keys
        keys_to_test = [
            (Keys.SPACE, "SPACE"),
            (Keys.ENTER, "ENTER"),
            (Keys.ARROW_UP, "UP ARROW"),
            (Keys.ARROW_DOWN, "DOWN ARROW"),
            (Keys.ARROW_LEFT, "LEFT ARROW"),
            (Keys.ARROW_RIGHT, "RIGHT ARROW"),
            ('s', "S key"),
            ('h', "H key"),
            ('m', "M key"),
            (Keys.ESCAPE, "ESCAPE")
        ]
        
        for key, desc in keys_to_test:
            try:
                body.send_keys(key)
                time.sleep(1)
                print(f"✓ {desc} key pressed")
            except:
                print(f"✗ {desc} key failed")
    
    def find_game_specific_elements(self):
        """Look for game-specific elements"""
        print(f"\nLooking for game-specific elements...")
        
        # Common game element patterns
        game_patterns = [
            ("spin", "Spin button"),
            ("bet", "Bet controls"),
            ("balance", "Balance display"),
            ("menu", "Menu button"),
            ("sound", "Sound controls"),
            ("auto", "Autoplay"),
            ("turbo", "Turbo mode"),
            ("help", "Help button"),
            ("info", "Info button"),
            ("history", "History"),
            ("setting", "Settings")
        ]
        
        for pattern, desc in game_patterns:
            # Search in various attributes
            selectors = [
                f"[class*='{pattern}']",
                f"[id*='{pattern}']",
                f"//button[contains(text(), '{pattern.title()}')]",
                f"//div[contains(text(), '{pattern.title()}')]"
            ]
            
            found_elements = []
            for selector in selectors:
                try:
                    if selector.startswith("//"):
                        elements = self.driver.find_elements(By.XPATH, selector)
                    else:
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    
                    for elem in elements:
                        if elem.is_displayed():
                            found_elements.append(elem)
                except:
                    continue
            
            if found_elements:
                print(f"✓ Found {len(found_elements)} {desc} elements")
                # Try clicking the first one
                try:
                    found_elements[0].click()
                    time.sleep(1)
                    print(f"  → Successfully clicked {desc}")
                    # Close any opened panel
                    self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                    time.sleep(1)
                except:
                    print(f"  → Could not click {desc}")
            else:
                print(f"✗ No {desc} elements found")
    
    def run_debug_session(self):
        """Run complete debug session"""
        try:
            self.setup_driver()
            self.load_game()
            
            # Wait a bit more for game to fully initialize
            print("Waiting for game to fully initialize...")
            time.sleep(10)
            
            # Run all debug tests
            self.inspect_page_elements()
            self.test_actual_interactions()
            self.test_keyboard_interactions()
            self.find_game_specific_elements()
            
            print(f"\n" + "="*60)
            print("DEBUG SESSION COMPLETE")
            print("="*60)
            print("Check the output above to see what elements were found")
            print("and which interactions worked.")
            
            # Keep browser open for manual inspection
            input("\nPress Enter to close browser and exit...")
            
        except Exception as e:
            print(f"Debug session failed: {e}")
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    print("Fortune Snake Game Debug Tester")
    print("===============================")
    print("This will inspect the actual game elements and test real interactions")
    print()
    
    tester = DebugGameTester()
    tester.run_debug_session()