from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import json

class ConsoleDebugTester:
    def __init__(self):
        self.driver = None
        self.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68be85185cc7576799d9d0d4_443"
    
    def setup_driver(self):
        """Setup Chrome driver with console logging"""
        # Enable logging
        caps = DesiredCapabilities.CHROME
        caps['goog:loggingPrefs'] = {'browser': 'ALL'}
        
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--enable-logging")
        chrome_options.add_argument("--v=1")
        
        self.driver = webdriver.Chrome(options=chrome_options, desired_capabilities=caps)
        self.driver.maximize_window()
    
    def get_console_logs(self):
        """Get all console logs"""
        try:
            logs = self.driver.get_log('browser')
            return logs
        except Exception as e:
            print(f"Could not get console logs: {e}")
            return []
    
    def print_console_logs(self, title="Console Logs"):
        """Print console logs in a readable format"""
        logs = self.get_console_logs()
        if logs:
            print(f"\n🔍 {title}:")
            print("-" * 50)
            for log in logs:
                level = log['level']
                message = log['message']
                timestamp = log['timestamp']
                
                # Color code by level
                if level == 'SEVERE':
                    print(f"❌ ERROR: {message}")
                elif level == 'WARNING':
                    print(f"⚠️ WARNING: {message}")
                elif level == 'INFO':
                    print(f"ℹ️ INFO: {message}")
                else:
                    print(f"📝 {level}: {message}")
            print("-" * 50)
        else:
            print(f"\n✅ {title}: No errors found")
    
    def test_with_console_monitoring(self):
        """Test game loading with console monitoring"""
        print("\n" + "="*80)
        print("🔍 CONSOLE DEBUG TEST - MONITORING ERRORS")
        print("="*80)
        
        try:
            # Step 1: Load game and monitor console
            print("\n📋 STEP 1: Loading game...")
            self.driver.get(self.game_url)
            time.sleep(2)
            self.print_console_logs("After Page Load")
            
            # Wait for page ready
            WebDriverWait(self.driver, 15).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            time.sleep(2)
            self.print_console_logs("After Document Ready")
            
            # Step 2: Find and click canvas
            print("\n📋 STEP 2: Initializing game...")
            canvas = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "canvas"))
            )
            canvas.click()
            time.sleep(3)
            self.print_console_logs("After Canvas Click")
            
            # Step 3: Send initialization keys
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.SPACE)
            time.sleep(1)
            self.print_console_logs("After SPACE Key")
            
            body.send_keys(Keys.ENTER)
            time.sleep(2)
            self.print_console_logs("After ENTER Key")
            
            # Step 4: Wait for game to fully load
            print("\n📋 STEP 3: Waiting for game initialization...")
            for i in range(8):
                time.sleep(1)
                print(f"   ⏱️ Waiting... {i+1}/8 seconds")
                if i % 2 == 0:  # Check logs every 2 seconds
                    self.print_console_logs(f"During Loading ({i+1}s)")
            
            # Step 5: Test balance detection
            print("\n📋 STEP 4: Testing balance detection...")
            balance_script = """
            try {
                var result = {
                    coreLib: typeof CoreLib !== 'undefined',
                    slotModel: typeof slotModel !== 'undefined',
                    balance: null,
                    error: null
                };
                
                if (typeof CoreLib !== 'undefined' && CoreLib.WrapperService) {
                    if (typeof CoreLib.WrapperService.getBalance === 'function') {
                        result.balance = CoreLib.WrapperService.getBalance();
                    }
                }
                
                return result;
            } catch (e) {
                return { error: e.toString() };
            }
            """
            
            balance_result = self.driver.execute_script(balance_script)
            print(f"💰 Balance detection result: {balance_result}")
            self.print_console_logs("After Balance Detection")
            
            # Step 6: Test spin
            print("\n📋 STEP 5: Testing spin...")
            body.send_keys(Keys.SPACE)
            time.sleep(2)
            self.print_console_logs("After Spin Command")
            
            # Monitor during spin
            for i in range(6):
                time.sleep(1)
                print(f"   🎰 Spin progress... {i+1}/6 seconds")
                if i == 2 or i == 5:  # Check at key moments
                    self.print_console_logs(f"During Spin ({i+1}s)")
            
            # Final console check
            print("\n📋 FINAL: Complete console log summary")
            self.print_console_logs("FINAL CONSOLE STATE")
            
            print("\n✅ Console monitoring completed!")
            time.sleep(5)
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            self.print_console_logs("ERROR STATE CONSOLE")
            time.sleep(3)
    
    def run_test(self):
        """Run the console debug test"""
        try:
            self.setup_driver()
            self.test_with_console_monitoring()
            
            print("\n🎉 CONSOLE DEBUG TEST COMPLETED!")
            print("Check the console output above for any errors.")
            print("Browser will close in 10 seconds...")
            time.sleep(10)
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
            time.sleep(3)
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = ConsoleDebugTester()
    tester.run_test()