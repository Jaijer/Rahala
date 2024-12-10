import os

# List of files and folders to exclude (like node_modules, .git, etc.)
EXCLUDE_LIST = { 'node_modules', '.git', '.env', '__pycache__', '.py' }

def draw_tree(directory, indent='', exclude=set()):
    """Recursively draw the directory tree while excluding specified files/folders."""
    try:
        entries = os.listdir(directory)
    except PermissionError:
        return  # Skip directories for which permission is denied

    for entry in entries:
        entry_path = os.path.join(directory, entry)
        
        # Skip excluded directories and files
        if entry in exclude:
            continue

        if os.path.isdir(entry_path):
            # If directory, print and recursively draw its tree
            print(f"{indent}├── {entry}/")
            draw_tree(entry_path, indent + "│   ", exclude)
        else:
            # If file, just print it
            print(f"{indent}├── {entry}")

def main():
    folder_path = input("Enter the folder path: ").strip()  # Get the folder path

    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        print(f"Directory Tree for {folder_path}:\n")
        draw_tree(folder_path, exclude=EXCLUDE_LIST)  # Exclude unimportant files/folders
    else:
        print("The provided path is not a valid directory.")

if __name__ == "__main__":
    main()
