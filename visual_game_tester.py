from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

class VisualGameTester:
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
        print("🎮 Loading Fortune Snake Game...")
        self.driver.get(self.game_url)
        
        WebDriverWait(self.driver, 10).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        
        # Initialize game
        try:
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(3)
            
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(5)
            
            print("✅ Game loaded and ready!")
        except Exception as e:
            print(f"❌ Game loading issue: {e}")
    
    def click_canvas_area(self, x_percent, y_percent, description, wait_time=3):
        """Click specific area of canvas and wait to see result"""
        try:
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            size = canvas.size
            
            # Calculate click position
            x = int(size['width'] * x_percent / 100)
            y = int(size['height'] * y_percent / 100)
            
            # Highlight the area we're about to click (visual feedback)
            print(f"🎯 Clicking {description} at ({x_percent}%, {y_percent}%)")
            
            # Click the calculated position
            actions = ActionChains(self.driver)
            actions.move_to_element_with_offset(canvas, x - size['width']//2, y - size['height']//2)
            actions.click()
            actions.perform()
            
            print(f"✅ Clicked {description} - Watch the game!")
            time.sleep(wait_time)  # Wait to see the result
            return True
            
        except Exception as e:
            print(f"❌ Failed to click {description}: {e}")
            return False
    
    def test_spin_functionality(self):
        """Test spin functionality with visual feedback"""
        print("\n" + "="*60)
        print("🎰 TESTING SPIN FUNCTIONALITY")
        print("="*60)
        print("Watch the browser - testing different spin button locations...")
        
        # Test multiple spin locations
        spin_locations = [
            (85, 75, "Main Spin Button (Bottom-Right)", 6),
            (50, 85, "Center Spin Button (Bottom)", 6),
            (90, 50, "Side Spin Button (Right)", 6),
            (15, 75, "Alternative Spin (Bottom-Left)", 6)
        ]
        
        for x, y, desc, wait in spin_locations:
            print(f"\n🎯 Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for spinning reels or animations!")
            
            # Also test keyboard spin
            print("🎹 Testing keyboard SPACE for spin...")
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            time.sleep(4)
            print("   → Watch for spin animation!")
    
    def test_betting_controls(self):
        """Test betting controls with visual feedback"""
        print("\n" + "="*60)
        print("💰 TESTING BETTING CONTROLS")
        print("="*60)
        print("Watch the browser - testing bet increase/decrease...")
        
        bet_locations = [
            (20, 85, "Bet Decrease (Left)", 2),
            (35, 85, "Bet Increase (Left-Center)", 2),
            (15, 50, "Left Side Bet Controls", 2),
            (80, 85, "Right Side Bet Controls", 2),
            (70, 85, "Bet Max Area", 2)
        ]
        
        for x, y, desc, wait in bet_locations:
            print(f"\n💵 Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for bet amount changes!")
        
        # Test keyboard bet controls
        print("\n🎹 Testing keyboard bet controls...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        print("   ⬆️ UP Arrow - Increase bet")
        body.send_keys(Keys.ARROW_UP)
        time.sleep(2)
        
        print("   ⬇️ DOWN Arrow - Decrease bet")
        body.send_keys(Keys.ARROW_DOWN)
        time.sleep(2)
    
    def test_menu_navigation(self):
        """Test menu navigation with visual feedback"""
        print("\n" + "="*60)
        print("📋 TESTING MENU NAVIGATION")
        print("="*60)
        print("Watch the browser - testing menu access...")
        
        menu_locations = [
            (5, 5, "Top-Left Menu", 3),
            (95, 5, "Top-Right Menu", 3),
            (5, 95, "Bottom-Left Menu", 3),
            (95, 95, "Bottom-Right Menu", 3),
            (50, 5, "Top-Center Menu", 3)
        ]
        
        for x, y, desc, wait in menu_locations:
            print(f"\n📱 Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for menu panels or options!")
                
                # Try to close menu
                print("   🔙 Pressing ESC to close...")
                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ESCAPE)
                time.sleep(1)
        
        # Test menu keyboard shortcut
        print("\n🎹 Testing 'M' key for menu...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('m')
        time.sleep(3)
        body.send_keys(Keys.ESCAPE)
        time.sleep(1)
    
    def test_autoplay_functionality(self):
        """Test autoplay with visual feedback"""
        print("\n" + "="*60)
        print("🔄 TESTING AUTOPLAY FUNCTIONALITY")
        print("="*60)
        print("Watch the browser - testing autoplay activation...")
        
        autoplay_locations = [
            (70, 75, "Autoplay Button Area", 4),
            (60, 85, "Auto Controls Area", 4),
            (40, 85, "Alternative Auto Area", 4)
        ]
        
        for x, y, desc, wait in autoplay_locations:
            print(f"\n🔄 Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for autoplay activation!")
                
                # Try to stop autoplay
                print("   ⏹️ Trying to stop autoplay...")
                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ESCAPE)
                time.sleep(2)
        
        # Test autoplay keyboard
        print("\n🎹 Testing 'A' key for autoplay...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('a')
        time.sleep(4)
        print("   → Watch for autoplay menu or activation!")
        body.send_keys(Keys.ESCAPE)
        time.sleep(1)
    
    def test_sound_controls(self):
        """Test sound controls with visual feedback"""
        print("\n" + "="*60)
        print("🔊 TESTING SOUND CONTROLS")
        print("="*60)
        print("Watch the browser - testing sound toggle...")
        
        sound_locations = [
            (10, 10, "Top-Left Sound Icon", 2),
            (90, 10, "Top-Right Sound Icon", 2),
            (10, 90, "Bottom-Left Sound", 2),
            (90, 90, "Bottom-Right Sound", 2)
        ]
        
        for x, y, desc, wait in sound_locations:
            print(f"\n🔊 Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for sound icon changes!")
    
    def test_help_info_access(self):
        """Test help/info access with visual feedback"""
        print("\n" + "="*60)
        print("❓ TESTING HELP/INFO ACCESS")
        print("="*60)
        print("Watch the browser - testing help panel access...")
        
        help_locations = [
            (15, 15, "Help Icon (Top-Left)", 4),
            (85, 15, "Info Icon (Top-Right)", 4),
            (50, 10, "Top-Center Help", 4)
        ]
        
        for x, y, desc, wait in help_locations:
            print(f"\n❓ Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for help panels or paytables!")
                
                # Try to close help
                print("   🔙 Pressing ESC to close...")
                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ESCAPE)
                time.sleep(1)
        
        # Test help keyboard
        print("\n🎹 Testing 'H' key for help...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('h')
        time.sleep(4)
        print("   → Watch for help or info panels!")
        body.send_keys(Keys.ESCAPE)
        time.sleep(1)
    
    def test_turbo_mode(self):
        """Test turbo mode with visual feedback"""
        print("\n" + "="*60)
        print("⚡ TESTING TURBO MODE")
        print("="*60)
        print("Watch the browser - testing turbo activation...")
        
        turbo_locations = [
            (75, 60, "Turbo Button Area", 3),
            (65, 70, "Speed Control Area", 3),
            (55, 75, "Fast Mode Area", 3)
        ]
        
        for x, y, desc, wait in turbo_locations:
            print(f"\n⚡ Testing: {desc}")
            if self.click_canvas_area(x, y, desc, wait):
                print(f"   → Look for turbo mode activation!")
        
        # Test turbo keyboard
        print("\n🎹 Testing 'T' key for turbo...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('t')
        time.sleep(3)
        print("   → Watch for turbo mode changes!")
    
    def test_comprehensive_interaction(self):
        """Comprehensive interaction test"""
        print("\n" + "="*60)
        print("🎮 COMPREHENSIVE GAME INTERACTION TEST")
        print("="*60)
        print("Watch the browser - systematic testing across the game...")
        
        # Test key areas systematically
        key_areas = [
            (50, 50, "Game Center", 2),
            (25, 25, "Top-Left Quadrant", 2),
            (75, 25, "Top-Right Quadrant", 2),
            (25, 75, "Bottom-Left Quadrant", 2),
            (75, 75, "Bottom-Right Quadrant", 2)
        ]
        
        for x, y, desc, wait in key_areas:
            print(f"\n🎯 Testing: {desc}")
            self.click_canvas_area(x, y, desc, wait)
        
        # Test all keyboard shortcuts
        print("\n🎹 Testing all keyboard shortcuts...")
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        shortcuts = [
            (Keys.SPACE, "SPACE - Spin", 3),
            (Keys.ENTER, "ENTER - Confirm", 2),
            ('s', "S - Spin shortcut", 3),
            ('a', "A - Autoplay", 2),
            ('t', "T - Turbo", 2),
            ('m', "M - Menu", 2),
            ('h', "H - Help", 2),
            ('i', "I - Info", 2)
        ]
        
        for key, desc, wait in shortcuts:
            print(f"   🎹 {desc}")
            body.send_keys(key)
            time.sleep(wait)
            body.send_keys(Keys.ESCAPE)  # Close any opened panels
            time.sleep(1)
    
    def run_visual_tests(self):
        """Run all visual tests with user interaction"""
        try:
            self.setup_driver()
            self.load_game()
            
            print("\n" + "🎮"*20)
            print("VISUAL GAME TESTING STARTED")
            print("🎮"*20)
            print("Keep watching the browser window to see interactions!")
            
            # Run all tests with pauses
            self.test_spin_functionality()
            
            input("\n⏸️  Press ENTER to continue to betting tests...")
            self.test_betting_controls()
            
            input("\n⏸️  Press ENTER to continue to menu tests...")
            self.test_menu_navigation()
            
            input("\n⏸️  Press ENTER to continue to autoplay tests...")
            self.test_autoplay_functionality()
            
            input("\n⏸️  Press ENTER to continue to sound tests...")
            self.test_sound_controls()
            
            input("\n⏸️  Press ENTER to continue to help tests...")
            self.test_help_info_access()
            
            input("\n⏸️  Press ENTER to continue to turbo tests...")
            self.test_turbo_mode()
            
            input("\n⏸️  Press ENTER to continue to comprehensive tests...")
            self.test_comprehensive_interaction()
            
            print("\n" + "🎉"*20)
            print("ALL VISUAL TESTS COMPLETED!")
            print("🎉"*20)
            print("You should have seen all the game interactions!")
            
            input("\n⏸️  Press ENTER to close browser and exit...")
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    print("🎰 Visual Fortune Snake Game Tester")
    print("=" * 50)
    print("This tester will show you EXACTLY what each test does!")
    print("Keep the browser window visible to see all interactions.")
    print("=" * 50)
    
    tester = VisualGameTester()
    tester.run_visual_tests()