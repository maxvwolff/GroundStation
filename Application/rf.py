import ctypes
from ctypes.util import find_library

file_name = find_library('rtlsdr')
dll = ctypes.cdll.LoadLibrary(file_name)

print(dll)
print(dll.rtlsdr_get_device_count)