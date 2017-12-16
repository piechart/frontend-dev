import sys, os, re

outer_filename = "output.html"

if len(sys.argv) == 1 or len(sys.argv) == 3:
    print("Usage: task1.py file.html link_to_find link_to_replace_with blacklist.txt")
    sys.exit(1)

# Retrive filepath
path = sys.argv[1]

# Check file satisfies all requirements
if not os.path.exists(path):
    print("File not found")
    sys.exit(1)

if not (path.endswith('.html') or path.endswith('.css')):
    print("Only html/css files acceptable")
    sys.exit(1)

# Read file
with open(path) as f:
    data = f.read()
    f.close()

# Read other args if exists
if len(sys.argv) > 2:
    find = sys.argv[2]
    replace_with = sys.argv[3]

# Read blacklist if exists
if len(sys.argv) == 5:
    with open(sys.argv[4]) as f:
        blacklist = f.read()
        f.close()

# Find urls
urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', data)

# Make frequency dict
freq = { url: data.count(url) for url in urls }
print(freq)

need_save = False

# Perform replacement
if 'find' in locals():
    need_save = True
    data = data.replace(find, replace_with)

# Handle urls blacklist
if 'blacklist' in locals():
    need_save = True
    for blacklisted_url in blacklist.split():
        data = data.replace(blacklisted_url, '[forbidden link]')

# Store updated file if needed
if need_save:
    with open(outer_filename, 'w') as f:
        f.write(data)
        f.close()
        print(f"File where '{find}' replaced with '{replace_with}' stored there: {outer_filename}")
