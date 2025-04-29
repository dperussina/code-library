import unittest
from pathlib import Path
from file_handling import read_text_file, write_text_file

class TestFileHandling(unittest.TestCase):
    def setUp(self):
        self.test_file = Path("test_file.txt")
        self.test_data = ["Line 1", "Line 2", "Line 3"]

    def tearDown(self):
        if self.test_file.exists():
            self.test_file.unlink()

    def test_write_and_read_file(self):
        write_text_file(self.test_file, self.test_data, overwrite=True)
        read_data = read_text_file(self.test_file)
        self.assertEqual(self.test_data, read_data)

if __name__ == "__main__":
    unittest.main()