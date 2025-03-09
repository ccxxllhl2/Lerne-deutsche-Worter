import numpy as np
import pandas as pd

def trans(file_name):
    germ_col = []
    chn_col = []
    
    # 读取 example.txt 文件内容
    with open('example.txt', encoding='utf-8') as f:
        ori = f.read()
    
    # 按行拆分，并去除首尾空白字符，同时去掉空行
    ori_list = [o.strip() for o in ori.split('\n') if o.strip()]
    
    # 如果行数不是偶数，返回错误
    if len(ori_list) % 2 == 1:
        return 'error'
    
    # 按照奇偶行分别存入德语和中文列表
    for i in range(0, len(ori_list), 2):
        germ_col.append(ori_list[i])
        chn_col.append(ori_list[i+1])
        print(ori_list[i] + ',' + ori_list[i+1])
    
    # 使用 Pandas 创建 DataFrame
    df = pd.DataFrame(zip(germ_col, chn_col))
    
    # 将 DataFrame 导出为 CSV 文件（不包含表头）
    df.to_csv(file_name, index=False, header=False)
    return 'OK'
    
print(trans("A1_O1.csv"))