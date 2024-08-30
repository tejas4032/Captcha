from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

# Set up Chrome options for headless mode (optional)
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Uncomment this line if you want to run in headless mode

# Specify the path to your ChromeDriver
chrome_driver_path = 'C:/Users/Harsh/Downloads/chromedriver-win64/chromedriver-win64/chromedriver.exe'  # Replace with the actual path to your chromedriver.exe
service = Service(chrome_driver_path)

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    # Open the local web page hosted on localhost:3000
    driver.get("http://localhost:3000")  # Replace with the correct URL
    
    # Simulate typical bot behavior by quickly filling out the form
    enrolment_id_input = driver.find_element(By.ID, "enrolmentId")
    enrolment_date_input = driver.find_element(By.ID, "enrolmentDate")
    enrolment_time_input = driver.find_element(By.ID, "enrolmentTime")
    
    # Immediately fill in the form without any delay, which is often a bot-like behavior
    enrolment_id_input.send_keys("12345678901234")
    
    # Clear any existing value and input the date in the expected format
    enrolment_date_input.clear()
    enrolment_date_input.send_keys("08-22-2024")  # Ensure the format matches what is expected (YYYY-MM-DD)
    
    # Input time
    enrolment_time_input.clear()
    enrolment_time_input.send_keys("10:30:PM")
    
    # Immediately submit the form
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()

    # Wait for a short period to simulate processing
    time.sleep(100)

finally:
    # Close the browser
    driver.quit()
