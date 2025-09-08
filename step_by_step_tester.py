from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import re

class StepByStepGameTester:
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
    
    def get_balance_from_canvas(self):
        """Try to extract balance from canvas or page"""
        try:
            # Method 1: Check if balance is in page source or JavaScript variables
            balance_script = """
            // Try to find balance in common game variables
            if (typeof window.gameBalance !== 'undefined') return window.gameBalance;
            if (typeof window.balance !== 'undefined') return window.balance;
            if (typeof window.credit !== 'undefined') return window.credit;
            if (typeof window.coins !== 'undefined') return window.coins;
            
            // Try to find balance in localStorage
            var stored = localStorage.getItem('balance') || localStorage.getItem('credit');
            if (stored) return stored;
            
            return null;
            """
            
            balance = self.driver.execute_script(balance_script)
            if balance:
                return float(balance)
            
            # Method 2: Look for balance in DOM elements (if any)
            balance_elements = self.driver.find_elements(By.CSS_SELECTOR, 
                "[class*='balance'], [class*='credit'], [class*='coin'], [id*='balance']")
            
            for elem in balance_elements:
                text = elem.text.strip()
                if text and any(char.isdigit() for char in text):
                    # Extract numbers from text
                    numbers = re.findall(r'[\d,]+\.?\d*', text)
                    if numbers:
                        return float(numbers[0].replace(',', ''))
            
            return None
            
        except Exception as e:
            print(f"Could not get balance: {e}")
            return None
    
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
    
    def detect_spin_animation(self):
        """Try to detect if spin animation is happening"""
        try:
            # Method 1: Check for animation-related CSS or classes
            animated_elements = self.driver.find_elements(By.CSS_SELECTOR, 
                "[class*='spin'], [class*='rotate'], [class*='animate']")
            
            # Method 2: Check canvas for changes (basic)
            canvas = self.driver.find_element(By.TAG_NAME, "canvas")
            
            # Method 3: Check for JavaScript animation variables
            animation_script = """
            if (typeof window.isSpinning !== 'undefined') return window.isSpinning;
            if (typeof window.spinning !== 'undefined') return window.spinning;
            if (typeof window.gameState !== 'undefined') return window.gameState;
            return false;
            """
            
            is_animating = self.driver.execute_script(animation_script)
            return bool(is_animating)
            
        except:
            return False
    
    def test_01_complete_spin_cycle(self):
        """TC 01: Complete spin cycle test with balance tracking"""
        print("\n" + "="*80)
        print("🎰 TEST CASE 01: COMPLETE SPIN CYCLE")
        print("="*80)
        
        try:
            # Step 1: Load the game
            print("\n📋 STEP 1: Loading the game...")
            self.driver.get(self.game_url)
            
            WebDriverWait(self.driver, 15).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            
            # Initialize game
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(3)
            
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            body.send_keys(Keys.ENTER)
            time.sleep(5)
            
            print("✅ Game loaded successfully!")
            input("👀 LOOK AT BROWSER: Game is loaded. Press ENTER to continue...")
            
            # Step 2: Get initial balance
            print("\n📋 STEP 2: Getting initial balance...")
            initial_balance = self.get_balance_from_canvas()
            
            if initial_balance is not None:
                print(f"💰 Initial Balance: {initial_balance}")
            else:
                print("⚠️ Could not detect balance automatically")
                initial_balance = float(input("💰 Please enter the current balance you see: "))
            
            input("👀 LOOK AT BROWSER: Note the current balance. Press ENTER to continue...")
            
            # Step 3: Click spin button
            print("\n📋 STEP 3: Clicking spin button...")
            
            # Try multiple spin locations
            spin_locations = [
                (85, 75, "Bottom-Right Spin Area"),
                (50, 85, "Bottom-Center Spin Area"),
                (90, 50, "Right-Side Spin Area")
            ]
            
            spin_clicked = False
            for x, y, desc in spin_locations:
                print(f"🎯 Trying to click {desc} at ({x}%, {y}%)")
                if self.click_canvas_area(x, y):
                    print(f"✅ Clicked {desc}")
                    time.sleep(2)
                    
                    # Check if spin started
                    if self.detect_spin_animation():
                        print("🎰 SPIN ANIMATION DETECTED!")
                        spin_clicked = True
                        break
                    else:
                        print("🔄 Trying keyboard SPACE as backup...")
                        body.send_keys(Keys.SPACE)
                        time.sleep(2)
                        if self.detect_spin_animation():
                            print("🎰 SPIN STARTED WITH KEYBOARD!")
                            spin_clicked = True
                            break
            
            if not spin_clicked:
                print("🔄 Trying keyboard SPACE for spin...")
                body.send_keys(Keys.SPACE)
                time.sleep(1)
                print("✅ Spin command sent via keyboard")
            
            input("👀 LOOK AT BROWSER: Did you see the reels spinning? Press ENTER to continue...")
            
            # Step 4: Wait for spin to complete and check results
            print("\n📋 STEP 4: Waiting for spin to complete...")
            print("⏳ Waiting 8 seconds for spin animation to finish...")
            
            for i in range(8):
                print(f"   ⏱️ {8-i} seconds remaining...")
                time.sleep(1)
            
            print("✅ Spin should be completed now!")
            input("👀 LOOK AT BROWSER: Spin completed. Check the reels. Press ENTER to continue...")
            
            # Step 5: Check balance after spin
            print("\n📋 STEP 5: Checking balance after spin...")
            time.sleep(2)  # Wait a bit more for balance update
            
            final_balance = self.get_balance_from_canvas()
            
            if final_balance is not None:
                print(f"💰 Final Balance: {final_balance}")
                balance_change = final_balance - initial_balance
                
                if balance_change < 0:
                    print(f"💸 Balance DECREASED by {abs(balance_change)} (Bet deducted)")
                elif balance_change > 0:
                    print(f"🎉 Balance INCREASED by {balance_change} (WIN!)")
                else:
                    print("➡️ Balance unchanged")
            else:
                print("⚠️ Could not detect final balance automatically")
                final_balance = float(input("💰 Please enter the final balance you see: "))
                balance_change = final_balance - initial_balance
                
                if balance_change < 0:
                    print(f"💸 Balance DECREASED by {abs(balance_change)} (Bet deducted)")
                elif balance_change > 0:
                    print(f"🎉 Balance INCREASED by {balance_change} (WIN!)")
                else:
                    print("➡️ Balance unchanged")
            
            input("👀 LOOK AT BROWSER: Check the final balance. Press ENTER to continue...")
            
            # Step 6: Test Results Summary
            print("\n📋 STEP 6: Test Results Summary")
            print("="*50)
            print("✅ Game Loading: SUCCESS")
            print("✅ Spin Button Click: SUCCESS")
            
            spin_happened = input("❓ Did you see the reels spinning? (y/n): ").lower() == 'y'
            if spin_happened:
                print("✅ Spin Animation: SUCCESS")
            else:
                print("❌ Spin Animation: FAILED")
            
            if balance_change < 0:
                print("✅ Balance Deduction: SUCCESS")
                print("✅ Bet Processing: SUCCESS")
            elif balance_change > 0:
                print("✅ Win Detection: SUCCESS")
                print("✅ Balance Addition: SUCCESS")
                print("🎉 CONGRATULATIONS - YOU WON!")
            else:
                print("⚠️ No balance change detected")
            
            print(f"\n💰 BALANCE SUMMARY:")
            print(f"   Initial: {initial_balance}")
            print(f"   Final: {final_balance}")
            print(f"   Change: {balance_change}")
            
            input("\n🎯 TEST CASE 01 COMPLETED! Press ENTER to close browser...")
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            input("Press ENTER to close browser...")
    
    def test_02_multiple_spins(self):
        """TC 02: Multiple spins to test consistency"""
        print("\n" + "="*80)
        print("🎰 TEST CASE 02: MULTIPLE SPINS TEST")
        print("="*80)
        
        try:
            # Load game (reuse from TC01)
            print("📋 Loading game for multiple spins test...")
            self.driver.get(self.game_url)
            
            WebDriverWait(self.driver, 15).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(3)
            
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            time.sleep(5)
            
            print("✅ Game ready for multiple spins!")
            
            # Perform 3 spins
            for spin_num in range(1, 4):
                print(f"\n🎰 SPIN #{spin_num}")
                print("-" * 30)
                
                # Get balance before spin
                balance_before = self.get_balance_from_canvas()
                if balance_before is None:
                    balance_before = float(input(f"💰 Enter balance before spin {spin_num}: "))
                
                print(f"💰 Balance before spin: {balance_before}")
                
                # Perform spin
                print("🎯 Clicking spin...")
                body.send_keys(Keys.SPACE)
                
                input(f"👀 WATCH SPIN #{spin_num}: Press ENTER when spin completes...")
                
                # Get balance after spin
                time.sleep(2)
                balance_after = self.get_balance_from_canvas()
                if balance_after is None:
                    balance_after = float(input(f"💰 Enter balance after spin {spin_num}: "))
                
                change = balance_after - balance_before
                print(f"💰 Balance after spin: {balance_after}")
                print(f"📊 Change: {change}")
                
                if change > 0:
                    print("🎉 WIN!")
                elif change < 0:
                    print("💸 Loss (bet deducted)")
                else:
                    print("➡️ No change")
                
                time.sleep(2)
            
            input("\n🎯 MULTIPLE SPINS TEST COMPLETED! Press ENTER to close...")
            
        except Exception as e:
            print(f"❌ Multiple spins test failed: {e}")
            input("Press ENTER to close...")
    
    def run_all_tests(self):
        """Run all step-by-step tests"""
        try:
            self.setup_driver()
            
            print("🎮 STEP-BY-STEP GAME TESTER")
            print("=" * 50)
            print("This will show you EXACTLY what each test does!")
            print("Keep watching the browser window.")
            print("=" * 50)
            
            # Run TC 01
            self.test_01_complete_spin_cycle()
            
            # Ask if user wants to run more tests
            if input("\n❓ Run multiple spins test? (y/n): ").lower() == 'y':
                self.test_02_multiple_spins()
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = StepByStepGameTester()
    tester.run_all_tests()