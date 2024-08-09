from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

import time
import os
from bs4 import BeautifulSoup

chrome_options = Options()
chrome_options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=chrome_options)
driver.get("https://www.depop.com/login")

# accept cookies
acceptCookie = WebDriverWait(driver, 5).until(
    EC.element_to_be_clickable((By.XPATH, f"//span[text()='Accept']/.."))
)
acceptCookie.click()

# enter username
usernameEntry = WebDriverWait(driver, 5).until(
    EC.element_to_be_clickable((By.ID, "username__input"))
)
usernameEntry.send_keys("r_l_z")

# enter password
password = os.getenv("depopPassword")
passwordEntry = WebDriverWait(driver, 5).until(
    EC.element_to_be_clickable((By.ID, "password__input"))
)
passwordEntry.send_keys(password)

# submit login
logSubmit = WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login__cta"]'))
)
logSubmit.click()

time.sleep(1.5)
# profile dropdown
user = WebDriverWait(driver, 5).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="userNavItem-wrapper"]'))
)
user.click()

time.sleep(0.5)
# enter profile
profile = WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="actionMenu__nav-profileLinkButton"]'))
)
profile.click()

############################################

time.sleep(0.5)
# get follower count
followerCount = int(WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="followers__count"]'))
).text)

time.sleep(0.5)
# access followers
followerTab = WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[aria-label="followers"]'))
)
followerTab.click()

time.sleep(2)


popup = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="user__items"]')))
previous_height = driver.execute_script("return arguments[0].scrollHeight;", popup)

followerSet = set()
count = 0

while True:
    # Scroll to the bottom of the pop-up
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", popup)

    # Wait for new content to load (adjust the sleep time as needed)
    time.sleep(1)

    # Get the new height of the scrollable area
    new_height = driver.execute_script("return arguments[0].scrollHeight;", popup)

    # Check if the scroll height has increased; if not, we have reached the bottom
    if new_height == previous_height:
        break

    previous_height = new_height

    # follower extraction
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    followers = soup.find_all("div", {"data-testid": "extendedLinkAnchor"})
    for follower in followers:
        href = follower.get('href')
        username = href.split("/")[-2]
        followerSet.add(username)

print("completed: ",len(followerSet))

time.sleep(0.5)
# access following
followingTab = WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="follows-tabs_following-label"]'))
)
followingTab.click()

followingSet = set()

while True:
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", popup)
    time.sleep(1)
    new_height = driver.execute_script("return arguments[0].scrollHeight;", popup)
    if new_height == previous_height:
        break
    previous_height = new_height

    # Get the page source and parse with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    following = soup.find_all("div", {"data-testid": "user__item"})

    for followingUser in following:
        print("here")

        # Extract text from BeautifulSoup to match in Selenium XPath
        text_content = followingUser.get_text().strip()

        # Find the element using Selenium with a proper XPath
        try:
            element = driver.find_element(By.XPATH,
                                          f"//div[@data-testid='user__item'][contains(., \"{text_content}\")]")
        except Exception as e:
            print("Error finding unfollow button")
            continue

        # Get the element's outer HTML using Selenium
        inner_html = element.get_attribute('outerHTML')

        # Parse the element with BeautifulSoup
        user_soup = BeautifulSoup(inner_html, 'html.parser')

        # Extract username
        name_div = user_soup.find("div", {"data-testid": "extendedLinkAnchor"})
        if name_div:
            href = name_div.get('href')
            username = href.split("/")[-2]

            # Check if username is in the set
            if username not in followerSet:
                # Use Selenium to find and click the button
                try:
                    unfollow_button = element.find_element(By.XPATH, ".//button[@data-testid='followingButton']")
                    if unfollow_button:
                        unfollow_button.click()
                        print(f"Clicked unfollow button for {username}")
                    else:
                        print(f"Unfollow button not found for {username}")
                except Exception as e:
                    print(f"Error clicking unfollow button: {e}")
            else:
                print(f"Username {username} already in set")
        else:
            print(f"Name div not found in {inner_html}")

print("purged")