#!/usr/bin/python3

"""
This script reads the information written in boards.json and generate the
disposition (ie the matrix of colors) and the svg (if needed).
"""

from lxml import etree
import json


class BoardGenerator:
    #: XML namespace. Required to use xpath to search the DOM.
    NS = {'ns': 'http://www.w3.org/2000/svg'}

    def __init__(self, description_file='boards.json'):
        self.xid = 0
        self.yid = 0
        self.rectangle_width = 96
        self.rectangle_height = 96
        self.descriptions = self.load_descriptions(description_file)

    def load_descriptions(self, description_file):
        """Read the file containing the information and return a dict with its
        content.
        """
        description = None
        with open(description_file, "r") as f:
            description = json.load(f)
        return description

    def generate_boards(self):
        """Generate all the boards described in self.descriptions."""
        for self.board_name, self.board in self.descriptions.items():
            self.color_disposition = self.generate_color_disposition()
            self.svg = self.load_svg_template()
            self.layer = self.svg.find('ns:g', namespaces=self.NS)
            self.generate_svg_board()

    def generate_color_disposition(self):
        """Create the matrix with the disposition of colors and save it."""
        disposition = []
        for partial_line in self.board['circle_colors']:
            self.append_line_disposition(disposition, partial_line,
                                         self.board['number_arms'] // 2)

        for partial_line in self.board['arm_colors']:
            self.append_line_disposition(disposition, partial_line,
                                         self.board['number_arms'])

        self.save_color_disposition(disposition)
        return disposition

    def append_line_disposition(self, disposition, partial_line,
                                number_time_repeat_partial_line):
        """Repeat the information of the description to fill a line."""
        complete_line = [partial_line] * number_time_repeat_partial_line
        line = ','.join(complete_line)
        disposition.append(line.split(','))

    def save_color_disposition(self, disposition):
        file_name = '{}-colors'.format(self.board_name)
        with open(file_name, 'w') as f:
            for line in disposition:
                line = ','.join(line)
                f.write(line + '\n')

    def load_svg_template(self):
        svg = None
        with open('template.svg', 'r') as f:
            svg = etree.parse(f)
        return svg

    def generate_svg_board(self):
        """Create the svg version of the board."""
        if 'svg' in self.board:
            fill_origin = self.board['svg']['fill_origin'].split(',')
            self.origin_x, self.origin_y = [int(x) for x in fill_origin]
            rotation_center = self.board['svg']['rotation_center'].split(',')
            self.rotation_x, self.rotation_y = [int(x) for x in rotation_center]
            self.draw_board()

    def draw_board(self):
        """Add SVG element to the board."""
        for i in range(self.board['number_arms']):
            self.rotate_board()
            self.draw_lines()
            self.fill_svg()
        self.rotate_board()
        self.paint_svg()
        self.save_svg()

    def rotate_board(self):
        """Rotate the whole board of 45°."""
        for element in self.layer:
            if element.get('transform'):
                transformation = element.get('transform')
                if transformation[9] == ' ':
                    angle = int(transformation[7:9])
                else:
                    angle = int(transformation[7:10])
                angle += 45
            else:
                angle = 45
            element.set('transform', 'rotate({} {} {})'.format(angle, self.rotation_x, self.rotation_y))

    def draw_lines(self):
        """Draw the non-rectangular elements of the board."""
        self.yid = 0
        for line in self.board['svg']['lines']:
            xid_plus = 0
            for element in line:
                svg_element = etree.SubElement(self.layer, element['tag'])
                svg_element.set('d', element['d'])
                svg_element.set('id', '{}-{}'.format(self.xid + xid_plus, self.yid))
                xid_plus += 1
                self.layer.append(svg_element)
            self.yid += 1

    def fill_svg(self):
        """Draw the lines of rectangle of an arm."""
        xid_plus = 0
        element_description = self.board['svg']['fill']
        width, height = int(element_description['width']), int(element_description['height'])
        for i in range(self.board['arms_width']):
            self.yid = len(self.board['svg']['lines'])
            for j in range(self.board['arms_length']):
                element = etree.Element(element_description['tag'])
                element.set('id', '{}-{}'.format(self.xid + xid_plus, self.yid))
                element.set('x', str(i * height + self.origin_x))
                element.set('y', str(j * width + self.origin_y))
                element.set('height', element_description['height'])
                element.set('width', element_description['width'])
                self.yid += 1
                self.layer.append(element)
            xid_plus += 1
        self.xid += self.board['arms_width']

    def paint_svg(self):
        """Add the style to the elements."""
        for y, line in enumerate(self.color_disposition):
            for x, color in enumerate(line):
                squares = self.svg.xpath('.//*[@id="{}-{}"]'.format(x, y), namespaces=self.NS)
                square  = squares[0]
                color = self.color_disposition[y][x]
                svg_color = color.lower()
                fill = '{}-square'
                square.set('class', fill.format(svg_color))

    def save_svg(self):
        """Save the SVG into a file."""
        file_name = '{}.svg'.format(self.board_name)
        with open(file_name, 'w') as f:
            svg_bytes = etree.tostring(self.svg, pretty_print=True)
            f.write(svg_bytes.decode())


if __name__ == '__main__':
    generator = BoardGenerator()
    generator.generate_boards()