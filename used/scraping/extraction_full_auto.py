from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import pandas as pd
import csv

STEP = 1
# STEP = 30

code_list = ['ITOCF', 'DSKYF', 'KAO.F', '8267.T',
             '9101.T', '5802.T', '9531.T', '4922.T']

print(len(code_list))


def operate_date(text):
    i = 0
    while True:
        if text[i] == " ":
            i += 1
            break
        i += 1
    return text[i:]


chrome_options = Options()
chrome_options.add_argument("--window-size=1000,500")
PATH = "./chromedriver"

# result = open("output.csv", "w")
# result_writer = csv.writer(resu)
# result_writer.writerow(["timeline", company_name])

for code in code_list:
    driver = webdriver.Chrome(PATH, options=chrome_options)
    driver.get("https://companiesmarketcap.com/harmonic-drive-systems/marketcap/")
    search = driver.find_element(By.ID, "search-input")
    search.clear()  # clear the search box
    search.send_keys(code)
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
        company_name = driver.find_element(By.CLASS_NAME, "company-name").text
        f = open(company_name+".csv", "w")
        writer = csv.writer(f)
        writer.writerow(["timeline", company_name])
        loc = chart.location
        size = chart.size
        action.move_to_element_with_offset(chart, 30, 200).perform()

        current = ""
        for i in range(1000):
            print(i)
            while driver.find_element(By.ID, "cursorText").text == current:
                action.move_by_offset(STEP, 0).perform()
            text1 = driver.find_element(By.ID, "cursorText").text
            text2 = driver.find_element(By.ID, "cursorText2").text
            text2 = operate_date(text2)
            writer.writerow([text2, text1])
            current = text1
            if text1 == "":
                break
    except:
        driver.quit()
