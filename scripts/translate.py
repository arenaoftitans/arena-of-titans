import csv
import io
import json
from urllib.request import urlopen


CALC_CSV_EXPORT_ADDRESS = 'https://docs.google.com/spreadsheets/d/1YWBqm7OUVshYZhVrKiCnbuYBUcPlLtB0dR7rqpWbevU/export?format=csv&gid={sheet_number}'
SAVE_TRANSLATIONS_FILE = 'locale/{lang}/translations.js'
PAGE_TO_SHEET_NB = {
    'actions': 985921915,
    'cards': 2131671933,
    'game': 1241014372,
    'game.create': 158417819,
    'game.play': 1072267331,
    'game.visit': 1365540142,
    'global': 575822508,
    'heroes': 1362194548,
    'site': 0,
    'trumps': 195514419,
}


def main():
    translations_per_pages = fetch_translations()
    translations_per_langs = create_translation_all_languages(translations_per_pages)
    save(translations_per_langs)


def fetch_translations():
    translations = {}
    for page_name, sheet_number in PAGE_TO_SHEET_NB.items():
        address = CALC_CSV_EXPORT_ADDRESS.format(sheet_number=sheet_number)
        translations[page_name] = urlopen(address).read().decode('utf-8')

    return translations


def create_translation_all_languages(translations_per_pages):
    translations_per_langs = {}
    for sheet_name, translations in translations_per_pages.items():
        csv_reader = csv.DictReader(io.StringIO(translations))
        for row in csv_reader:
            page_uris = row['msgid'].split('.')
            for lang in row:
                if lang == 'msgid':
                    continue
                roots = sheet_name.split('.')
                part_translations = translations_per_langs.setdefault(lang, {})
                for root in roots:
                    part_translations = part_translations.setdefault(root, {})
                uri_translations = None
                for page_uri in page_uris[:-1]:
                    uri_translations = part_translations.setdefault(page_uri, {})

                if uri_translations is None:
                    uri_translations = part_translations
                msg_code = page_uris[-1]
                uri_translations[msg_code] = row[lang]


    return translations_per_langs


def save(translations_per_langs):
    for lang, translations in translations_per_langs.items():
        with open(SAVE_TRANSLATIONS_FILE.format(lang=lang), 'w') as translation_file:
            translations = json.dumps(translations, sort_keys=True, indent=4)
            translation_file.write('export default ' + translations + ';')


if __name__ == '__main__':
    main()
