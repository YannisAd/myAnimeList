import requests
import json
import time

id_list = [21, 40748, 41433, 39555, 20787, 889, 269, 9919, 11633, 41468, 1, 35849, 1535, 28223, 38000, 35120, 31043, 5114, 384, 41353, 40052, 245, 42625, 11061, 36873, 40748, 14719, 18679, 31964, 8460, 32182, 39535, 37779, 20507, 29803, 22535, 30240, 13601, 40834, 40750, 33255, 205, 43690, 16498, 50265, 48453, 44942, 43697]

data = []

for anime_id in id_list:
    url = f"https://api.jikan.moe/v4/anime/{anime_id}"
    response = requests.get(url)
    if response.status_code == 200:
        anime_data = response.json()
        data.append(anime_data)
        print(f"Data received for anime ID {anime_id}")
    else:
        print(f"Error retrieving data for anime ID {anime_id}")
    
    time.sleep(1.5)  # Delay for 1.5 seconds

# Write the data to a file
with open("data.json", "w") as file:
    json.dump(data, file)

print("Data saved to data.json")
