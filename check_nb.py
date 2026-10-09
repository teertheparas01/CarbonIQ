import json

nb = json.load(open(r'D:\AIML\Mini Project\CarbonIQ_ML_Clean.ipynb'))
print(f'Total cells: {len(nb["cells"])}')
for i, cell in enumerate(nb['cells']):
    if cell['cell_type'] == 'markdown':
        first_line = cell['source'][0] if cell['source'] else ''
        print(f'  Cell {i}: {first_line[:80]}')
    else:
        first_line = cell['source'][0] if cell['source'] else ''
        print(f'  Cell {i} (code): {first_line[:80]}')