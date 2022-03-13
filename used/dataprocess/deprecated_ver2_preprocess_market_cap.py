import pandas as pd
import glob
import json


def operate_directory(data_directory, jsonFilePath):
    targets = glob.glob(data_directory)
    li = []
    to_dump = []
    for filename in targets:
        df = pd.read_csv(filename, index_col=None, header=0,
                         parse_dates=True, infer_datetime_format=True)
        li.append(df)
    for frame in li:
        dict = {}
        value_list = []
        previous_value = "0"
        dict["company_name"] = frame.columns[-1]
        for i in range(len(frame)):
            date = frame.iloc[i, 0]
            value = frame.iloc[i, 1]
            if (value == "0"):
                value = previous_value
            previous_value = value
            value = operate_number(value)
            value_list.append([date, value])
        dict["value"] = value_list
        to_dump.append(dict)

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(to_dump, indent=4, ensure_ascii=False))


def operate_number(num_string):
    # print(num_string)
    if (num_string == "0"):
        return num_string
    else:
        if num_string[-1] == "B":
            output = num_string.replace("B", "").replace("$", "")
        elif num_string[-1] == "M":
            print("hoge")
            output = str(float(num_string.replace("B", "").replace("$", ""))/1000)
            print(num_string,output, ensure_ascii=False)
        else:
            print("error")

    # output = ""
    # i = 1
    # while num_string[i] != "B":
    #     output += num_string[i]
    #     i += 1
    #     if (i == 10):
    #         break
        return output


operate_directory("./marketcap_processed/*", "finished.json")
