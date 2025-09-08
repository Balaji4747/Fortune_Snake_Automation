from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

class FixedGameLoader:
    def __init__(self):
        self.driver = None
        self.game_url = "https://games.microslot.co/fortunesnake/index.html?token="
    
    def setup_driver(self):
        """Setup Chrome driver"""
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--autoplay-policy=no-user-gesture-required")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
    
    def load_and_start_game(self):
        """Load game and properly handle start screen"""
        print("🎮 Loading Fortune Snake game...")
        self.driver.get(self.game_url)
        
        # Wait for page to load
        WebDriverWait(self.driver, 15).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        print("✅ Page loaded")
        
        # Wait for canvas
        canvas = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "canvas"))
        )
        print("✅ Canvas found")
        
        # Step 1: Click canvas to focus
        print("🎯 Step 1: Clicking canvas to focus...")
        canvas.click()
        time.sleep(2)
        
        # Step 2: Look for start button or splash screen
        print("🎯 Step 2: Looking for start button...")
        
        # Try clicking different areas where start button might be
        start_areas = [
            (50, 50, "Center"),
            (50, 70, "Lower Center"), 
            (50, 80, "Bottom Center"),
            (60, 75, "Right of Center"),
            (40, 75, "Left of Center"),
            (50, 60, "Mid-Lower"),
            (50, 85, "Very Bottom")
        ]
        
        for x, y, desc in start_areas:
            print(f"   🎯 Trying {desc} at ({x}%, {y}%)")
            self.click_canvas_area(x, y)
            time.sleep(2)
            
            # Check if game started by looking for game elements
            if self.check_if_game_started():
                print(f"✅ Game started after clicking {desc}!")
                return True
        
        # Step 3: Try keyboard interactions
        print("🎯 Step 3: Trying keyboard interactions...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        keyboard_attempts = [
            (Keys.SPACE, "SPACE"),
            (Keys.ENTER, "ENTER"), 
            ('s', "S key"),
            ('p', "P key"),
            (Keys.ESCAPE, "ESCAPE"),
            ('c', "C key")
        ]
        
        for key, desc in keyboard_attempts:
            print(f"   ⌨️ Trying {desc}")
            body.send_keys(key)
            time.sleep(3)
            
            if self.check_if_game_started():
                print(f"✅ Game started after pressing {desc}!")
                return True
        
        # Step 4: Try clicking and then keyboard
        print("🎯 Step 4: Combining click + keyboard...")
        canvas.click()
        time.sleep(1)
        body.send_keys(Keys.SPACE)
        time.sleep(2)
        body.send_keys(Keys.ENTER)
        time.sleep(3)
        
        if self.check_if_game_started():
            print("✅ Game started with click + keyboard combo!")
            return True
        
        # Step 5: Wait longer and try again
        print("🎯 Step 5: Waiting longer for game to initialize...")
        time.sleep(5)
        
        # Try all areas again
        for x, y, desc in start_areas:
            print(f"   🎯 Second attempt: {desc}")
            self.click_canvas_area(x, y)
            time.sleep(1)
            body.send_keys(Keys.SPACE)
            time.sleep(2)
            
            if self.check_if_game_started():
                print(f"✅ Game started on second attempt at {desc}!")
                return True
        
        print("⚠️ Game might still be on start screen - continuing anyway...")
        return False
    
    def click_canvas_area(self, x_percent, y_percent):
        """Click specific area of canvas"""
        try:
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            size = canvas.size
            
            x = int(size['width'] * x_percent / 100)
            y = int(size['height'] * y_percent / 100)
            
            actions = ActionChains(self.driver)
            actions.move_to_element_with_offset(canvas, x - size['width']//2, y - size['height']//2)
            actions.click()
            actions.perform()
            return True
        except:
            return False
    
    def check_if_game_started(self):
        """Check if game has moved past start screen"""
        try:
            # Check for game variables that indicate game is running
            game_check_script = """
            try {
                // Check if game objects are loaded
                if (typeof window.getBalance === 'function') {
                    var balance = window.getBalance();
                    if (balance !== null && balance !== undefined) {
                        return true;
                    }
                }
                
                // Check for PIXI application
                if (typeof PIXI !== 'undefined' && PIXI.Application && PIXI.Application.shared) {
                    return true;
                }
                
                // Check for CoreLib
                if (typeof CoreLib !== 'undefined') {
                    return true;
                }
                
                return false;
            } catch (e) {
                return false;
            }
            """
            
            result = self.driver.execute_script(game_check_script)
            return result
            
        except:
            return False
    
    def test_game_interaction(self):
        """Test basic game interaction after loading"""
        print("\n🧪 Testing game interaction...")
        
        # Try to get balance
        balance_script = """
        try {
            if (typeof window.getBalance === 'function') {
                return window.getBalance();
            }
            return null;
        } catch (e) {
            return null;
        }
        """
        
        balance = self.driver.execute_script(balance_script)
        print(f"💰 Balance detected: {balance}")
        
        # Try a spin
        print("🎰 Attempting spin...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.SPACE)
        
        print("⏳ Waiting 8 seconds for spin...")
        for i in range(8):
            print(f"   ⏱️ {8-i} seconds remaining...")
            time.sleep(1)
        
        # Check balance after spin
        new_balance = self.driver.execute_script(balance_script)
        print(f"💰 Balance after spin: {new_balance}")
        
        if balance is not None and new_balance is not None:
            if balance != new_balance:
                print("✅ Spin successful - balance changed!")
            else:
                print("⚠️ Spin may have occurred but no balance change")
        else:
            print("⚠️ Balance tracking not working")
    
    def run_test(self):
        """Run the fixed game loading test"""
        try:
            self.setup_driver()
            
            print("🚀 FIXED GAME LOADER - HANDLING START SCREEN")
            print("="*60)
            
            # Load and start game
            game_started = self.load_and_start_game()
            
            if game_started:
                print("\n✅ SUCCESS: Game started successfully!")
            else:
                print("\n⚠️ WARNING: Game may still be on start screen")
            
            # Test interaction regardless
            self.test_game_interaction()
            
            print("\n🎮 Game is now ready for testing!")
            print("👀 Check the browser - you should see the game running")
            print("🔄 Browser will stay open for 30 seconds...")
            
            # Keep browser open for inspection
            for i in range(30):
                print(f"   ⏱️ Browser open: {30-i} seconds remaining...")
                time.sleep(1)
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            time.sleep(5)
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    loader = FixedGameLoader()
    loader.run_test()