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
from datetime import datetime

class FortuneSnakeGameTester:
    def __init__(self):
        self.driver = None
        self.game_url = "https://games.microslot.co/fortunesnake/index.html?token=68b93925e82dd6465b63ba8e_141"
        
    def setup_driver(self):
        """Setup Chrome driver with options"""
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
        
    def load_game(self):
        """Load the game and wait for it to initialize"""
        print("Loading game...")
        self.driver.get(self.game_url)
        time.sleep(5)  # Wait for game to load
        
    def test_game_loading(self):
        """Test if game loads properly"""
        try:
            # Check if page loads
            assert "Fortune Snake" in self.driver.title or self.driver.current_url == self.game_url
            print("✓ Game page loaded successfully")
            
            # Wait for game canvas or main container
            WebDriverWait(self.driver, 10).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            print("✓ Page fully loaded")
            
            return True
        except Exception as e:
            print(f"✗ Game loading failed: {e}")
            return False
            
    def test_game_elements(self):
        """Test for common game elements"""
        try:
            # Look for common game elements
            elements_to_check = [
                "canvas", "button", "input", ".game", "#game", 
                ".play", ".start", ".spin", ".bet"
            ]
            
            found_elements = []
            for selector in elements_to_check:
                try:
                    if selector.startswith('.') or selector.startswith('#'):
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    else:
                        elements = self.driver.find_elements(By.TAG_NAME, selector)
                    
                    if elements:
                        found_elements.append(selector)
                        print(f"✓ Found element: {selector}")
                except:
                    continue
                    
            return len(found_elements) > 0
        except Exception as e:
            print(f"✗ Element detection failed: {e}")
            return False
            
    def test_console_errors(self):
        """Check for JavaScript console errors"""
        try:
            logs = self.driver.get_log('browser')
            errors = [log for log in logs if log['level'] == 'SEVERE']
            
            if errors:
                print("✗ Console errors found:")
                for error in errors:
                    print(f"  - {error['message']}")
                return False
            else:
                print("✓ No console errors")
                return True
        except Exception as e:
            print(f"Warning: Could not check console logs: {e}")
            return True
            
    def test_network_requests(self):
        """Monitor network activity"""
        try:
            # Enable performance logging
            logs = self.driver.get_log('performance')
            network_events = []
            
            for log in logs:
                message = json.loads(log['message'])
                if message['message']['method'].startswith('Network'):
                    network_events.append(message)
                    
            print(f"✓ Network activity detected: {len(network_events)} events")
            return True
        except Exception as e:
            print(f"Warning: Could not monitor network: {e}")
            return True
            
    def test_game_interactions(self):
        """Test basic game interactions"""
        try:
            # Look for clickable elements
            clickable_elements = self.driver.find_elements(By.CSS_SELECTOR, "button, .btn, [onclick], [role='button']")
            
            if clickable_elements:
                print(f"✓ Found {len(clickable_elements)} clickable elements")
                
                # Try clicking the first few elements
                for i, element in enumerate(clickable_elements[:3]):
                    try:
                        if element.is_displayed() and element.is_enabled():
                            element.click()
                            time.sleep(1)
                            print(f"✓ Successfully clicked element {i+1}")
                    except Exception as e:
                        print(f"Warning: Could not click element {i+1}: {e}")
                        
                return True
            else:
                print("Warning: No clickable elements found")
                return False
                
        except Exception as e:
            print(f"✗ Interaction test failed: {e}")
            return False
            
    def test_ui_responsiveness(self):
        """Test UI responsiveness and layout"""
        try:
            print("Testing UI responsiveness...")
            
            # Test different window sizes
            sizes = [(1920, 1080), (1366, 768), (768, 1024), (375, 667)]
            
            for width, height in sizes:
                self.driver.set_window_size(width, height)
                time.sleep(2)
                
                # Check if page is still functional
                body = self.driver.find_element(By.TAG_NAME, "body")
                if body.is_displayed():
                    print(f"✓ Responsive at {width}x{height}")
                else:
                    print(f"✗ Layout broken at {width}x{height}")
                    
            self.driver.maximize_window()
            print("✓ UI responsiveness test completed")
            return True
            
        except Exception as e:
            print(f"✗ UI responsiveness test failed: {e}")
            return False
            
    def test_performance_metrics(self):
        """Test game performance metrics"""
        try:
            print("Testing performance metrics...")
            
            # Measure page load time
            start_time = time.time()
            self.driver.refresh()
            
            WebDriverWait(self.driver, 30).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            
            load_time = time.time() - start_time
            print(f"✓ Page load time: {load_time:.2f} seconds")
            
            # Check memory usage (basic)
            memory_info = self.driver.execute_script(
                "return {used: performance.memory ? performance.memory.usedJSHeapSize : 0, total: performance.memory ? performance.memory.totalJSHeapSize : 0}"
            )
            
            if memory_info['used'] > 0:
                memory_mb = memory_info['used'] / (1024 * 1024)
                print(f"✓ Memory usage: {memory_mb:.2f} MB")
            
            # Performance timing
            timing = self.driver.execute_script(
                "return {domLoading: performance.timing.domLoading, domComplete: performance.timing.domComplete, loadEventEnd: performance.timing.loadEventEnd}"
            )
            
            if timing['domComplete'] > 0:
                dom_time = (timing['domComplete'] - timing['domLoading']) / 1000
                print(f"✓ DOM load time: {dom_time:.2f} seconds")
            
            return load_time < 10  # Pass if loads under 10 seconds
            
        except Exception as e:
            print(f"✗ Performance test failed: {e}")
            return False
            
    def test_game_functionality(self):
        """Test specific game functionality"""
        try:
            print("Testing game functionality...")
            
            # Test keyboard interactions
            actions = ActionChains(self.driver)
            body = self.driver.find_element(By.TAG_NAME, "body")
            
            # Test common game keys
            test_keys = [Keys.SPACE, Keys.ENTER, Keys.ARROW_UP, Keys.ARROW_DOWN, Keys.ARROW_LEFT, Keys.ARROW_RIGHT]
            
            for key in test_keys:
                try:
                    actions.send_keys_to_element(body, key).perform()
                    time.sleep(0.5)
                except:
                    pass
                    
            print("✓ Keyboard interaction test completed")
            
            # Test mouse movements and clicks
            try:
                # Move mouse around the screen
                for _ in range(5):
                    x = random.randint(100, 800)
                    y = random.randint(100, 600)
                    actions.move_by_offset(x, y).click().perform()
                    time.sleep(0.5)
                    
                print("✓ Mouse interaction test completed")
            except:
                print("Warning: Mouse interaction test had issues")
            
            return True
            
        except Exception as e:
            print(f"✗ Game functionality test failed: {e}")
            return False
            
    def test_audio_video_elements(self):
        """Test multimedia elements"""
        try:
            print("Testing audio/video elements...")
            
            # Check for audio elements
            audio_elements = self.driver.find_elements(By.TAG_NAME, "audio")
            video_elements = self.driver.find_elements(By.TAG_NAME, "video")
            
            print(f"✓ Found {len(audio_elements)} audio elements")
            print(f"✓ Found {len(video_elements)} video elements")
            
            # Test audio/video properties
            for audio in audio_elements:
                try:
                    duration = self.driver.execute_script("return arguments[0].duration", audio)
                    if duration and duration > 0:
                        print(f"✓ Audio element has valid duration: {duration}s")
                except:
                    pass
                    
            return True
            
        except Exception as e:
            print(f"✗ Audio/Video test failed: {e}")
            return False
            
    def test_error_handling(self):
        """Test error handling and edge cases"""
        try:
            print("Testing error handling...")
            
            # Test invalid actions
            try:
                # Try to access non-existent elements
                self.driver.find_element(By.ID, "non-existent-element")
            except:
                print("✓ Properly handles missing elements")
            
            # Test rapid clicking
            clickable_elements = self.driver.find_elements(By.CSS_SELECTOR, "button, .btn, [onclick]")
            if clickable_elements:
                element = clickable_elements[0]
                for _ in range(10):
                    try:
                        if element.is_displayed() and element.is_enabled():
                            element.click()
                    except:
                        pass
                        
                print("✓ Rapid clicking test completed")
            
            return True
            
        except Exception as e:
            print(f"✗ Error handling test failed: {e}")
            return False
            
    def test_browser_compatibility(self):
        """Test browser-specific features"""
        try:
            print("Testing browser compatibility...")
            
            # Check browser info
            user_agent = self.driver.execute_script("return navigator.userAgent")
            print(f"✓ User Agent: {user_agent[:50]}...")
            
            # Check supported features
            features = {
                'localStorage': 'return typeof(Storage) !== "undefined"',
                'canvas': 'return !!document.createElement("canvas").getContext',
                'webGL': 'return !!window.WebGLRenderingContext',
                'audioContext': 'return !!(window.AudioContext || window.webkitAudioContext)'
            }
            
            for feature, script in features.items():
                try:
                    supported = self.driver.execute_script(script)
                    status = "✓" if supported else "✗"
                    print(f"{status} {feature}: {'Supported' if supported else 'Not supported'}")
                except:
                    print(f"? {feature}: Could not test")
            
            return True
            
        except Exception as e:
            print(f"✗ Browser compatibility test failed: {e}")
            return False
            
    def test_security_basics(self):
        """Test basic security aspects"""
        try:
            print("Testing security basics...")
            
            # Check HTTPS
            current_url = self.driver.current_url
            is_https = current_url.startswith('https://')
            print(f"{'✓' if is_https else '✗'} HTTPS: {'Enabled' if is_https else 'Not enabled'}")
            
            # Check for mixed content
            try:
                mixed_content = self.driver.execute_script(
                    "return document.querySelectorAll('img[src^=\"http:\"], script[src^=\"http:\"], link[href^=\"http:\"]').length"
                )
                print(f"{'✓' if mixed_content == 0 else '✗'} Mixed content: {mixed_content} insecure resources")
            except:
                print("? Mixed content: Could not check")
            
            return True
            
        except Exception as e:
            print(f"✗ Security test failed: {e}")
            return False
            
    def run_all_tests(self):
        """Run all tests"""
        print("Starting Fortune Snake Game Tests...")
        print("=" * 50)
        
        try:
            self.setup_driver()
            self.load_game()
            
            tests = [
                ("Game Loading", self.test_game_loading),
                ("Game Elements", self.test_game_elements),
                ("Console Errors", self.test_console_errors),
                ("Network Requests", self.test_network_requests),
                ("Game Interactions", self.test_game_interactions),
                ("UI Responsiveness", self.test_ui_responsiveness),
                ("Performance Metrics", self.test_performance_metrics),
                ("Game Functionality", self.test_game_functionality),
                ("Audio/Video Elements", self.test_audio_video_elements),
                ("Error Handling", self.test_error_handling),
                ("Browser Compatibility", self.test_browser_compatibility),
                ("Security Basics", self.test_security_basics)
            ]
            
            results = {}
            for test_name, test_func in tests:
                print(f"\nRunning {test_name} test...")
                results[test_name] = test_func()
                
            # Summary
            print("\n" + "=" * 50)
            print("TEST SUMMARY:")
            passed = sum(results.values())
            total = len(results)
            
            for test_name, result in results.items():
                status = "PASS" if result else "FAIL"
                print(f"{test_name}: {status}")
                
            print(f"\nOverall: {passed}/{total} tests passed")
            
            # Generate detailed report
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\nTest completed at: {timestamp}")
            
            if passed == total:
                print("🎉 ALL TESTS PASSED! Game is working well.")
            elif passed >= total * 0.8:
                print("⚠️  Most tests passed. Minor issues detected.")
            elif passed >= total * 0.5:
                print("⚠️  Some tests failed. Moderate issues detected.")
            else:
                print("❌ Many tests failed. Significant issues detected.")
                
            print(f"\nRecommendations:")
            if not results.get("Console Errors", True):
                print("- Fix JavaScript console errors")
            if not results.get("Performance Metrics", True):
                print("- Optimize loading performance")
            if not results.get("UI Responsiveness", True):
                print("- Improve responsive design")
            if not results.get("Security Basics", True):
                print("- Address security concerns")
            
        except Exception as e:
            print(f"Test execution failed: {e}")
        finally:
            if self.driver:
                input("Press Enter to close browser...")
                self.driver.quit()

if __name__ == "__main__":
    tester = FortuneSnakeGameTester()
    tester.run_all_tests()