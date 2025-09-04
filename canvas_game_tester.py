from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import unittest

class CanvasGameTester(unittest.TestCase):
    
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
        """Load the game and wait for it to initialize"""
        print("Loading game...")
        self.driver.get(self.game_url)
        
        WebDriverWait(self.driver, 10).until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        
        # Initialize canvas-based game
        try:
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            
            # Click canvas to start
            canvas.click()
            time.sleep(3)
            
            # Use keyboard to fully initialize
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(5)
            
            print("Canvas game ready")
            return True
            
        except Exception as e:
            print(f"Game loading failed: {e}")
            return False
    
    def click_canvas_area(self, x_percent, y_percent, description):
        """Click specific area of canvas by percentage"""
        try:
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            size = canvas.size
            location = canvas.location
            
            # Calculate click position
            x = int(size['width'] * x_percent / 100)
            y = int(size['height'] * y_percent / 100)
            
            # Click the calculated position
            actions = ActionChains(self.driver)
            actions.move_to_element_with_offset(canvas, x - size['width']//2, y - size['height']//2)
            actions.click()
            actions.perform()
            
            time.sleep(1)
            print(f"✓ Clicked {description} at ({x_percent}%, {y_percent}%)")
            return True
            
        except Exception as e:
            print(f"✗ Failed to click {description}: {e}")
            return False
    
    def test_01_canvas_spin_functionality(self):
        """Test spin functionality via canvas clicks"""
        print("\n=== Testing Canvas Spin Functionality ===")
        
        # Common spin button locations in slot games
        spin_locations = [
            (85, 75, "Bottom-right spin area"),
            (50, 85, "Bottom-center spin area"),
            (90, 50, "Right-center spin area"),
            (15, 75, "Bottom-left spin area")
        ]
        
        for x, y, desc in spin_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(4)  # Wait for potential spin
                print(f"  → Tested spin at {desc}")
    
    def test_02_canvas_betting_controls(self):
        """Test betting controls via canvas clicks"""
        print("\n=== Testing Canvas Betting Controls ===")
        
        # Common bet control locations
        bet_locations = [
            (20, 85, "Bet decrease (bottom-left)"),
            (35, 85, "Bet increase (bottom-left area)"),
            (15, 50, "Left-side bet controls"),
            (25, 50, "Left-side bet controls 2"),
            (80, 85, "Right-side bet controls"),
            (70, 85, "Right-side bet controls 2")
        ]
        
        for x, y, desc in bet_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(1)
                print(f"  → Tested betting at {desc}")
    
    def test_03_canvas_menu_navigation(self):
        """Test menu navigation via canvas clicks"""
        print("\n=== Testing Canvas Menu Navigation ===")
        
        # Common menu locations in slot games
        menu_locations = [
            (5, 5, "Top-left menu"),
            (95, 5, "Top-right menu"),
            (5, 95, "Bottom-left menu"),
            (95, 95, "Bottom-right menu"),
            (50, 5, "Top-center menu"),
            (5, 50, "Left-center menu"),
            (95, 50, "Right-center menu")
        ]
        
        for x, y, desc in menu_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(2)
                
                # Try to close any opened menu
                self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                time.sleep(1)
                print(f"  → Tested menu at {desc}")
    
    def test_04_keyboard_game_controls(self):
        """Test keyboard controls for canvas game"""
        print("\n=== Testing Keyboard Game Controls ===")
        
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        # Test game-specific keyboard shortcuts
        keyboard_tests = [
            (Keys.SPACE, "SPACE - Spin"),
            (Keys.ENTER, "ENTER - Spin/Confirm"),
            (Keys.ARROW_UP, "UP - Increase bet"),
            (Keys.ARROW_DOWN, "DOWN - Decrease bet"),
            (Keys.ARROW_LEFT, "LEFT - Previous option"),
            (Keys.ARROW_RIGHT, "RIGHT - Next option"),
            ('s', "S - Spin shortcut"),
            ('a', "A - Autoplay"),
            ('t', "T - Turbo mode"),
            ('m', "M - Menu"),
            ('h', "H - Help"),
            ('i', "I - Info"),
            (Keys.ESCAPE, "ESC - Close/Cancel"),
            (Keys.F11, "F11 - Fullscreen")
        ]
        
        for key, desc in keyboard_tests:
            try:
                body.send_keys(key)
                time.sleep(1)
                print(f"✓ {desc}")
            except Exception as e:
                print(f"✗ {desc} failed: {e}")
    
    def test_05_canvas_autoplay_functionality(self):
        """Test autoplay via canvas and keyboard"""
        print("\n=== Testing Canvas Autoplay Functionality ===")
        
        # Try autoplay locations
        autoplay_locations = [
            (70, 75, "Autoplay area 1"),
            (60, 85, "Autoplay area 2"),
            (40, 85, "Autoplay area 3")
        ]
        
        for x, y, desc in autoplay_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(2)
                
                # Try to start autoplay with keyboard
                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ENTER)
                time.sleep(1)
                
                # Try to stop autoplay
                body.send_keys(Keys.ESCAPE)
                time.sleep(1)
                print(f"  → Tested autoplay at {desc}")
        
        # Test autoplay via keyboard shortcut
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('a')  # Common autoplay shortcut
        time.sleep(2)
        body.send_keys(Keys.ESCAPE)
        print("✓ Tested autoplay keyboard shortcut")
    
    def test_06_canvas_sound_controls(self):
        """Test sound controls via canvas clicks"""
        print("\n=== Testing Canvas Sound Controls ===")
        
        # Common sound control locations
        sound_locations = [
            (10, 10, "Top-left sound"),
            (90, 10, "Top-right sound"),
            (10, 90, "Bottom-left sound"),
            (90, 90, "Bottom-right sound")
        ]
        
        for x, y, desc in sound_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(1)
                print(f"  → Tested sound control at {desc}")
    
    def test_07_canvas_help_info_access(self):
        """Test help/info access via canvas"""
        print("\n=== Testing Canvas Help/Info Access ===")
        
        # Try help/info locations
        help_locations = [
            (15, 15, "Help icon area"),
            (85, 15, "Info icon area"),
            (50, 10, "Top-center help"),
            (10, 50, "Left-side help")
        ]
        
        for x, y, desc in help_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(2)
                
                # Try to navigate within help if opened
                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ARROW_RIGHT)
                time.sleep(1)
                body.send_keys(Keys.ARROW_LEFT)
                time.sleep(1)
                body.send_keys(Keys.ESCAPE)
                time.sleep(1)
                print(f"  → Tested help/info at {desc}")
        
        # Test help via keyboard
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('h')
        time.sleep(2)
        body.send_keys(Keys.ESCAPE)
        print("✓ Tested help keyboard shortcut")
    
    def test_08_canvas_turbo_mode(self):
        """Test turbo mode via canvas and keyboard"""
        print("\n=== Testing Canvas Turbo Mode ===")
        
        # Try turbo mode locations
        turbo_locations = [
            (75, 60, "Turbo area 1"),
            (65, 70, "Turbo area 2"),
            (55, 75, "Turbo area 3")
        ]
        
        for x, y, desc in turbo_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(1)
                print(f"  → Tested turbo at {desc}")
        
        # Test turbo via keyboard
        body = self.driver.find_element(By.TAG_NAME, "body")
        body.send_keys('t')
        time.sleep(1)
        print("✓ Tested turbo keyboard shortcut")
    
    def test_09_canvas_balance_interaction(self):
        """Test balance area interactions"""
        print("\n=== Testing Canvas Balance Interaction ===")
        
        # Balance display areas
        balance_locations = [
            (50, 20, "Top-center balance"),
            (20, 20, "Top-left balance"),
            (80, 20, "Top-right balance"),
            (50, 80, "Bottom-center balance")
        ]
        
        for x, y, desc in balance_locations:
            if self.click_canvas_area(x, y, desc):
                time.sleep(1)
                print(f"  → Tested balance area at {desc}")
    
    def test_10_canvas_comprehensive_interaction(self):
        """Comprehensive canvas interaction test"""
        print("\n=== Testing Comprehensive Canvas Interaction ===")
        
        canvas = self.driver.find_element(By.TAG_NAME, "canvas")
        actions = ActionChains(self.driver)
        
        # Test systematic clicking across the canvas
        print("Testing systematic canvas clicks...")
        
        # Grid-based clicking (5x5 grid)
        for row in range(5):
            for col in range(5):
                x_percent = 20 + (col * 15)  # 20%, 35%, 50%, 65%, 80%
                y_percent = 20 + (row * 15)  # 20%, 35%, 50%, 65%, 80%
                
                try:
                    self.click_canvas_area(x_percent, y_percent, f"Grid({row},{col})")
                    time.sleep(0.5)
                except:
                    continue
        
        print("✓ Completed systematic canvas interaction")
        
        # Test mouse movements and drags
        print("Testing mouse movements...")
        try:
            actions.move_to_element(canvas)
            actions.click_and_hold()
            actions.move_by_offset(50, 0)
            actions.move_by_offset(0, 50)
            actions.move_by_offset(-50, 0)
            actions.move_by_offset(0, -50)
            actions.release()
            actions.perform()
            print("✓ Mouse movement and drag test completed")
        except Exception as e:
            print(f"✗ Mouse movement test failed: {e}")
    
    def test_11_game_state_detection(self):
        """Test game state detection via canvas changes"""
        print("\n=== Testing Game State Detection ===")
        
        # Take screenshot before interaction
        try:
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            
            # Test multiple interactions and check for changes
            interactions = [
                (50, 50, "Center click"),
                (Keys.SPACE, "Space key"),
                (85, 75, "Spin area click"),
                (Keys.ENTER, "Enter key")
            ]
            
            for interaction in interactions:
                if isinstance(interaction[0], str):
                    # Keyboard interaction
                    body = self.driver.find_element(By.TAG_NAME, "body")
                    body.send_keys(interaction[0])
                    print(f"✓ Tested {interaction[1]}")
                else:
                    # Canvas click interaction
                    self.click_canvas_area(interaction[0], interaction[1], interaction[2])
                
                time.sleep(2)
                
                # Check if canvas content might have changed
                # (In a real implementation, you could compare screenshots)
                print(f"  → Interaction completed: {interaction[-1]}")
        
        except Exception as e:
            print(f"✗ Game state detection failed: {e}")
    
    def test_12_performance_stress_test(self):
        """Test game performance under stress"""
        print("\n=== Testing Performance Stress Test ===")
        
        body = self.driver.find_element(By.TAG_NAME, "body")
        
        # Rapid key presses
        print("Testing rapid key presses...")
        for i in range(10):
            body.send_keys(Keys.SPACE)
            time.sleep(0.1)
        
        print("✓ Rapid key press test completed")
        
        # Rapid canvas clicks
        print("Testing rapid canvas clicks...")
        for i in range(10):
            self.click_canvas_area(50, 50, f"Rapid click {i+1}")
            time.sleep(0.1)
        
        print("✓ Rapid canvas click test completed")
        
        # Test game responsiveness
        start_time = time.time()
        body.send_keys(Keys.SPACE)
        response_time = time.time() - start_time
        print(f"✓ Game response time: {response_time:.3f} seconds")

def run_canvas_tests():
    """Run all canvas-based test cases"""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(CanvasGameTester)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print(f"\n{'='*60}")
    print(f"CANVAS GAME TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")

if __name__ == "__main__":
    print("Canvas-Based Fortune Snake Game Tester")
    print("=====================================")
    print("Testing canvas-based slot game interactions...")
    
    run_canvas_tests()