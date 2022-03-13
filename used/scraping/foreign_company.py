codelist = ['TM', 'KYCCF', 'SONY', 'RCRRF', 'NPPXF', 'TOELF', 'SFTBF', 'MUFG', 'SHECF', 'NNDNF', 'DKILY', 'KDDIF', 'FRCOF', 'DNZOF', 'HYB.F', 'HTHIF', 'NTDOF', '4519.T', 'OLL.F', 'MRAAF', 'HMC', '4689.T', 'SMFG', 'ITOCF', 'SMECF', 'DSKYF', 'TAK', 'FANUF', 'SVNDF', '8031.T', 'MH6.F', 'JAPAF', 'FJTSY', 'MFG', '4543.T', '7182.T', '5108.T', '4901.T', '9613.T', '6178.T', 'ALPMF', '7733.T', 'MIELF', '9022.T', '6326.T', '6869.T', '4612.T', '7309.T', '4307.T', 'KAO.F', '6752.T', '8113.T', '6201.T', '6723.T', '6920.T', 'CAJ', '4911.T', 'IX', '9020.T', '6301.T', '6971.T', '8750.T', '8267.T', '4507.T', '6645.T', '4578.T', '7269.T', '1925.T', '7201.T', '9843.T', '8053.T', '3659.T', '7832.T', '6502.T', '6857.T', '4523.T', '8725.T', '4684.T', '2802.T', '8002.T', '4755.T', '4151.T', '6762.T', '8015.T', '2801.T', '8630.T', '9735.T', '5401.T', '9143.T', '8421.T', '7270.T', '1928.T', '2503.T', 'NMR', '3407.T', '6701.T', '6506.T', '8309.T', '1605.T', '5020.T', '4528.T', '9101.T', '6586.T', '6479.T', '4716.T', '2587.T', '8697.T', '6988.T', '5201.T', '9021.T', '6383.T', '4188.T', '6146.T', '5802.T', '8951.T', '7259.T', '3769.T', '3064.T', '9202.T', '4324.T', '7202.T', '3402.T', '6965.T', '7532.T', '4385.T', '8308.T', '6963.T', '3092.T', '7272.T', '7951.T', '4751.T', '4768.T', '2269.T', '8601.T', '3283.T', '4062.T', '9201.T', '9005.T', '4021.T', '9503.T', '4704.T', '5332.T', '9104.T', '2267.T', '8952.T', '5486.T', '4739.T', '7011.T', '9502.T', '3038.T', '1878.T', '5019.T', '4005.T', '9531.T', '4204.T', '3281.T', '3626.T', '2897.T', '3003.T', '9435.T', '9042.T', '3141.T', '4922.T', '6753.T', '9007.T', '8795.T', '9532.T', '3462.T', '3291.T', '7912.T', '9684.T', '7181.T', '6305.T', '4967.T', '9719.T', '3349.T', '7747.T', '8439.T', '4613.T', '2702.T', '1812.T', '9107.T', '1802.T', '9041.T', '7911.T', '9697.T', '9062.T', '3391.T', '7261.T', '2651.T', '4536.T', '4516.T', '9001.T', '4506.T', '8572.T', 'CHBAY', '2002.T', '2875.T', '7564.T', '9706.T', '2331.T', '4912.T', 'NINOY', '6324.T', '4581.T', '9506.T', 'CSIOY', '4587.T', '9048.T', '9533.T', '3292.T', '5105.T', '7956.T', '5301.T', '1860.T', '3694.T', '3817.T', '5982.T', '1301.T']

target_code = []
for code in codelist:
    if code[-2:] != ".T":
        target_code.append(code)
#print(target_code)
#print(len(target_code))

foreign_to_japan = {}
foreign_to_japan['TM'] = '7203.T'
foreign_to_japan['KYCCF'] = '6861.T'
foreign_to_japan['SONY'] = '6758.T'
foreign_to_japan['RCRRF'] = '6098.T'
foreign_to_japan['NPPXF'] = '9432.T'
foreign_to_japan['TOELF'] = '8035.T'
foreign_to_japan['SFTBF'] = '9434.T'
foreign_to_japan['MUFG'] = '8306.T'
foreign_to_japan['SHECF'] = '4063.T'
foreign_to_japan['NNDNF'] = '6594.T'
foreign_to_japan['DKILY'] = '6367.T'
foreign_to_japan['KDDIF'] = '9433.T'
foreign_to_japan['FRCOF'] = '9983.T'
foreign_to_japan['DNZOF'] = '6902.T'
foreign_to_japan['HYB.F'] = '7741.T'
foreign_to_japan['HTHIF'] = '6501.T'
foreign_to_japan['NTDOF'] = '7974.T'
foreign_to_japan['OLL.F'] = '4661.T'
foreign_to_japan['MRAAF'] = '6981.T'
foreign_to_japan['HMC'] = '7267.T'
foreign_to_japan['SMFG'] = '8316.T'
foreign_to_japan['ITOCF'] = '8001.T'
foreign_to_japan['SMECF'] = '6273.T'
foreign_to_japan['DSKYF'] = '4568.T'
foreign_to_japan['TAK'] = '4502.T'
foreign_to_japan['FANUF'] = '6954.T'
foreign_to_japan['SVNDF'] = '3382.T'
foreign_to_japan['MH6.F'] = '8766.T'
foreign_to_japan['JAPAF'] = '2914.T'
foreign_to_japan['FJTSY'] = '6702.T'
foreign_to_japan['MFG'] = '8411.T'
foreign_to_japan['ALPMF'] = '4503.T'
foreign_to_japan['MIELF'] = '6503.T'
foreign_to_japan['KAO.F'] = '4452.T'
foreign_to_japan['CAJ'] = '7751.T'
foreign_to_japan['IX'] = '8591.T'
foreign_to_japan['NMR'] = '8604.T'
foreign_to_japan['CHBAY'] = '8331.T'
foreign_to_japan['NINOY'] = '7731.T'
foreign_to_japan['CSIOY'] = '6952.T'

new_code_list = []
for code in codelist:
    if code in foreign_to_japan:
        new_code_list.append(foreign_to_japan[code])
    else:
        new_code_list.append(code)
print(new_code_list)

f = open("japanese_company_list.txt",mode = "w")
for new_code in new_code_list:
    f.write(new_code + '\n')

#print(len(new_code_list))
""" for code in new_code_list:
    if code[-2:] != '.T':
        print(code) """
        