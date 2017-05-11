#!/usr/bin/env python3

import json
from urllib.request import urlopen


CALC_CSV_EXPORT_ADDRESS = 'https://docs.google.com/spreadsheets/d/1Ees-A_yNQTfba7wH-flbrJunLMiTcTOUsbHqUTyOKm8/export?format=csv'
SAVE_FILE = 'app/game/create/default-names.js';


def main():
    names = (urlopen(CALC_CSV_EXPORT_ADDRESS).read()
             .decode('utf-8')
             .split('\n'))
    names = [name.strip() for name in names]

    with open(SAVE_FILE, 'w') as names_file:
        names = json.dumps(names, sort_keys=True, indent=4)
        names_file.write('export default ' + names + ';\n')


if __name__ == '__main__':
    main()
