import json
import tkinter as tk
from tkinter import messagebox
import requests

def save_data():
    anime_id = id_entry.get()
    anime_note = note_var.get()
    anime_avis = avis_entry.get()

    data = {
        anime_id: {
            "images": {
                "jpg": {
                    "image_url": "",
                    "small_image_url": "",
                    "large_image_url": ""
                },
                "webp": {
                    "image_url": "",
                    "small_image_url": "",
                    "large_image_url": ""
                }
            },
            "title": "",
            "jap-title": "",
            "status": "",
            "duration": "",
            "synopsis": "",
            "genres": [],
            "note": anime_note,
            "avis": anime_avis
        }
    }

    url = f"https://api.jikan.moe/v4/anime/{anime_id}"
    response = requests.get(url)
    if response.status_code == 200:
        anime_data = json.loads(response.text)
        selected_data = {
            "images": anime_data["data"]["images"],
            "title": anime_data["data"]["title"],
            "status": anime_data["data"]["status"],
            "duration": anime_data["data"]["duration"],
            "synopsis": anime_data["data"]["synopsis"],
            "genres": [genre["name"] for genre in anime_data["data"]["genres"]]
        }
        data[anime_id].update(selected_data)
    else:
        messagebox.showerror("Erreur", f"Impossible de récupérer les données pour l'ID de l'anime : {anime_id}")

    with open("./data/data.json", "r") as file:
        existing_data = json.load(file)

    existing_data.update(data)

    with open("./data/data.json", "w") as file:
        json.dump(existing_data, file, indent=4)

    # Vider les champs après avoir sauvegardé les données
    id_entry.delete(0, tk.END)
    note_var.set(0)
    avis_entry.delete(0, tk.END)

def center_window(window):
    window.update_idletasks()
    screen_width = window.winfo_screenwidth()
    screen_height = window.winfo_screenheight()
    window_width = 400  # Largeur de la fenêtre
    window_height = 350  # Hauteur de la fenêtre
    x = (screen_width // 2) - (window_width // 2)
    y = (screen_height // 2) - (window_height // 2)
    window.geometry(f"{window_width}x{window_height}+{x}+{y}")

# Création de la fenêtre
window = tk.Tk()
window.title("Interface utilisateur")

# Centre la fenêtre sur l'écran
center_window(window)

# Champ "id"
id_label = tk.Label(window, text="ID:")
id_label.grid(row=0, column=0, sticky="e")  # Utilise grid au lieu de pack
id_entry = tk.Entry(window, width=30)
id_entry.grid(row=0, column=1, padx=10, pady=5)  # Utilise grid avec un padding

# Champ "note"
note_label = tk.Label(window, text="Note:")
note_label.grid(row=1, column=0, sticky="e")
note_var = tk.IntVar()  # Variable pour stocker la note choisie
note_buttons_frame = tk.Frame(window)  # Frame pour regrouper les boutons radio
note_buttons_frame.grid(row=1, column=1, padx=10, pady=5)

for i in range(1, 6):
    note_button = tk.Radiobutton(note_buttons_frame, text=str(i), variable=note_var, value=i)
    note_button.pack(side="left")

# Champ "avis"
avis_label = tk.Label(window, text="Avis:")
avis_label.grid(row=2, column=0, sticky="e")
avis_entry = tk.Entry(window, width=50)
avis_entry.grid(row=2, column=1, padx=10, pady=5)

# Bouton de sauvegarde
save_button = tk.Button(window, text="Enregistrer", command=save_data)
save_button.grid(row=3, column=0, columnspan=2, padx=10, pady=10)  # Utilise grid avec un columnspan

# Lancement de la fenêtre principale
window.mainloop()
