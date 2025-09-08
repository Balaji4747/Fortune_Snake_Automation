from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import re

class ImprovedBalanceTester:
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
    
    def get_balance_accurate(self):
        """Get balance using the actual game variables from source code"""
        try:
            # Based on debug output - balance functions exist on window object
            balance_script = """
            try {
                // Try the detected balance functions on window
                if (typeof window.getBalance === 'function') {
                    return window.getBalance();
                }
                
                // Try calling balance functions directly
                if (typeof getBalance === 'function') {
                    return getBalance();
                }
                
                // Try CoreLib and slotModel (from gameApp.js)
                if (typeof CoreLib !== 'undefined') {
                    if (CoreLib.WrapperService && typeof CoreLib.WrapperService.getBalance === 'function') {
                        return CoreLib.WrapperService.getBalance();
                    }
                    if (CoreLib.Model && CoreLib.Model.balance) {
                        return CoreLib.Model.balance;
                    }
                }
                
                // Try slotModel (imported in gameApp.js)
                if (typeof slotModel !== 'undefined') {
                    if (typeof slotModel.getBalance === 'function') {
                        return slotModel.getBalance();
                    }
                    if (slotModel.balance) {
                        return slotModel.balance;
                    }
                }
                
                // Try window level game variables
                if (typeof window.gameBalance !== 'undefined') return window.gameBalance;
                if (typeof window.balance !== 'undefined') return window.balance;
                if (typeof window.credit !== 'undefined') return window.credit;
                if (typeof window.coins !== 'undefined') return window.coins;
                
                return null;
            } catch (e) {
                console.log('Balance detection error:', e);
                return null;
            }
            """
            
            balance = self.driver.execute_script(balance_script)
            if balance is not None:
                return float(balance)
            
            # Fallback: Look for balance in DOM elements
            balance_selectors = [
                "[class*='balance']", "[class*='credit']", "[class*='coin']", 
                "[id*='balance']", "[id*='credit']", "[id*='coin']",
                ".balance", ".credit", ".coins", "#balance", "#credit"
            ]
            
            for selector in balance_selectors:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                for elem in elements:
                    text = elem.text.strip()
                    if text and any(char.isdigit() for char in text):
                        numbers = re.findall(r'[\d,]+\.?\d*', text)
                        if numbers:
                            return float(numbers[0].replace(',', ''))
            
            return None
            
        except Exception as e:
            print(f"Balance detection error: {e}")
            return None
    
    def debug_game_variables(self):
        """Debug what variables are available in the game"""
        try:
            debug_script = """
            var result = {
                coreLib: typeof CoreLib !== 'undefined',
                slotModel: typeof slotModel !== 'undefined',
                pixi: typeof PIXI !== 'undefined',
                gameApp: typeof GameApp !== 'undefined',
                wrapperService: false,
                availableVars: []
            };
            
            // Check CoreLib structure
            if (typeof CoreLib !== 'undefined') {
                result.coreLibKeys = Object.keys(CoreLib);
                if (CoreLib.WrapperService) {
                    result.wrapperService = true;
                    result.wrapperMethods = Object.getOwnPropertyNames(CoreLib.WrapperService);
                }
                if (CoreLib.Model) {
                    result.modelKeys = Object.keys(CoreLib.Model);
                }
            }
            
            // Check slotModel
            if (typeof slotModel !== 'undefined') {
                result.slotModelMethods = Object.getOwnPropertyNames(slotModel);
            }
            
            // Check window variables and try to call balance functions
            for (var prop in window) {
                if (prop.toLowerCase().includes('balance') || 
                    prop.toLowerCase().includes('credit') || 
                    prop.toLowerCase().includes('coin')) {
                    var value = 'undefined';
                    try {
                        if (typeof window[prop] === 'function') {
                            value = 'function - result: ' + window[prop]();
                        } else {
                            value = typeof window[prop] + ' - value: ' + window[prop];
                        }
                    } catch (e) {
                        value = 'function - error: ' + e.message;
                    }
                    result.availableVars.push(prop + ': ' + value);
                }
            }
            
            return result;
            """
            
            debug_info = self.driver.execute_script(debug_script)
            print("🔍 GAME DEBUG INFO:")
            print(f"   CoreLib available: {debug_info.get('coreLib', False)}")
            print(f"   SlotModel available: {debug_info.get('slotModel', False)}")
            print(f"   PIXI available: {debug_info.get('pixi', False)}")
            print(f"   WrapperService available: {debug_info.get('wrapperService', False)}")
            
            if debug_info.get('coreLibKeys'):
                print(f"   CoreLib keys: {debug_info['coreLibKeys']}")
            
            if debug_info.get('wrapperMethods'):
                print(f"   WrapperService methods: {debug_info['wrapperMethods']}")
            
            if debug_info.get('slotModelMethods'):
                print(f"   SlotModel methods: {debug_info['slotModelMethods']}")
            
            if debug_info.get('availableVars'):
                print(f"   Balance-related vars: {debug_info['availableVars']}")
            
            return debug_info
            
        except Exception as e:
            print(f"Debug error: {e}")
            return {}
    
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
    
    def test_balance_detection(self):
        """Test the improved balance detection"""
        print("\n" + "="*80)
        print("🎰 IMPROVED BALANCE DETECTION TEST")
        print("="*80)
        
        try:
            # Load game
            print("\n📋 Loading game...")
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
            body.send_keys(Keys.ENTER)
            time.sleep(8)  # Wait longer for game to fully load
            
            print("✅ Game loaded!")
            
            # Debug game variables
            print("\n📋 Debugging game variables...")
            self.debug_game_variables()
            
            # Test balance detection
            print("\n📋 Testing balance detection...")
            
            for attempt in range(5):
                print(f"\n🔍 Balance detection attempt {attempt + 1}:")
                balance = self.get_balance_accurate()
                
                if balance is not None:
                    print(f"✅ Balance detected: {balance}")
                else:
                    print("❌ Balance not detected")
                
                time.sleep(2)
            
            # Test balance before and after spin
            print("\n📋 Testing balance tracking during spin...")
            
            initial_balance = self.get_balance_accurate()
            print(f"💰 Initial balance: {initial_balance}")
            
            # Perform spin
            print("🎯 Performing spin...")
            body.send_keys(Keys.SPACE)
            
            # Wait and check balance multiple times during spin
            for i in range(10):
                time.sleep(1)
                current_balance = self.get_balance_accurate()
                print(f"   ⏱️ {i+1}s - Balance: {current_balance}")
            
            final_balance = self.get_balance_accurate()
            print(f"💰 Final balance: {final_balance}")
            
            if initial_balance is not None and final_balance is not None:
                change = final_balance - initial_balance
                print(f"📊 Balance change: {change}")
                
                if change < 0:
                    print("💸 Bet deducted successfully!")
                elif change > 0:
                    print("🎉 Win detected!")
                else:
                    print("➡️ No change")
            
            time.sleep(5)
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            time.sleep(3)
    
    def run_test(self):
        """Run the balance detection test"""
        try:
            self.setup_driver()
            self.test_balance_detection()
            
            print("\n🎉 BALANCE DETECTION TEST COMPLETED!")
            print("Browser will close in 5 seconds...")
            time.sleep(5)
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
            time.sleep(3)
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = ImprovedBalanceTester()
    tester.run_test()