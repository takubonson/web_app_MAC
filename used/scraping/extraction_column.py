from os import write
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import pandas as pd
import csv
import time

STEP = 1
# STEP = 30

chrome_options = Options()
chrome_options.add_argument("--window-size=1000,500")
PATH = "./chromedriver"
driver = webdriver.Chrome(PATH, options=chrome_options)
f = open("output1.csv", "w")
writer = csv.writer(f)
timeline = []
Market_Cap_list = []

driver.get("https://companiesmarketcap.com/harmonic-drive-systems/marketcap/")
search = driver.find_element(By.ID, "search-input")
search.clear()  # clear the search box
search.send_keys("6146.T")
action = ActionChains(driver)
try:
    result = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '//*[@id="typeahead-search-results"]/a/div[2]/div[1]'))
    )
    result.click()

    chart = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'marketcapchart'))
    )
    loc = chart.location
    size = chart.size
    action.move_to_element_with_offset(chart, 30, 200).perform()

    current = ""
    for i in range(1000):
        print(i)
        while driver.find_element(By.ID, "cursorText").text == current:
            action = ActionChains(driver)
            action.move_by_offset(STEP, 0).perform()
        text1 = driver.find_element(By.ID, "cursorText").text
        text2 = driver.find_element(By.ID, "cursorText2").text
        timeline.append(text2)
        Market_Cap_list.append(text1)
        current = text1
        if text1 == "":
            break
finally:
    print(timeline)
    print(Market_Cap_list)
    print(len(timeline))
    writer.writerow(timeline)
    writer.writerow(Market_Cap_list)
