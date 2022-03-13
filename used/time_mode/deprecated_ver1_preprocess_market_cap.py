import pandas as pd
import glob
import csv
import json


def merge_and_preprocess_csv(data_directory):
    targets = glob.glob(data_directory)
    li = []
    for filename in targets:
        df = pd.read_csv(filename, index_col=None, header=0,
                         parse_dates=True, infer_datetime_format=True)
        li.append(df)
    frame = li[0]
    for i in range(1, len(li)):
        frame = pd.merge(frame, li[i], on="timeline", how="outer").fillna("0")
    frame["timeline"] = pd.to_datetime(frame["timeline"]).dt.to_period('M')
    sorted_frame = frame.sort_values(
        by="timeline")

    sorted_frame.to_csv("preprocessed_merged.csv", index=False)

    df = pd.read_csv("preprocessed_merged.csv")
    columns = df.columns.values[1:]
    for column in columns:
        previous = "0"
        for i in range(len(df[column])):
            if (df[column][i] == "0"):
                df[column][i] = previous
            previous = df[column][i]

    df = df.rename(columns={"timeline": "company_name"}).T
    df.to_csv("preprocessed_merged.csv", index=True, header=False)


def csv2json(csvFilePath, jsonFilePath):

    # create a dictionary
    data = []

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        for rows in csvReader:
            data.append(rows)

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


merge_and_preprocess_csv("./data_test/*")
csv2json("preprocessed_merged.csv", "finished.json")
