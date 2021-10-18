# Read XML and return basic structures ready to be put into database by other methods. 
# goal is to read the XML, not to establish datastructures
#
# rather than read the entire file, have the caller break up pieces or identify and pass
# a parent node, and provide methods to get specific data from those nodes

from tempfile import SpooledTemporaryFile
from typing import List
from defusedxml.ElementTree import parse

NAMESPACE = "{http://www.orienteering.org/datastandard/3.0}"

def _ns(name: str) -> str:
    return NAMESPACE + name

def _nspath(path: List[str]) -> str:
    xpath = str()
    for s in map(_ns, path):
        xpath += s + '/'
    xpath = xpath.rstrip('/')
    return xpath

def _findText(root, xpath):
    try:
        return root.find(xpath).text
    except AttributeError:
        return None

def _findNodes(root, xpath):
    try:
        return root.findall(xpath)
    except AttributeError:
        return None

class ResultListReader:
    def __init__(self, file:SpooledTemporaryFile):
        self.file = file
        with self.file as f:
            tree = parse(f)
            root = tree.getroot()
            if root.tag != _ns('ResultList'):
                raise TypeError(f'{root.tag} is not an ResultList')
            self.root = root
        self.race_name = _findText(self.root, _nspath(["Event", "Name"]))
        self.class_results = _findNodes(self.root, _nspath(["ClassResult"]))        

class ClassResultReader:
    def __init__(self, el):
        if el.tag != _ns('ClassResult'):
            raise TypeError(f'{el.tag} is not a ClassResult')
        self.root = el

        self.class_name = _findText(self.root, _nspath(["Class", "Name"]))
        self.class_name_short = _findText(self.root, _nspath(["Class", "ShortName"]))
        self.course_name = _findText(self.root, _nspath(["Course", "Name"]))
        self.course_id = _findText(self.root, _nspath(["Course", "Id"]))
        self.course_length = _findText(self.root, _nspath(["Course", "Length"]))
        self.course_climb = _findText(self.root, _nspath(["Course", "Climb"]))
        self.course_controls = _findText(self.root, _nspath(["Course", "NumberOfControls"]))
        self.result_nodes = _findNodes(self.root, _nspath(["PersonResult"]))

class PersonResultReader:
    def __init__(self, el):
        if el.tag != _ns('PersonResult'):
            raise TypeError(f'{el.tag} is not a PersonResult')
        self.root = el

        self.first_name = _findText(self.root, _nspath(["Person", "Name", "Given"]))
        self.last_name = _findText(self.root, _nspath(["Person", "Name", "Family"]))
        self.bib = _findText(self.root, _nspath(["Result", "BibNumber"]))
        self.start_time = _findText(self.root, _nspath(["Result", "StartTime"]))
        self.finish_time = _findText(self.root, _nspath(["Result", "FinishTime"]))
        self.time = _findText(self.root, _nspath(["Result", "Time"]))
        self.status = _findText(self.root, _nspath(["Result", "Status"]))
        self.control_card = _findText(self.root, _nspath(["Result", "ControlCard"]))
        self.club_name = _findText(self.root, _nspath(["Organisation", "Name"]))
        self.club_name_short = _findText(self.root, _nspath(["Organisation", "ShortName"]))
