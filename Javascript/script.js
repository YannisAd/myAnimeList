

class AnimeListApp {
    constructor() {
        this.animeData = {};
        this.activeFilters = new Set();
        this.currentSort = 'title';
        this.minRating = 0;
        this.searchTerm = '';
        this.$grid = null;
        this.isLoading = false;
        

        this.API_BASE_URL = 'https://api.jikan.moe/v4';
        this.API_DELAY = 1000;
        
        this.init();
    }

    init() {
        this.loadAnimeData();
        this.setupEventListeners();
        this.initializeIsotope();
        this.updateUI();
        this.setupScrollEvents();
    }

    setupEventListeners() {
        $('#search-bar').on('input', debounce((e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndSort();
            this.toggleClearButton();
        }, 300));

        $('#genreFilters').on('click', '.btn-filter', (e) => {
            const filter = $(e.currentTarget).data('filter');
            this.toggleFilter(filter, e.currentTarget);
        });

        $('#ratingFilter').on('input', (e) => {
            this.minRating = parseInt(e.target.value);
            this.updateRatingDisplay();
            this.filterAndSort();
        });

        $('#sortBy').on('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSort();
        });

        $('#animeSearch').on('keypress', (e) => {
            if (e.which === 13) {
                this.searchAnime();
            }
        });

        $('#importInput').on('change', (e) => {
            this.importData(e.target.files[0]);
        });

