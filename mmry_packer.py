# DNA-HD: DNA high density storage
# Certainly! Below we will develop a beta version of a DNA-inspired compression system. This system will simulate the process of encoding binary data into nucleotide sequences and will include functionalities for compression, extraction, and decompression of files.

# Step-by-Step Implementation

# Data Encoding: Convert binary data into nucleotide sequences.
# Compression Algorithm: Use Huffman coding for compression.
# DNA Synthesis: Simulate the synthesis of nucleotide sequences.
# Storage and Retrieval: Simulate storing and retrieving data.
# Extraction and Decompression: Extract specific parts without decompressing the entire file.
# Step 1: Data Encoding and Huffman Compression

# Define Node Class for Huffman Tree

# Python
import heapq
from collections import defaultdict, Counter

class Node:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

## # # # # # # # # # # # # # # # # # # # # # # # #  
# Build Huffman Tree and Generate Codes
## # # # # # # # # # # # # # # # # # # # # # # # #  

# Python
def build_huffman_tree(frequency):
    heap = [Node(char, freq) for char, freq in frequency.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        node1 = heapq.heappop(heap)
        node2 = heapq.heappop(heap)
        merged = Node(None, node1.freq + node2.freq)
        merged.left = node1
        merged.right = node2
        heapq.heappush(heap, merged)

    return heap[0]

def generate_huffman_codes(node, prefix="", codebook={}):
    if node is not None:
        if node.char is not None:
            codebook[node.char] = prefix
        generate_huffman_codes(node.left, prefix + "0", codebook)
        generate_huffman_codes(node.right, prefix + "1", codebook)
    return codebook
    
# Public code references from 3 repositories

## # # # # # # # # # # # # # # # # # # # # # # # #  
# Data Encoding to DNA Sequence
## # # # # # # # # # # # # # # # # # # # # # # # #  

# Python
def binary_to_dna(binary_data):
    mapping = {
        "00": "A",
        "01": "T",
        "10": "C",
        "11": "G"
    }
    
    dna_sequence = ""
    for i in range(0, len(binary_data), 2):
        binary_pair = binary_data[i:i+2]
        dna_sequence += mapping[binary_pair]
    
    return dna_sequence

def text_to_binary(text):
    return ''.join(format(ord(char), '08b') for char in text)

def binary_to_text(binary_data):
    chars = [binary_data[i:i+8] for i in range(0, len(binary_data), 8)]
    return ''.join(chr(int(char, 2)) for char in chars)
# Public code references from 3 repositories

## # # # # # # # # # # # # # # # # # # # # # # # #  
# Step 2: Compression and Decompression Functions
# # # # # # # # # # # # # # # # ## # # # # # # # #  

# Compress File
# Python
def compress_file(input_file, output_file):
    with open(input_file, 'r') as f:
        text = f.read()

    frequency = Counter(text)
    huffman_tree = build_huffman_tree(frequency)
    huffman_codes = generate_huffman_codes(huffman_tree)

    compressed_text = ''.join(huffman_codes[char] for char in text)
    dna_sequence = binary_to_dna(compressed_text)

    with open(output_file, 'wb') as f:
        f.write(f"{str(frequency)}\n".encode())
        f.write(dna_sequence.encode())

    print(f"File '{input_file}' has been compressed to '{output_file}'")

# ## # # # # # # # # # # # # # # # # # # # # # # # #   
# Decompress File
### # # # # # # # # # # # # # # # # # # # # # # # #   

# Python
def decompress_file(input_file, output_file):
    with open(input_file, 'rb') as f:
        lines = f.readlines()

    frequency = eval(lines[0].decode())
    dna_sequence = lines[1].decode()

    huffman_tree = build_huffman_tree(frequency)
    dna_to_binary_mapping = {v: k for k, v in {
        "00": "A",
        "01": "T",
        "10": "C",
        "11": "G"
    }.items()}
    
    binary_data = ''.join(dna_to_binary_mapping[nuc] for nuc in dna_sequence)
    
    decoded_text = []
    node = huffman_tree
    for bit in binary_data:
        if bit == '0':
            node = node.left
        else:
            node = node.right

        if node.char is not None:
            decoded_text.append(node.char)
            node = huffman_tree

    with open(output_file, 'w') as f:
        f.write(''.join(decoded_text))

    print(f"File '{input_file}' has been decompressed to '{output_file}'")
 
 # # # # # # # # # # # # # # # # # # # # # # # # # # # # #    
# Step 3: Extracting Specific Parts Without Full Decompression
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

# Extract Part of the Compressed File
# Python
def extract_partial(input_file, start_index, end_index):
    with open(input_file, 'rb') as f:
        lines = f.readlines()

    frequency = eval(lines[0].decode())
    dna_sequence = lines[1].decode()

    partial_dna_sequence = dna_sequence[start_index:end_index]
    
    huffman_tree = build_huffman_tree(frequency)
    dna_to_binary_mapping = {v: k for k, v in {
        "00": "A",
        "01": "T",
        "10": "C",
        "11": "G"
    }.items()}

    partial_binary_data = ''.join(dna_to_binary_mapping[nuc] for nuc in partial_dna_sequence)

    decoded_text = []
    node = huffman_tree
    for bit in partial_binary_data:
        if bit == '0':
            node = node.left
        else:
            node = node.right

        if node.char is not None:
            decoded_text.append(node.char)
            node = huffman_tree

    return ''.join(decoded_text)

## # # # # # # # # # # # # # # # # # # # # # # # #  
# Example usage
## # # # # # # # # # # # # # # # # # # # # # # # #  

compress_file('example.txt', 'example_compressed.txt')
decompressed_text = extract_partial('example_compressed.txt', 0, 10)
print(f"Extracted text: {decompressed_text}")
decompress_file('example_compressed.txt', 'example_decompressed.txt')

# # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Explanation
# # # # # # # # # # # # # # # # # # # # # # # # # # # # 

# Node Class: Represents a node in the Huffman tree.
# build_huffman_tree: Constructs the Huffman tree based on character frequencies.
# generate_huffman_codes: Generates Huffman codes by traversing the Huffman tree.
# binary_to_dna: Converts binary data to DNA sequence using a predefined mapping.
# compress_file: Compresses and encodes the input file into DNA sequence.
# decompress_file: Decodes and decompresses the DNA sequence back to its original content.
# extract_partial: Extracts a specific part of the compressed file without decompressing the entire file.
# This implementation provides a basic framework for DNA-inspired compression and extraction. For real-world applications, more advanced techniques and error handling would be required.

EOF
