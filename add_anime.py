import subprocess

def main():
    
    script_path = "./script/add_card.py"
    script_path2 = "./script/create_card.py"


    subprocess.run(["python", script_path])
    subprocess.run(["python", script_path2])


if __name__ == "__main__":
    main()