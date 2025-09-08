from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

class ManualStartHelper:
    def __init__(self):
        self.driver = None
        self.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68be85185cc7576799d9d0d4_443"
    
    def setup_driver(self):
        """Setup Chrome driver"""
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
    
    def load_game_and_wait(self):
        """Load game and keep browser open for manual inspection"""
        print("🎮 Loading Fortune Snake game...")
        self.driver.get(self.game_url)
        
        # Wait for page to load
        WebDriverWait(self.driver, 15).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        
        # Wait for canvas
        canvas = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "canvas"))
        )
        
        print("✅ Game loaded! Browser is now open.")
        print("\n" + "="*60)
        print("👀 LOOK AT THE BROWSER NOW!")
        print("="*60)
        print("🎯 What do you see on the screen?")
        print("   - Is there a 'START' button?")
        print("   - Is there a 'PLAY' button?") 
        print("   - Is there any text or logo?")
        print("   - Is the screen black?")
        print("   - Do you see the game reels?")
        print("="*60)
        
        # Try basic interactions while you watch
        print("\n🎯 I'll try some basic clicks while you watch...")
        
        # Click center
        print("1. Clicking center of screen...")
        canvas.click()
        time.sleep(3)
        
        # Try SPACE key
        print("2. Pressing SPACE key...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.SPACE)
        time.sleep(3)
        
        # Try ENTER key
        print("3. Pressing ENTER key...")
        body.send_keys(Keys.ENTER)
        time.sleep(3)
        
        # Click different areas
        areas_to_try = [
            (50, 70, "Lower center"),
            (50, 80, "Bottom area"),
            (60, 60, "Right of center"),
            (40, 60, "Left of center")
        ]
        
        for i, (x, y, desc) in enumerate(areas_to_try, 4):
            print(f"{i}. Clicking {desc}...")
            self.click_canvas_area(x, y)
            time.sleep(2)
        
        print("\n" + "="*60)
        print("❓ TELL ME WHAT HAPPENED:")
        print("="*60)
        
        # Keep browser open and ask for feedback
        while True:
            user_input = input("\nWhat do you see now? (type 'spin' if you can spin, 'stuck' if still stuck, 'quit' to exit): ").lower()
            
            if user_input == 'spin':
                print("🎉 Great! Game is working. Let me try a spin...")
                body.send_keys(Keys.SPACE)
                print("⏳ Spinning... watch the reels!")
                time.sleep(8)
                print("✅ Spin completed!")
                break
                
            elif user_input == 'stuck':
                print("🔄 Still stuck. Let me try more things...")
                
                # Try more aggressive clicking
                for i in range(5):
                    print(f"   Attempt {i+1}: Clicking and pressing keys...")
                    canvas.click()
                    time.sleep(0.5)
                    body.send_keys(Keys.SPACE)
                    time.sleep(0.5)
                    body.send_keys(Keys.ENTER)
                    time.sleep(1)
                
                print("Did anything change?")
                
            elif user_input == 'quit':
                break
                
            else:
                print("Please type 'spin', 'stuck', or 'quit'")
    
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
    
    def run_manual_test(self):
        """Run manual test with browser open"""
        try:
            self.setup_driver()
            self.load_game_and_wait()
            
            print("\n🎯 Manual testing completed!")
            print("Browser will close in 10 seconds...")
            time.sleep(10)
            
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(5)
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    helper = ManualStartHelper()
    helper.run_manual_test()