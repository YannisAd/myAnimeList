import json


with open("data.json", "r", encoding="utf-8") as file:
 data = json.load(file)

html_code = ""


for anime in data:
    title = anime["title"]
    status = anime["status"]
    duration = anime["duration"]
    synopsis = anime["synopsis"]
    genres = anime["genres"]
    note = anime["note"]
    genres_string = ", ".join(genres)
    genres_string2 = " ".join(genres).lower()

    debut_html = ''' <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Filter</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>

</head>
<body>
    
    <div class = "container">
        <div class = "row">
            <div class = "col text-center my-4">
                <h1 class = "fs-2" id="test">Mes animes</h1>
                <div class = "underline mx-auto mt-3"></div>
            </div>
        </div>

        <div class="row mt-3 mb-4">
            <div class="col d-flex justify-content-center">
              <input type="text" id="search-bar" class="form-control" placeholder="Rechercher par titre">
            </div>
          </div>
          

        <div class = "row mt-3 mb-4 button-group filter-button-group">
            <div class = "col d-flex justify-content-center">
                <button type = "button" data-filter = "*" class = "btn btn-primary mx-1 text-dark">All</button>
                <button type = "button" data-filter = ".action" class = "btn btn-primary mx-1 text-dark">Action</button>
                <button type = "button" data-filter = ".fantasy" class = "btn btn-primary mx-1 text-dark">Fantasy</button>
                <button type = "button" data-filter = ".ecchi" class = "btn btn-primary mx-1 text-dark">Ecchi</button>
                <button type = "button" data-filter = ".romance" class = "btn btn-primary mx-1 text-dark">Romance</button>
                <button type = "button" data-filter = ".award-winning" class = "btn btn-primary mx-1 text-dark">Award-Winning</button>


                
            </div>
        </div>

        <div class="row justify-content-center g-4" id="anime-list">'''
    

    fin_html = '''</div>
  
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- isotope plugin -->
    <script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.js"></script>
    <script src="script.js"></script>
    
</body>
</html>
 '''



    html_code += f'''
    <div class="col-lg-4 col-md-6 {genres_string2}">
    <div class="product-item">
        <div class="product-img float-start">
            <img src="{anime['images']['jpg']['image_url']}" class="img-fluid d-block mx-auto">
        </div>
        <div class="product-content text-center py-3 float-end">
            <span class="d-block text-uppercase fw-bold" id="titre">{title}</span>
            <span id="synopsis" style="display:none;">{synopsis}</span>
            <span class="d-block w-100">Durée: {duration}</span>
            <span class="d-block w-100">Genres: {genres_string}</span>
            <span class="d-block w-100" id="note">{note}</span>

            
        </div>
    </div>
</div>


    '''




html_code_complet = debut_html + html_code + fin_html

with open("index.html", "w", encoding="utf-8") as file:
 file.write(html_code_complet)

print("Code HTML généré et enregistré dans index.html")