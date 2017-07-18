#!/usr/bin/env python3

import json
import sys
import toml
from argparse import ArgumentParser
from os.path import (
    exists,
    isfile,
)
from glob import glob


CONF_FILE_TEMPLATE = 'config/config.{type}.toml'
APP_CONF_FILE = 'app/services/configuration.js'


def main(type, version):
    config_file = CONF_FILE_TEMPLATE.format(type=type)

    if type == 'dev' and not exists(config_file):
        docker_config_file = CONF_FILE_TEMPLATE.format(type='docker')
        print(f'Note: {config_file} not found, using {docker_config_file}')
        config_file = docker_config_file

    if not exists(config_file):
        print(config_file, "doesn't exit. Exiting", file=sys.stderr)
        sys.exit(1)

    config = toml.load(config_file)
    config['api']['path'] = config['api']['path'].format(version=version)
    config['version'] = version
    config['images'] = {
        'game': [file for file in glob('assets/game/**/*', recursive=True) if isfile(file)],
    }
    config = json.dumps(config, sort_keys=True, indent=4)

    with open(APP_CONF_FILE, 'w') as app_config:
        app_config.write('export default ' + config + ';')


if __name__ == '__main__':
    parser = ArgumentParser(description='Build the configuration file for the frontend')
    parser.add_argument(
        '--type',
        help='The type of configuration to build',
        dest='type',
        required=True,
        choices=['dev', 'prod', 'staging', 'testing'],
    )
    parser.add_argument(
        '--version',
        help='The version of the configuration to build',
        required=True,
    )
    args = parser.parse_args()
    main(args.type, args.version)
