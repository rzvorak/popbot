from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup 
import time
import sys


def run_script(username, password, refreshCount, refreshSpeed):
    refreshCount = int(refreshCount)
    refreshSpeed = int(refreshSpeed)

    driver = webdriver.Chrome()
    driver.get("https://www.depop.com/login")

    print("accepting cookies...")
    acceptCookie = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, f"//span[text()='Accept']/.."))
    )
    acceptCookie.click()

    print("entering username...")
    usernameEntry = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, "username__input"))
    )
    usernameEntry.send_keys(username)

    print("entering password...")
    passwordEntry = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, "password__input"))
    )
    passwordEntry.send_keys(password)

    print("logging in...")
    logSubmit = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login__cta"]'))
    )
    logSubmit.click()

    time.sleep(2)
    print("entering profile dropdown...")
    user = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="userNavItem-wrapper"]'))
    )
    user.click()

    time.sleep(2)
    print("entering profile...")
    # enter profile
    profile = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="actionMenu__nav-profileLinkButton"]'))
    )
    profile.click()

    time.sleep(2)
    print("preparing items...")
    moveSold = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="action__moveSold"]'))
    )
    moveSold.click()

    posts = set()
    postNum = 0
    reachedEnd = False
    time.sleep(0.5)

    print("scrolling...")
    for i in range(4):
        time.sleep(0.25)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    while True:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        new_posts = soup.find_all("a", {"data-testid": "product__item"})

        for post in new_posts:
            post_id = post.get('href')
            if post_id and post_id not in posts:
                try:
                    print(f"locating href: {post_id}")

                    element = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, f'[href="{post_id}"]'))
                    )
                    inner_html = element.get_attribute('outerHTML')
                    sold_soup = BeautifulSoup(inner_html, 'html.parser')
                except:
                    print("error fetching inner HTML")
                    continue

                sold_div = sold_soup.find("div", {"data-testid": "product__sold"})
                if not sold_div:
                    posts.add(post_id)
                else:
                    reachedEnd = True
                    break

        print("List is", len(posts), "items long...")
        if reachedEnd:
            break

    if refreshCount != -1:
        print("Refreshing", refreshCount, "posts..")
    else:
        print("Refreshing all posts...")

    for post in posts:
        time.sleep(refreshSpeed)
        if refreshCount != -1 and postNum >= refreshCount:
            break
        try:
            product_page = post.split("/")[-2]
            edit_page = "https://www.depop.com/products/edit/" + product_page + "/"
            time.sleep(1)
            driver.get(edit_page)
            time.sleep(1)
            save_changes_button = driver.find_element(By.XPATH, "//button[@data-testid='editProductFormButtons__save']")
            save_changes_button.click()
        except:
            print("error refreshing post")
        postNum += 1
        print("posts refreshed: " + str(postNum))

    print("refresh complete")

if __name__ == '__main__':
    username = sys.argv[1]
    password = sys.argv[2]
    refreshCount = sys.argv[3]
    refreshSpeed = sys.argv[4]
    run_script(username, password, refreshCount, refreshSpeed)