        $(document).on('click', '#addAnimeModal, #animeDetailsModal', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAddModal();
                this.closeAnimeDetails();
            }
        });

        window.showAddModal = () => this.showAddModal();
        window.hideAddModal = () => this.hideAddModal();
        window.toggleFiltersCollapse = () => this.toggleFiltersCollapse();
        window.clearAllFilters = () => this.clearAllFilters();
        window.clearSearch = () => this.clearSearch();
        window.searchAnime = () => this.searchAnime();
        window.exportData = () => this.exportData();
        window.triggerImport = () => this.triggerImport();
        window.scrollToTop = () => this.scrollToTop();
        
        window.animeApp = {
            switchTab: (tab) => this.switchTab(tab),
            loadEpisodes: (id) => this.loadEpisodes(id),
            loadRecommendations: (id) => this.loadRecommendations(id),
            viewRecommendedAnime: (id) => this.viewRecommendedAnime(id),
            addRecommendedAnime: (id) => this.addRecommendedAnime(id),
            closeRecommendedDetails: () => this.closeRecommendedDetails(),
            closeAnimeDetails: () => this.closeAnimeDetails(),
            setRating: (rating) => this.setRating(rating),
            saveUserNotes: (id) => this.saveUserNotes(id),
            confirmRemoveAnime: (id) => this.confirmRemoveAnime(id),
            addAnimeToList: (id) => this.addAnimeToList(id)
        };
    }

    initializeIsotope() {
        this.filterAndSort();
    }

    loadAnimeData() {
        const saved = localStorage.getItem('animeListData');
        if (saved) {
            try {
                this.animeData = JSON.parse(saved);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                this.showToast('Erreur lors du chargement des données', 'error');
                this.animeData = {};
            }
        }
        
        if (Object.keys(this.animeData).length === 0) {
            this.loadDefaultData();
        }
        
        this.renderAnimeList();
    }

    loadDefaultData() {
        this.animeData = {
            "21": {
                "title": "One Piece",
                "images": {"jpg": {"image_url": "https://cdn.myanimelist.net/images/anime/6/73245.jpg"}},
                "duration": "24 min",
                "genres": ["Action", "Adventure", "Fantasy"],
                "synopsis": "Gol D. Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece.",
                "userRating": 5,
                "userNotes": "Un chef-d'œuvre absolu ! L'histoire est captivante et les personnages attachants.",
                "dateAdded": Date.now()
            },
            "40748": {
                "title": "Jujutsu Kaisen",
                "images": {"jpg": {"image_url": "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"}},
                "duration": "23 min per ep",
                "genres": ["Action", "Award-Winning", "Fantasy"],
                "synopsis": "Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather.",
                "userRating": 4,
                "userNotes": "Excellent anime avec de superbes animations et combats.",
                "dateAdded": Date.now() - 86400000
            }
        };
        this.saveAnimeData();
    }

    saveAnimeData() {
        try {
            localStorage.setItem('animeListData', JSON.stringify(this.animeData));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            this.showToast('Erreur lors de la sauvegarde', 'error');
        }
    }

    renderAnimeList() {
        const container = $('#anime-list');
        container.empty();

        if (Object.keys(this.animeData).length === 0) {
            this.showEmptyState();
            return;
        }

        Object.entries(this.animeData).forEach(([id, anime], index) => {
            const genreClasses = this.getGenreClasses(anime.genres);
            const animeCard = this.createAnimeCard(id, anime, genreClasses, index);
            container.append(animeCard);
        });

        this.filterAndSort();
        this.updateStats();
    }

    createAnimeCard(id, anime, genreClasses, index) {
        const rating = anime.userRating || 0;
        const ratingStars = this.generateStarRating(rating, false);
        const genres = anime.genres.slice(0, 3).map(genre => 
            `<span class="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">${genre}</span>`
        ).join('');

        return $(`
            <div class="anime-item anime-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 ${genreClasses}" 
                 data-id="${id}" style="animation-delay: ${index * 0.1}s">
                <div class="card-image relative overflow-hidden">
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                    ${rating > 0 ? `
                        <div class="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <i class="fas fa-star text-yellow-400"></i> ${rating}/5
                        </div>
                    ` : ''}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div class="card-content p-5">
                    <div class="flex-1">
                        <h3 class="anime-title font-bold text-lg text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                            ${anime.title}
                        </h3>
                        <div class="mb-3">
                            ${ratingStars}
                        </div>
                        <div class="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                            ${genres}
                        </div>
                    </div>
                    <div class="text-gray-500 text-sm flex items-center gap-2 mt-auto">
                        <i class="fas fa-clock"></i>
                        ${anime.duration}
                    </div>
                </div>
            </div>
        `).on('click', () => this.showAnimeDetails(id));
    }

    getGenreClasses(genres) {
        return genres.map(genre => 
            genre.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
        ).join(' ');
    }

    generateStarRating(rating, interactive = false) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating;
            const classes = filled ? 'text-yellow-400' : 'text-gray-300';
            const clickHandler = interactive ? `onclick="animeApp.setRating(${i})"` : '';
            const hoverClass = interactive ? 'hover:text-yellow-400 cursor-pointer hover:scale-110' : '';
            stars.push(`<span class="star ${classes} ${hoverClass} transition-all duration-200" ${clickHandler}>★</span>`);
        }
        return `<div class="flex gap-1">${stars.join('')}</div>`;
    }

    async showAnimeDetails(id) {
        localStorage.setItem('currentAnimeId', id);
        
        window.open('anime-details.html', '_blank');
    }

    closeAnimeDetails() {
        $('#animeDetailsModal').addClass('hidden').empty();
    }


    switchTab(tabName) {
         $('.tab-btn').removeClass('active bg-blue-500 text-white').addClass('text-gray-600 hover:text-blue-600 hover:bg-gray-50');
    $(`.tab-btn[data-tab="${tabName}"]`).removeClass('text-gray-600 hover:text-blue-600 hover:bg-gray-50').addClass('active bg-blue-500 text-white');
    
    $('.tab-content').addClass('hidden');
    $(`#tab-${tabName}`).removeClass('hidden');
    

    if (tabName === 'episodes') {
        loadEpisodes();
    } else if (tabName === 'recommendations') {
        loadRecommendations();
    }
}


    async loadEpisodes(animeId) {
        const content = $('#episodes-content');
        content.html(`
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-600">Chargement des épisodes...</p>
            </div>
        `);

        try {
            await this.delay(this.API_DELAY);
            const response = await fetch(`${this.API_BASE_URL}/anime/${animeId}/episodes`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.displayEpisodes(data.data);
            } else {
                content.html(`
                    <div class="text-center py-12">
                        <div class="text-gray-300 text-6xl mb-4">
                            <i class="fas fa-film"></i>
                        </div>
                        <p class="text-gray-600">Aucun épisode disponible</p>
                    </div>
                `);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des épisodes:', error);
            content.html(`
                <div class="text-center py-12">
                    <div class="text-red-300 text-6xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="text-red-600 font-semibold">Erreur lors du chargement</p>
                    <p class="text-gray-600 text-sm">Les épisodes ne sont pas disponibles</p>
                </div>
            `);
        }
    }

    /**
     * Affichage de la liste des épisodes
     */
    displayEpisodes(episodes) {
        const content = $('#episodes-content');
        let html = `
            <div class="mb-4 text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                ${episodes.length} épisode${episodes.length > 1 ? 's' : ''} trouvé${episodes.length > 1 ? 's' : ''}
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
        `;
        
        episodes.forEach((episode, index) => {
            const title = episode.title || `Épisode ${episode.mal_id}`;
            const aired = episode.aired ? new Date(episode.aired).toLocaleDateString('fr-FR') : 'Non diffusé';
            const duration = episode.duration ? `${episode.duration} min` : 'Durée inconnue';
            
            html += `
                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    #${episode.mal_id || index + 1}
                                </span>
                                <h4 class="font-semibold text-gray-800">${title}</h4>
                            </div>
                            <div class="flex items-center gap-4 text-sm text-gray-600">
                                <span><i class="fas fa-calendar mr-1"></i> ${aired}</span>
                                <span><i class="fas fa-clock mr-1"></i> ${duration}</span>
                                ${episode.filler ? '<span class="text-orange-500"><i class="fas fa-exclamation-triangle mr-1"></i> Filler</span>' : ''}
                                ${episode.recap ? '<span class="text-purple-500"><i class="fas fa-redo mr-1"></i> Récap</span>' : ''}
                            </div>
                            ${episode.title_japanese ? `<p class="text-sm text-gray-500 mt-2">${episode.title_japanese}</p>` : ''}
                        </div>
                        ${episode.score ? `
                            <div class="text-right">
                                <div class="text-yellow-500 font-semibold">${episode.score}/10</div>
                                <div class="text-xs text-gray-500">Note</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        content.html(html);
    }


    async loadRecommendations(animeId) {
        const content = $('#recommendations-content');
        content.html(`
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p class="text-gray-600">Chargement des recommandations...</p>
            </div>
        `);

        try {
            await this.delay(this.API_DELAY);
            const response = await fetch(`${this.API_BASE_URL}/anime/${animeId}/recommendations`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.displayRecommendations(data.data);
            } else {
                content.html(`
                    <div class="text-center py-12">
                        <div class="text-gray-300 text-6xl mb-4">
                            <i class="fas fa-thumbs-up"></i>
                        </div>
                        <p class="text-gray-600">Aucune recommandation disponible</p>
                    </div>
                `);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des recommandations:', error);
            content.html(`
                <div class="text-center py-12">
                    <div class="text-red-300 text-6xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="text-red-600 font-semibold">Erreur lors du chargement</p>
                    <p class="text-gray-600 text-sm">Les recommandations ne sont pas disponibles</p>
                </div>
            `);
        }
    }


    displayRecommendations(recommendations) {
        const content = $('#recommendations-content');
        let html = `
            <div class="mb-4 text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                ${recommendations.length} recommandation${recommendations.length > 1 ? 's' : ''} trouvée${recommendations.length > 1 ? 's' : ''}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;
        
        recommendations.slice(0, 12).forEach(rec => {
            const entry = rec.entry;
            const votes = rec.votes || 0;
            
            html += `
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                     onclick="animeApp.viewRecommendedAnime(${entry.mal_id})">
                    <div class="relative">
                        <img src="${entry.images.jpg.image_url}" alt="${entry.title}" 
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs">
                            <i class="fas fa-thumbs-up mr-1"></i>${votes}
                        </div>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            ${entry.title}
                        </h4>
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <span><i class="fas fa-calendar mr-1"></i>${entry.year || 'N/A'}</span>
                            ${entry.score ? `<span class="text-yellow-500"><i class="fas fa-star mr-1"></i>${entry.score}</span>` : ''}
                        </div>
                        <button onclick="event.stopPropagation(); animeApp.addRecommendedAnime(${entry.mal_id})" 
                                class="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                            <i class="fas fa-plus mr-2"></i>Ajouter à ma liste
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        content.html(html);
    }


    async viewRecommendedAnime(malId) {
        try {
            await this.delay(this.API_DELAY);
            const response = await fetch(`${this.API_BASE_URL}/anime/${malId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const anime = data.data;
            
            this.showRecommendedAnimeDetails(anime);
        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            this.showToast('Erreur lors du chargement des détails', 'error');
        }
    }


    showRecommendedAnimeDetails(anime) {
        const genres = anime.genres ? anime.genres.map(g => 
            `<span class="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs">${g.name}</span>`
        ).join('') : '';

        const modalContent = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-bounce-in">
                    <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold">Anime recommandé</h2>
                            <button onclick="animeApp.closeRecommendedDetails()" class="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="lg:col-span-1">
                                <img src="${anime.images.jpg.image_url}" alt="${anime.title}" 
                                     class="w-full max-w-xs mx-auto rounded-2xl shadow-lg">
                            </div>
                            
                            <div class="lg:col-span-2 space-y-4">
                                <div>
                                    <h1 class="text-3xl font-bold text-gray-800 mb-4">${anime.title}</h1>
                                    <div class="flex flex-wrap gap-2 mb-4">
                                        ${genres}
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                        <div><i class="fas fa-calendar mr-2"></i>Année: ${anime.year || 'N/A'}</div>
                                        <div><i class="fas fa-star mr-2"></i>Score: ${anime.score || 'N/A'}/10</div>
                                        <div><i class="fas fa-play mr-2"></i>Épisodes: ${anime.episodes || 'N/A'}</div>
                                        <div><i class="fas fa-clock mr-2"></i>Durée: ${anime.duration || 'N/A'}</div>
                                        <div><i class="fas fa-tv mr-2"></i>Statut: ${anime.status || 'N/A'}</div>
                                        <div><i class="fas fa-users mr-2"></i>Popularité: #${anime.popularity || 'N/A'}</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Synopsis</h3>
                                    <p class="text-gray-600 leading-relaxed">${anime.synopsis || 'Pas de synopsis disponible'}</p>
                                </div>
                                
                                <div class="flex gap-3 pt-4">
                                    <button onclick="animeApp.addRecommendedAnime(${anime.mal_id})" 
                                            class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                                        <i class="fas fa-plus"></i>
                                        Ajouter à ma liste
                                    </button>
                                    <button onclick="animeApp.closeRecommendedDetails()" 
                                            class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                                        <i class="fas fa-arrow-left"></i>
                                        Retour
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(`<div id="recommendedAnimeModal">${modalContent}</div>`);
    }

  
    closeRecommendedDetails() {
        $('#recommendedAnimeModal').remove();
    }


    async addRecommendedAnime(malId) {
        if (this.animeData[malId]) {
            this.showToast('Cet anime est déjà dans votre liste', 'warning');
            return;
        }

        const button = event.target.closest('button');
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ajout...';
        button.disabled = true;

        try {
            await this.delay(this.API_DELAY);
            const response = await fetch(`${this.API_BASE_URL}/anime/${malId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const anime = data.data;

            this.animeData[malId] = {
                title: anime.title,
                images: anime.images,
                duration: anime.duration || 'Durée inconnue',
                genres: anime.genres ? anime.genres.map(g => g.name) : ['Non spécifié'],
                synopsis: anime.synopsis || 'Pas de synopsis disponible',
                userRating: 0,
                userNotes: '',
                dateAdded: Date.now()
            };

            this.saveAnimeData();
            this.renderAnimeList();
            this.showToast(`"${anime.title}" ajouté à votre liste !`, 'success');
            
            button.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            button.className = button.className.replace('from-green-500 to-emerald-500', 'from-blue-500 to-purple-500');
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            this.showToast('Erreur lors de l\'ajout de l\'anime', 'error');
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }

    setRating(rating) {
        const animeId = $('#popup-rating').data('anime-id');
        if (!animeId) return;

        this.animeData[animeId].userRating = rating;
        this.saveAnimeData();
        
        $('#popup-rating').html(this.generateStarRating(rating, true));
        this.renderAnimeList();
        this.showToast(`Note mise à jour : ${rating}/5 étoiles`, 'success');
    }

    saveUserNotes(id) {
        const notes = $('#userNotes').val().trim();
        this.animeData[id].userNotes = notes;
        this.saveAnimeData();
        
        this.showToast('Commentaire sauvegardé !', 'success');
        
        const btn = event.target.closest('button');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Sauvegardé !';
        btn.className = btn.className.replace('from-green-500 to-emerald-500', 'from-blue-500 to-purple-500');
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.className = btn.className.replace('from-blue-500 to-purple-500', 'from-green-500 to-emerald-500');
        }, 2000);
    }

    confirmRemoveAnime(id) {
        const anime = this.animeData[id];
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${anime.title}" de votre liste ?`)) {
            this.removeAnime(id);
        }
    }

    removeAnime(id) {
        const title = this.animeData[id].title;
        delete this.animeData[id];
        this.saveAnimeData();
        this.renderAnimeList();
        this.closeAnimeDetails();
        this.showToast(`"${title}" supprimé de la liste`, 'info');
    }

    toggleFilter(filter, button) {
        const $button = $(button);
        
        if (this.activeFilters.has(filter)) {
            this.activeFilters.delete(filter);
            $button.removeClass('active');
        } else {
            this.activeFilters.add(filter);
            $button.addClass('active');
        }
        
        this.filterAndSort();
    }

    filterAndSort() {
        const items = $('.anime-item');
        let visibleCount = 0;

        items.each((index, element) => {
            const $element = $(element);
            const passes = this.passesAllFilters($element);
            
            if (passes) {
                $element.removeClass('hidden').addClass('block');
                visibleCount++;
            } else {
                $element.removeClass('block').addClass('hidden');
            }
        });

        const visibleItems = items.filter('.block');
        const sortedItems = this.sortItems(visibleItems);
        
        const container = $('#anime-list');
        sortedItems.each((index, element) => {
            container.append(element);
        });

        this.updateVisibleCount(visibleCount);
        this.toggleEmptyState(visibleCount === 0);
    }

    passesAllFilters($element) {
        const animeId = $element.data('id');
        const anime = this.animeData[animeId];
        
        if (this.searchTerm && !anime.title.toLowerCase().includes(this.searchTerm)) {
            return false;
        }
        
        if (this.minRating > 0 && (anime.userRating || 0) < this.minRating) {
            return false;
        }
        
        if (this.activeFilters.size > 0) {
            const animeGenres = this.getGenreClasses(anime.genres).split(' ');
            const hasMatchingGenre = Array.from(this.activeFilters).some(filter => 
                animeGenres.includes(filter)
            );
            if (!hasMatchingGenre) {
                return false;
            }
        }
        
        return true;
    }

    sortItems($items) {
        return $items.sort((a, b) => {
            const animeA = this.animeData[$(a).data('id')];
            const animeB = this.animeData[$(b).data('id')];
            
            switch (this.currentSort) {
                case 'title':
                    return animeA.title.localeCompare(animeB.title);
                case 'title-desc':
                    return animeB.title.localeCompare(animeA.title);
                case 'rating':
                    return (animeA.userRating || 0) - (animeB.userRating || 0);
                case 'rating-desc':
                    return (animeB.userRating || 0) - (animeA.userRating || 0);
                case 'date-added':
                    return (animeB.dateAdded || 0) - (animeA.dateAdded || 0);
                default:
                    return 0;
            }
        });
    }

    showAddModal() {
        $('#addAnimeModal').removeClass('hidden');
        $('#animeSearch').focus();
    }

    hideAddModal() {
        $('#addAnimeModal').addClass('hidden');
        $('#animeSearch').val('');
        $('#searchResults').empty();
    }

    async searchAnime() {
        const query = $('#animeSearch').val().trim();
        if (!query || this.isLoading) return;

        this.isLoading = true;
        const resultsContainer = $('#searchResults');
        resultsContainer.html(`
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-600">Recherche en cours...</p>
            </div>
        `);

        try {
            const response = await fetch(`${this.API_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=10`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.displaySearchResults(data.data);
            } else {
                resultsContainer.html(`
                    <div class="text-center py-12">
                        <div class="text-gray-300 text-6xl mb-4">
                            <i class="fas fa-search"></i>
                        </div>
                        <p class="text-gray-600">Aucun résultat trouvé</p>
                    </div>
                `);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            resultsContainer.html(`
                <div class="text-center py-12">
                    <div class="text-red-300 text-6xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="text-red-600 font-semibold">Erreur lors de la recherche</p>
                    <p class="text-gray-600 text-sm">Vérifiez votre connexion internet</p>
                </div>
            `);
        } finally {
            this.isLoading = false;
        }
    }

    displaySearchResults(results) {
        const resultsContainer = $('#searchResults');
        let html = '<div class="mb-6"><h3 class="text-xl font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-search text-blue-500"></i> Résultats de recherche</h3></div>';
        
        results.forEach(anime => {
            if (!this.animeData[anime.mal_id]) {
                const genres = anime.genres ? anime.genres.slice(0, 3).map(g => 
                    `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${g.name}</span>`
                ).join(' ') : '';
                
                const synopsis = anime.synopsis ? 
                    anime.synopsis.length > 150 ? 
                        anime.synopsis.substring(0, 150) + '...' : 
                        anime.synopsis : 
                    'Pas de synopsis disponible';

                html += `
                    <div class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-4 mb-4">
                        <div class="flex gap-4">
                            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" 
                                 class="w-20 h-28 object-cover rounded-lg flex-shrink-0">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-lg text-gray-800 mb-2 truncate">${anime.title}</h4>
                                <div class="flex flex-wrap gap-1 mb-2">
                                    ${genres}
                                </div>
                                <p class="text-gray-600 text-sm mb-3 line-clamp-3">${synopsis}</p>
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-gray-500">
                                        <i class="fas fa-star text-yellow-500"></i> ${anime.score || 'N/A'} | 
                                        <i class="fas fa-calendar text-blue-500"></i> ${anime.year || 'N/A'}
                                    </div>
                                    <button onclick="animeApp.addAnimeToList(${anime.mal_id})" 
                                            class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                                        <i class="fas fa-plus"></i>
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        if (html === '<div class="mb-6"><h3 class="text-xl font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-search text-blue-500"></i> Résultats de recherche</h3></div>') {
            html += `
                <div class="text-center py-12">
                    <div class="text-green-300 text-6xl mb-4">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <p class="text-gray-600">Tous ces animes sont déjà dans votre liste !</p>
                </div>
            `;
        }
        
        resultsContainer.html(html);
    }

    async addAnimeToList(malId) {
        if (this.animeData[malId]) {
            this.showToast('Cet anime est déjà dans votre liste', 'warning');
            return;
        }

        const button = event.target.closest('button');
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ajout...';
        button.disabled = true;

        try {
            await this.delay(this.API_DELAY);
            
            const response = await fetch(`${this.API_BASE_URL}/anime/${malId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const anime = data.data;

            this.animeData[malId] = {
                title: anime.title,
                images: anime.images,
                duration: anime.duration || 'Durée inconnue',
                genres: anime.genres ? anime.genres.map(g => g.name) : ['Non spécifié'],
                synopsis: anime.synopsis || 'Pas de synopsis disponible',
                userRating: 0,
                userNotes: '',
                dateAdded: Date.now()
            };

            this.saveAnimeData();
            this.renderAnimeList();
            this.hideAddModal();
            this.showToast(`"${anime.title}" ajouté à votre liste !`, 'success');
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            this.showToast('Erreur lors de l\'ajout de l\'anime', 'error');
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearAllFilters() {
        this.activeFilters.clear();
        this.minRating = 0;
        this.searchTerm = '';
        
        $('.btn-filter').removeClass('active');
        $('#ratingFilter').val(0);
        $('#search-bar').val('');
        $('#sortBy').val('title');
        
        this.updateRatingDisplay();
        this.toggleClearButton();
        this.filterAndSort();
        this.showToast('Filtres effacés', 'info');
    }

    clearSearch() {
        $('#search-bar').val('');
        this.searchTerm = '';
        this.filterAndSort();
        this.toggleClearButton();
    }

    toggleClearButton() {
        const hasSearch = $('#search-bar').val().length > 0;
        $('.btn-clear-search').toggleClass('show', hasSearch);
    }

    updateRatingDisplay() {
        const value = this.minRating;
        const display = value === 0 ? 'Toutes les notes' : `${value} étoile${value > 1 ? 's' : ''} et +`;
        
        $('#ratingValue').text(display);
        
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const classes = i <= value ? 'text-yellow-400' : 'text-gray-300';
            stars += `<span class="star ${classes}">★</span>`;
        }
        $('#ratingStars').html(stars);
    }

    toggleFiltersCollapse() {
        const content = $('#filtersContent');
        const icon = $('#filtersToggleIcon');
        
        content.toggleClass('collapsed');
        icon.toggleClass('rotate-180');
    }

    updateStats() {
        const total = Object.keys(this.animeData).length;
        const ratings = Object.values(this.animeData)
            .map(anime => anime.userRating || 0)
            .filter(rating => rating > 0);
        
        const avgRating = ratings.length > 0 ? 
            (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : 
            '0.0';

        $('#totalAnimes').text(total);
        $('#avgRating').text(avgRating);
        $('#animeCount').text(`${total} anime${total > 1 ? 's' : ''}`);
    }

    updateVisibleCount(count) {
        $('#visibleAnimes').text(count);
    }

    showEmptyState() {
        $('#anime-list').empty();
        $('#emptyState').removeClass('hidden');
        this.updateStats();
    }

    toggleEmptyState(show) {
        $('#emptyState').toggleClass('hidden', !show || Object.keys(this.animeData).length === 0);
    }

    updateUI() {
        this.updateStats();
        this.updateRatingDisplay();
        this.toggleClearButton();
    }

    setupScrollEvents() {
        $(window).on('scroll', debounce(() => {
            const scrollTop = $(window).scrollTop();
            $('#scrollTopBtn').toggleClass('hidden', scrollTop <= 300);
        }, 100));
    }

    scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    }

    exportData() {
        const dataStr = JSON.stringify(this.animeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `anime-list-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showToast('Liste exportée avec succès !', 'success');
    }

    triggerImport() {
        $('#importInput').click();
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                
                if (typeof imported === 'object' && imported !== null) {
                    if (confirm('Voulez-vous remplacer votre liste actuelle ? (Annuler pour fusionner)')) {
                        this.animeData = imported;
                    } else {
                        Object.assign(this.animeData, imported);
                    }
                    
                    this.saveAnimeData();
                    this.renderAnimeList();
                    this.showToast('Données importées avec succès !', 'success');
                } else {
                    this.showToast('Format de fichier invalide', 'error');
                }
            } catch (error) {
                console.error('Erreur lors de l\'importation:', error);
                this.showToast('Erreur lors de l\'importation du fichier', 'error');
            }
        };
        
        reader.readAsText(file);
        $('#importInput').val('');
    }

    showToast(message, type = 'info', duration = 4000) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle', 
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const colors = {
            success: 'from-green-500 to-emerald-500',
            error: 'from-red-500 to-pink-500',
            warning: 'from-yellow-500 to-orange-500',
            info: 'from-blue-500 to-purple-500'
        };

        const toast = $(`
            <div class="toast bg-white rounded-xl shadow-2xl border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 p-4 animate-slide-in">
                <div class="flex items-center gap-3">
                    <div class="bg-gradient-to-r ${colors[type]} p-2 rounded-full">
                        <i class="fas ${icons[type]} text-white"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800">${message}</p>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600 p-1">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `);

        $('#toastContainer').append(toast);

        setTimeout(() => {
            toast.fadeOut(300, () => toast.remove());
        }, duration);

        toast.find('button').on('click', () => {
            toast.fadeOut(300, () => toast.remove());
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

let animeApp;

$(document).ready(() => {
    animeApp = new AnimeListApp();
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Erreur non gérée:', event.reason);
        animeApp.showToast('Une erreur inattendue s\'est produite', 'error');
    });
    
    if (Object.keys(animeApp.animeData).length <= 2) {
        setTimeout(() => {
            animeApp.showToast('Bienvenue ! Commencez par ajouter vos animes préférés.', 'info', 6000);
        }, 1000);
    }
});

window.addEventListener('beforeunload', () => {
    if (animeApp) {
        animeApp.saveAnimeData();
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && animeApp) {
        animeApp.saveAnimeData();
    }
});