document.addEventListener("DOMContentLoaded", () => {

    // --- 1. ANIMATION D'ENTRÉE HERO ---
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // --- 2. DOT "SYSTÈME EN LIGNE" CLIGNOTANT ---
    const dot = document.querySelector('.dot');
    if (dot) {
        setInterval(() => {
            dot.style.opacity = dot.style.opacity === '0' ? '1' : '0';
        }, 800);
    }

    // --- 3. GESTION DE LA NAVBAR AU SCROLL ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 12, 0.95)';
            nav.style.padding = '10px 50px';
            nav.style.borderBottom = '1px solid var(--spidey-red)';
        } else {
            nav.style.background = 'transparent';
            nav.style.padding = '20px 50px';
            nav.style.borderBottom = 'none';
        }
    });

    // --- 4. SCROLL REVEAL avec Intersection Observer ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. ANIMATION DES LIGNES DE L'ARBRE DE COMPÉTENCES ---
    const skillSection = document.querySelector('.skills-section');
    if (skillSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.path-line').forEach((line, i) => {
                        setTimeout(() => {
                            line.classList.add('line-active');
                        }, 400 + (i * 150));
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillObserver.observe(skillSection);
    }

    // --- 6. SKILL INFO PANEL — HUD au survol ---
    const infoPanel    = document.getElementById('skill-info-panel');
    const panelName    = document.getElementById('panel-name');
    const panelMastery = document.getElementById('panel-mastery');
    const panelType    = document.getElementById('panel-type');
    const panelUsage   = document.getElementById('panel-usage');
    const panelStrengths = document.getElementById('panel-strengths');

    const masteryLabels = {
        mastered: '✦ MAÎTRISÉ',
        unlocked: '◈ ACQUIS',
        learning: '◌ EN COURS'
    };

    const masteryClasses = {
        mastered: 'mastery-mastered',
        unlocked: 'mastery-unlocked',
        learning: 'mastery-learning'
    };

    if (infoPanel) {
        document.querySelectorAll('.skill-node').forEach(node => {

            // Affiche le panel au survol
            node.addEventListener('mouseenter', () => {
                const mastery = node.dataset.mastery || 'unlocked';

                panelName.textContent = node.querySelector('.skill-name')?.textContent || '—';
                panelType.textContent = node.dataset.type || '—';
                panelUsage.textContent = node.dataset.usage || '—';
                panelStrengths.textContent = node.dataset.strengths || '—';

                panelMastery.textContent = masteryLabels[mastery] || '—';
                panelMastery.className = 'panel-mastery ' + (masteryClasses[mastery] || '');

                infoPanel.classList.add('active');
            });

            // Cache le panel quand on quitte le nœud
            node.addEventListener('mouseleave', () => {
                infoPanel.classList.remove('active');
            });

            // --- 7. CONNEXIONS COMBO au clic ---
            node.addEventListener('click', () => {
                const wasActive = node.classList.contains('combo-clicked');

                // Reset tous les combos
                document.querySelectorAll('.skill-node').forEach(n => {
                    n.classList.remove('combo-active', 'combo-clicked');
                });

                // Si le nœud n'était pas déjà actif, on active le combo
                if (!wasActive && node.dataset.connects) {
                    node.classList.add('combo-clicked');

                    const connectedIds = node.dataset.connects.split(',');
                    connectedIds.forEach(id => {
                        const connectedNode = document.getElementById(id.trim());
                        if (connectedNode) {
                            connectedNode.classList.add('combo-active');
                        }
                    });

                    // Met à jour le hint dans le panel
                    if (infoPanel) {
                        const hint = infoPanel.querySelector('.panel-hint');
                        if (hint) hint.textContent = `[ ${connectedIds.length} connexion(s) activée(s) ]`;
                    }
                } else {
                    // Réinitialise le hint
                    if (infoPanel) {
                        const hint = infoPanel.querySelector('.panel-hint');
                        if (hint) hint.textContent = '[ CLIC ] pour voir les connexions';
                    }
                }
            });
        });

        // Cliquer en dehors des nœuds remet à zéro les combos
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.skill-node')) {
                document.querySelectorAll('.skill-node').forEach(n => {
                    n.classList.remove('combo-active', 'combo-clicked');
                });
                const hint = infoPanel.querySelector('.panel-hint');
                if (hint) hint.textContent = '[ CLIC ] pour voir les connexions';
            }
        });
    }

    // --- 8. EFFET GLITCH SUR LES TITRES DE SECTION ---
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        title.addEventListener('mouseover', () => {
            title.style.textShadow = `2px 0 var(--tech-blue), -2px 0 var(--spidey-red)`;
            title.style.transform = 'translateX(2px)';
            setTimeout(() => {
                title.style.textShadow = 'none';
                title.style.transform = 'translateX(0)';
            }, 100);
        });
    });

    // --- 9. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });


    // ==========================================================
    // --- 10. MODAL MISSION LOG ---
    // ==========================================================

    // --- Données complètes de chaque mission ---
    // ⚠️ Pour modifier une mission : change directement dans cet objet.
    // Champs : title, category, objectif, gadgets[], proof{}, statut, risks[], ia_boost (null si non applicable)
    const missionData = {

        fenziconnect: {
            title: 'Système de Gestion ERP — FenziConnect',
            category: 'QUÊTE PRINCIPALE — STAGIAIRE',
            objectif: 'Conception et développement d\'une plateforme centralisée pour la gestion administrative de l\'entreprise (Factures, Collaborateurs, Clients). Déploiement de fonctionnalités réelles en production dans un environnement Agile.',
            gadgets: ['Angular', 'Spring Boot', 'PostgreSQL', 'SCSS', 'Postman', 'GitLab', 'Jira'],
            proof: {
                label: 'Voir le dépôt GitHub',
                // ⚠️ Remplace par le lien réel vers le dépôt du projet
                link: 'https://github.com/Doryan92290'
            },
            statut: 'Stage validé — Déploiement effectif en production.',
            details: [
                {
                    category: '🔧 Backend — Spring Boot',
                    items: [
                        'Architecture d\'une API REST sécurisée (endpoints CRUD complets).',
                        'Gestion du cycle de vie des factures : création, modification, suppression.',
                        'Algorithme de calcul automatique : montants HT, application de la TVA, calcul du TTC.',
                        'Logique métier pour le changement d\'états : EN_ATTENTE → PAYÉE → ANNULÉE.'
                    ]
                },
                {
                    category: '🎨 Frontend — Angular',
                    items: [
                        'Dashboard dynamique avec filtrage temps réel des statuts de factures.',
                        'Formulaire complexe avec gestion dynamique des lignes de produits (ajout/suppression à la volée).',
                        'Interface UX/UI avec SCSS : codes couleurs par statut (vert payé, rouge annulé, orange attente).'
                    ]
                },
                {
                    category: '🧪 Qualité & Tests',
                    items: [
                        'Tests unitaires des services de calcul pour garantir zéro erreur de facturation.',
                        'Validation rigoureuse des formulaires côté Front et Back pour éviter les données corrompues.',
                        'Tests et documentation des endpoints via Postman (collections partagées avec l\'équipe).',
                        'Suivi des tickets et gestion des sprints via Jira — méthode Agile complète.'
                    ]
                }
            ],
            risks: [
                'Prise en main autonome d\'Angular (TypeScript) : techno non vue en cours, apprise en autonomie directement sur le projet de stage.',
                'Intégration front-end / back-end : gestion des CORS, sécurisation des endpoints Spring Boot, alignement des contrats d\'API.',
                'Respect des sprints Agiles et des délais de déploiement en production — pression réelle de livraison.',
                'Collaboration sur GitLab en équipe : branches, merge requests, code review — processus professionnel complet.'
            ],
            ia_boost: null,
            gallery: [
                'assets/images/detail-tache.png',
                'assets/images/gestion-tache.png',
                'assets/images/cree-facture.png'
            ]
        },

        coreflow: {
            title: 'CoreFlow — Plateforme Intranet d\'Entreprise',
            category: 'QUÊTE ANNEXE — BTS SIO 2ÈME ANNÉE',
            objectif: 'Concevoir et développer une plateforme intranet complète pour la gestion RH et la communication interne d\'entreprise : demandes de congés, événements internes, tickets support et accès aux documents selon les rôles utilisateur.',
            gadgets: ['Vue.js', 'Node.js', 'MySQL', 'GitHub', 'REST API'],
            proof: {
                label: 'Voir le dépôt GitHub',
                link: 'https://github.com/Doryan92290'
            },
            statut: 'Projet BTS SIO 2ème année — Épreuve E5.',
            details: [
                {
                    category: '🧩 Fonctionnalités',
                    items: [
                        'Gestion des demandes de congés : soumission, validation manager, historique et statuts (En attente / Approuvé / Refusé).',
                        'Calendrier des événements internes : création, inscription et notifications aux collaborateurs.',
                        'Système de tickets support : création, assignation, suivi de résolution et clôture.',
                        'Gestion documentaire par rôles : accès conditionnel aux documents selon le profil utilisateur (Admin, Manager, Employé).'
                    ]
                },
                {
                    category: '⚙️ Architecture Technique',
                    items: [
                        'Frontend Vue.js : composants réutilisables, routing Vue Router, gestion de l\'état avec reactive refs.',
                        'Backend Node.js / Express : API REST structurée, authentification JWT, middleware de vérification des rôles.',
                        'Base de données MySQL : modélisation relationnelle, gestion des utilisateurs, tables congés / events / tickets / documents.',
                        'Versionnage GitHub : branches feature, pull requests, workflow collaboratif en équipe.'
                    ]
                },
                {
                    category: '🎓 Contexte E5 — BTS SIO SLAM',
                    items: [
                        'Projet réalisé dans le cadre de l\'Épreuve E5 du BTS SIO SLAM — situation professionnelle significative.',
                        'Démonstration de la maîtrise des compétences SLAM : développement web fullstack, gestion de base de données, travail en équipe.',
                        'Architecture séparant clairement frontend (Vue.js) et backend (Node.js) — approche professionnelle.'
                    ]
                }
            ],
            risks: [
                'Gestion des rôles et de l\'authentification : implémenter un système JWT sécurisé avec middleware de contrôle d\'accès pour chaque endpoint.',
                'Coordination équipe : synchronisation des développements frontend et backend via GitHub — gestion des branches et des conflits de merge.',
                'Conception du modèle de données : modéliser les relations complexes (utilisateurs ↔ congés ↔ managers ↔ documents) avant de commencer le développement.',
                'Montée en compétence sur Vue.js et Node.js en parallèle : deux technologies à maîtriser simultanément dans un délai de projet contraint.'
            ],
            ia_boost: null
        },

        portfolio: {
            title: 'Portfolio FNSM — Spider-Man 2 PS5',
            category: 'QUÊTE ANNEXE — PROJET PERSONNEL',
            objectif: 'Concevoir et développer un portfolio BTS SIO SLAM entièrement personnalisé, inspiré de l\'univers visuel de Spider-Man 2 PS5. L\'idée : ne pas utiliser un template générique, mais créer une expérience unique qui reflète à la fois mon identité, ma passion pour le jeu vidéo et mes compétences techniques réelles.',
            gadgets: ['HTML5 / CSS3', 'JavaScript Vanilla', 'Bootstrap', 'Figma', 'IA (Prompt Engineering)'],
            proof: {
                label: 'Voir le dépôt GitHub',
                link: 'https://github.com/Doryan92290'
            },
            statut: 'En développement continu — Portfolio présenté au jury BTS SIO SLAM.',
            details: [
                {
                    category: '💡 Concept & Genèse de l\'Idée',
                    items: [
                        'Constat de départ : la majorité des portfolios étudiants utilisent les mêmes templates Bootstrap ou Tailwind — impossible de se démarquer.',
                        'Inspiration personnelle : Spider-Man 2 PS5 est le jeu avec le design UI le plus frappant — HUD holographique, dark theme, accents rouges et bleus, clip-paths angulaires.',
                        'Idée clé : fusionner l\'esthétique gaming d\'un jeu AAA avec les exigences d\'un portfolio professionnel — montrer qu\'on peut être original ET rigoureux.',
                        'Objectif : que le jury se souvienne du portfolio comme "celui qui ressemblait à un jeu vidéo", pas comme "un portfolio parmi d\'autres".'
                    ]
                },
                {
                    category: '🎨 Direction Artistique — Référence PS5',
                    items: [
                        'Palette empruntée au jeu : --spidey-red (#E23636), --tech-blue (#00E5FF), --miles-yellow (#FFD700) sur fond #0A0A0C.',
                        'Typographie Orbitron (titres gaming) + Inter (lisibilité pro) — même dualité que Peter Parker et Miles Morales.',
                        'clip-path: polygon() sur les boutons, cartes et modales — recréer les coins coupés des interfaces HUD du jeu.',
                        'Animations CSS : toile animée en arrière-plan (repeating-conic-gradient + rotation 90s), scan pulse, learningPulse — tout en CSS pur, sans librairie.',
                        'Chaque section porte un nom thématique : "Le Hub" (accueil), "Journal des Missions" (projets), "Daily Bugle" (veille), "Archives" (documents).'
                    ]
                },
                {
                    category: '⚙️ Réalisation Technique',
                    items: [
                        'Zéro framework JavaScript — tout en Vanilla JS : Intersection Observer pour le scroll reveal, modal dynamique, arbre de compétences interactif au clic.',
                        'Arbre de compétences : chaque nœud stocke ses données en data-attributes HTML, le JS lit et affiche un panel HUD fixe au survol.',
                        'Modal Mission Log : un seul élément HTML réutilisé pour toutes les missions — les données sont injectées depuis un objet JS missionData.',
                        'Parallaxe souris sur la grille HUD du hero (mousemove event) — effet de profondeur subtil façon interface de jeu.',
                        'Maquette Figma conçue avant le code — organisation des sections, choix des couleurs, composants réutilisables.'
                    ]
                }
            ],
            risks: [
                'Créer un design original et cohérent (dark theme, clip-path, animations) sans framework CSS complexe, en HTML/CSS/JS Vanilla uniquement.',
                'Intersection Observer, scroll reveal et interactivité avancée (arbre de compétences interactif, modal) en JS pur — sans jQuery ni bibliothèque externe.',
                'Responsive design complet : adapter un design gaming sur tous les écrans (mobile, tablette, PC) sans casser le thème.',
                'Équilibrer créativité du design et lisibilité professionnelle pour un jury BTS SIO SLAM — ne pas sacrifier le fond pour la forme.',
                'Se démarquer sans tomber dans le gadget : chaque choix visuel doit rester justifiable techniquement et professionnellement.'
            ],
            ia_boost: 'Maquette conceptualisée sur Figma avant développement. Workflow assisté par IA (Claude, ChatGPT) pour l\'optimisation du CSS, la génération de contenu et le débogage — gain de productivité estimé à 30%.'
        },

        figma_restaurant: {
            title: 'Maquette UI — Restaurant Gastronomique',
            category: 'QUÊTE ANNEXE — TP IMPOSÉ 1ÈRE ANNÉE',
            objectif: 'Concevoir une maquette haute-fidélité pour un restaurant gastronomique fictif dans le cadre d\'un TP Figma encadré : définir une identité visuelle cohérente, produire des wireframes annotés et livrer un prototype interactif navigable.',
            gadgets: ['Figma', 'UX/UI', 'Maquettage', 'Prototypage', 'Charte Graphique'],
            proof: {
                label: 'Voir la maquette Figma',
                link: 'https://www.figma.com/proto/JhjOdrMcQgLD7ofeKrpzTy/restaurant?node-id=1-3'
            },
            statut: 'TP validé — 1ère année BTS SIO SLAM.',
            details: [
                {
                    category: '🎨 Identité Visuelle & Charte Graphique',
                    items: [
                        'Palette de couleurs sélectionnée selon le positionnement gastronomique haut de gamme (tons sombres, or, crème).',
                        'Typographies choisies pour refléter l\'élégance : serif pour les titres, sans-serif pour la lisibilité du corps.',
                        'Création d\'un logo simplifié et d\'icônes personnalisées alignées sur la charte.'
                    ]
                },
                {
                    category: '📐 Wireframes & Architecture d\'Information',
                    items: [
                        'Wireframes basse-fidélité pour valider la structure des pages avant la phase visuelle.',
                        'Pages conçues : Accueil, Menu (carte détaillée), À Propos, Réservation, Contact.',
                        'Navigation cohérente : header fixe avec ancres, footer avec informations pratiques.'
                    ]
                },
                {
                    category: '🔗 Prototype Interactif',
                    items: [
                        'Transitions et animations de navigation configurées dans Figma (scroll, hover states).',
                        'Prototype navigable présenté en mode Presentation Figma pour simuler l\'expérience utilisateur.',
                        'Respect des contraintes du brief : thème, nombre de pages et deadline imposés par l\'enseignant.'
                    ]
                }
            ],
            risks: [
                'Respect strict du brief imposé : thème gastronomique avec contraintes de pages et d\'éléments obligatoires à inclure.',
                'Cohérence visuelle sur l\'ensemble des pages : maintenir la charte graphique sans rupture de style.',
                'Gestion du temps encadrée : livraison dans les délais du TP avec présentation orale devant la classe.',
                'Prise en main avancée de Figma : composants réutilisables, auto-layout, états interactifs.'
            ],
            ia_boost: null
        },

        figma_events: {
            title: 'Maquette UI — Agence Événementielle',
            category: 'QUÊTE ANNEXE — PROJET LIBRE 1ÈRE ANNÉE',
            objectif: 'Concevoir librement l\'interface d\'une agence événementielle : définir son propre brief, construire une identité visuelle originale, produire un design system cohérent et un prototype interactif présentant les services de l\'agence.',
            gadgets: ['Figma', 'UX/UI', 'Design System', 'Prototypage', 'Charte Graphique'],
            proof: {
                label: 'Voir la maquette Figma',
                link: 'https://www.figma.com/proto/tqVaFp4X8u60yb1wQngRtz/evenementtielle?node-id=1-4'
            },
            statut: 'Projet libre validé — 1ère année BTS SIO SLAM.',
            details: [
                {
                    category: '🎯 Brief & Positionnement',
                    items: [
                        'Définition autonome du brief : agence spécialisée dans les événements privés et corporate (mariages, séminaires, galas).',
                        'Persona cible identifié : particuliers premium et entreprises cherchant une prestation clé en main.',
                        'Ton et univers visuel défini : élégant, moderne, avec une touche festive sans être kitsch.'
                    ]
                },
                {
                    category: '🎨 Design System & Composants',
                    items: [
                        'Construction d\'un design system : palette de couleurs, typographies, espacements et composants réutilisables.',
                        'Composants Figma : cartes de services, galerie events, témoignages clients, formulaire de contact.',
                        'Responsive design pensé dès la conception : déclinaisons mobile et desktop pour les pages principales.'
                    ]
                },
                {
                    category: '📐 Pages & Prototype',
                    items: [
                        'Pages conçues : Hero accueil, Services (mariage, corporate, privatisation), Galerie portfolio, Contact/Devis.',
                        'Call-to-action pensés pour le tunnel de conversion : bouton "Obtenir un devis" visible sur chaque page.',
                        'Prototype interactif avec transitions fluides — présenté en revue de projet devant l\'enseignant.'
                    ]
                }
            ],
            risks: [
                'Définir seul son brief et ses contraintes : nécessite une vision claire du projet dès le départ pour éviter le scope creep.',
                'Créer une identité visuelle différenciante sans tomber dans le générique — rechercher des références et savoir s\'en détacher.',
                'Maintenir la cohérence du design system sur toutes les pages sans aide extérieure ni correction de brief en cours de route.',
                'Justifier ses choix UX/UI à l\'oral : expliquer pourquoi chaque décision de design répond à un besoin utilisateur identifié.'
            ],
            ia_boost: null
        },

        figma_bowling: {
            title: 'Site Vitrine — Bowling Arcade Belle Épine',
            category: 'QUÊTE ANNEXE — INITIATIVE FREELANCE',
            objectif: 'Concevoir de manière proactive une maquette site vitrine pour un bowling avec jeux d\'arcane situé à Belle Épine, dans le but de proposer mes services en tant que développeur/designer freelance. Démarche commerciale autonome sans commande préalable.',
            gadgets: ['Figma', 'UX/UI', 'Site Vitrine', 'Design System', 'Charte Graphique'],
            proof: {
                label: 'Voir la maquette Figma',
                link: 'https://www.figma.com/proto/a7SVSPucT70YStF976mpRB/Untitled?node-id=1-2'
            },
            statut: 'Maquette livrée — Démarche client sans réponse. Expérience conservée.',
            details: [
                {
                    category: '🎯 Contexte & Démarche Commerciale',
                    items: [
                        'Identification d\'un établissement local (bowling + arcane) sans présence web convaincante.',
                        'Conception d\'une maquette complète avant tout contact — approche "show, don\'t tell" pour convaincre le client.',
                        'Prise de contact directe pour proposer la maquette et un devis de développement.'
                    ]
                },
                {
                    category: '🎨 Direction Artistique — Site Vitrine',
                    items: [
                        'Univers visuel gaming/néon : tons sombres, accents lumineux, typographies dynamiques pour coller à l\'ambiance arcade.',
                        'Sections conçues : Hero avec accroche, Activités (bowling, arcane, privatisation), Tarifs, Réservation en ligne, Contact.',
                        'Composants Figma réutilisables : cartes activités, galerie photos, formulaire de réservation.'
                    ]
                },
                {
                    category: '📐 Livrables & Vision Technique',
                    items: [
                        'Prototype interactif Figma navigable pour simuler l\'expérience utilisateur finale.',
                        'Design responsive prévu pour mobile — cible principale des visiteurs d\'un lieu de loisirs.',
                        'Vision d\'intégration : site statique HTML/CSS ou WordPress pour une livraison rapide et un budget accessible.'
                    ]
                }
            ],
            risks: [
                'Démarche non sollicitée : convaincre un client qui n\'a pas exprimé de besoin — apprentissage réel de l\'approche commerciale.',
                'Concevoir sans brief ni retour client : tout repose sur l\'analyse autonome des besoins de l\'établissement.',
                'Calibrer le niveau de qualité de la maquette pour justifier un devis sans sur-investir du temps sur une piste incertaine.',
                'Gérer l\'absence de réponse : la prospection freelance implique un taux d\'échec élevé — résilience et capacité à rebondir.'
            ],
            ia_boost: null
        },

        reservation: {
            title: 'Système de Réservation de Salles & Matériels',
            category: 'QUÊTE ANNEXE — 1ÈRE ANNÉE',
            objectif: 'Concevoir et développer une application web PHP/MySQL permettant de centraliser la gestion des réservations de ressources scolaires (salles de cours, vidéoprojecteurs, PC portables) avec détection automatique des conflits de disponibilité.',
            gadgets: ['PHP', 'MySQL', 'HTML5 / CSS3', 'JavaScript', 'GitHub'],
            proof: {
                label: 'Voir le dépôt GitHub',
                link: 'https://github.com/Doryan92290'
            },
            statut: 'Projet 1ère année BTS SIO — Validé dans le cadre du projet Piscine inter-filières.',
            details: [
                {
                    category: '🗄️ Modélisation & Base de Données',
                    items: [
                        'Distinction des entités : table `salles` (id, nom, capacité, type) et table `materiels` (id, désignation, quantité, catégorie).',
                        'Table `reservations` avec clés étrangères, date_debut / date_fin et statut — permet la gestion de créneaux.',
                        'Requête SQL anti-chevauchement : détection des conflits par comparaison des plages horaires (NOT (date_fin <= :debut OR date_debut >= :fin)).'
                    ]
                },
                {
                    category: '⚙️ Backend — PHP',
                    items: [
                        'Affichage conditionnel des cartes ressources selon disponibilité réelle (verte = libre, rouge = occupée).',
                        'Génération dynamique des cartes via boucle PHP sur résultats MySQL — aucun code HTML dupliqué.',
                        'Logique de réservation avec vérification du chevauchement avant INSERT en base.'
                    ]
                },
                {
                    category: '🎨 Frontend — Interface Cards',
                    items: [
                        'Mise en page responsive par cartes CSS (Cards) — une carte par ressource, statut injecté en classe CSS.',
                        'Barre de recherche fonctionnelle en JavaScript vanilla — filtrage temps réel sans rechargement de page.',
                        'Code couleur visuel : vert (#2ECC71) disponible, rouge (#E74C3C) indisponible.'
                    ]
                }
            ],
            risks: [
                'Modélisation de la base de données : distinguer correctement les entités Salles (unicité stricte) et Matériels (disponibilité par quantité).',
                'Gestion des conflits de réservation : implémenter une logique SQL robuste pour détecter tout chevauchement de créneaux.',
                'Collaboration inter-filières BTS SIO × BTS CIEL : coordination avec l\'équipe réseau pour le déploiement et l\'accès serveur.',
                'Workflow Git en équipe : gestion des branches, résolution de conflits de merge, revue de code entre développeurs de niveaux différents.'
            ],
            ia_boost: null
        },

        powerbi: {
            title: 'Dashboard Power BI — Marché Sneakers',
            category: 'QUÊTE ANNEXE — WORKSHOP MASTER 2',
            objectif: 'Concevoir un dashboard interactif sur Power BI dans le cadre d\'un atelier animé par des étudiants Master 2 : analyser un jeu de données réel sur le marché des sneakers, construire des visualisations pertinentes et en extraire des indicateurs clés de performance (KPIs).',
            gadgets: ['Power BI', 'DAX', 'Data Visualisation', 'Analyse de données'],
            proof: {
                label: 'Voir le projet',
                link: 'https://app.powerbi.com/groups/me/reports/155df691-e0b2-406f-8573-e590eec0f5f7/8909d64f005cb938c1e4?experience=power-bi'
            },
            statut: 'Workshop validé — Réalisé en collaboration avec des étudiants Master 2.',
            details: [
                {
                    category: '📊 Contexte & Démarche',
                    items: [
                        'Atelier organisé par des étudiants Master 2 : introduction aux concepts de la donnée, du nettoyage au reporting.',
                        'Jeu de données fourni : catalogue de sneakers avec prix, marques, modèles, volumes de ventes et popularité.',
                        'Mission : construire un dashboard complet permettant d\'analyser le marché et d\'identifier les tendances.'
                    ]
                },
                {
                    category: '📈 Visualisations & KPIs',
                    items: [
                        'KPIs synthétiques : prix moyen par marque, top 10 modèles les plus populaires, répartition par catégorie.',
                        'Graphiques interactifs : histogrammes comparatifs, courbes d\'évolution, treemaps par marque.',
                        'Filtres dynamiques : sélection par marque, gamme de prix, période — navigation intuitive dans les données.'
                    ]
                },
                {
                    category: '⚙️ Technique — Power BI & DAX',
                    items: [
                        'Modélisation des données : relations entre tables, nettoyage des valeurs nulles et doublons.',
                        'Formules DAX pour les mesures calculées : moyenne pondérée, classements, pourcentages de parts de marché.',
                        'Mise en page soignée du rapport : thème cohérent, hiérarchie visuelle claire, lisibilité en un coup d\'œil.'
                    ]
                }
            ],
            risks: [
                'Première prise en main de Power BI : découverte de l\'outil en autonomie lors d\'un atelier intense sans formation préalable.',
                'Compréhension du modèle de données : identifier les bonnes relations entre tables pour obtenir des mesures DAX cohérentes.',
                'Choix des visualisations pertinentes : éviter le "dashboard qui fait beau" — chaque graphique doit répondre à une question métier précise.',
                'Présentation des résultats : justifier ses choix d\'indicateurs et expliquer les insights identifiés devant l\'audience Master 2.'
            ],
            ia_boost: null
        },

        freedommoney: {
            title: 'Freedom Money — Application de Gestion Bancaire',
            category: 'QUÊTE ANNEXE — PROJET COURS BTS SIO',
            objectif: 'Concevoir et développer une application bureau Java en architecture MVC permettant la gestion de comptes bancaires et de personnes. L\'application démontre la maîtrise de la Programmation Orientée Objet (POO) : encapsulation, séparation des responsabilités, authentification avec gestion de rôles et manipulation de données en mémoire.',
            gadgets: ['Java', 'Eclipse IDE', 'POO', 'Architecture MVC', 'ArrayList'],
            proof: {
                label: 'Voir le code source',
                link: 'https://github.com/Doryan92290'
            },
            statut: 'Projet réalisé en cours BTS SIO SLAM — Maîtrise POO validée.',
            details: [
                {
                    category: '🏗️ Architecture MVC — Séparation des responsabilités',
                    items: [
                        'Modèle (Model) : classes Compte et Personne — encapsulation complète des attributs avec getters/setters, constructeurs paramétrés et méthodes toString().',
                        'Contrôleur (Controller) : classes OperationPersonne et OperationCompte — toute la logique métier (création, affichage, mise à jour, suppression) est isolée du reste de l\'application.',
                        'Vue (View) : menus console distincts selon le rôle — interface Admin et interface Client séparées, chacune exposant uniquement les fonctionnalités autorisées.',
                        'Principe de séparation stricte : le modèle ne connaît pas la vue, le contrôleur orchestre les deux — architecture maintenable et extensible.'
                    ]
                },
                {
                    category: '🔑 Sécurité — Authentification & Gestion des Rôles',
                    items: [
                        'Authentification par identifiant/mot de passe à l\'entrée de l\'application — vérification dans la liste des Personnes enregistrées.',
                        'Distinction de deux rôles : ADMIN (accès complet : gestion des personnes, consultation de tous les comptes, opérations globales) et CLIENT (accès restreint : consultation et opérations sur ses propres comptes uniquement).',
                        'Redirection conditionnelle après authentification : switch sur le rôle pour afficher le menu correspondant — logique de contrôle d\'accès complète.',
                        'Gestion des tentatives échouées : message d\'erreur et retour au menu de connexion sans exposition des données.'
                    ]
                },
                {
                    category: '📦 Modèle de Données — POO & Collections',
                    items: [
                        'Classe Personne : attributs encapsulés (id, nom, prénom, login, motDePasse, rôle), getters/setters, constructeur complet — démonstration de l\'encapsulation Java.',
                        'Classe Compte : attributs (numéro, solde, type, titulaire), méthodes métier (débiter, créditer, afficherSolde) — objets autonomes avec comportement propre.',
                        'Données initialisées via initData() au démarrage : peuplement des ArrayList<Personne> et ArrayList<Compte> avec des objets de test — simulation d\'une source de données persistante.',
                        'Relations entre objets : un Compte est lié à une Personne (titulaire) — modélisation d\'une association Java sans base de données.'
                    ]
                }
            ],
            risks: [
                'Maîtriser l\'architecture MVC en Java sans framework : structurer manuellement les couches Model/Controller/View et maintenir une séparation stricte des responsabilités.',
                'Implémenter une logique d\'authentification robuste avec gestion des rôles — éviter les accès non autorisés par une vérification conditionnelle correcte.',
                'Gérer les collections Java (ArrayList) efficacement : rechercher, filtrer et mettre à jour des objets sans framework ORM ni base de données.',
                'Garantir la cohérence des données en mémoire : les opérations sur les comptes (débit/crédit) modifient les objets dans la liste sans persistance — gestion de l\'état applicatif.'
            ],
            ia_boost: null,
            gallery: [
                'assets/images/Gallery_FreedomMoney1.png',
                'assets/images/Gallery_FreedomMoney2.png',
                'assets/images/Gallery_FreedomMoney3.png'
            ]
        }

    };

    // --- Logique du modal ---
    const modalOverlay   = document.getElementById('mission-modal');
    const modalCloseBtn  = document.getElementById('modal-close');

    function openModal(missionKey) {
        const data = missionData[missionKey];
        if (!data || !modalOverlay) return;

        document.getElementById('modal-category').textContent  = data.category;
        document.getElementById('modal-title').textContent     = data.title;
        document.getElementById('modal-objectif').textContent  = data.objectif;
        document.getElementById('modal-statut').textContent    = data.statut;

        // Tags gadgets
        document.getElementById('modal-gadgets').innerHTML =
            data.gadgets.map(g => `<span class="tag">${g}</span>`).join('');

        // Lien preuve de réussite
        document.getElementById('modal-proof').innerHTML =
            `<a href="${data.proof.link}" target="_blank" rel="noopener" class="modal-proof-link">${data.proof.label} →</a>`;

        // Liste des risques
        document.getElementById('modal-risks').innerHTML =
            data.risks.map(r => `<li>${r}</li>`).join('');

        // Section Galerie Photos (affiché seulement si renseigné)
        const gallerySection = document.getElementById('modal-gallery-section');
        const galleryEl = document.getElementById('modal-gallery');
        if (gallerySection && galleryEl) {
            if (data.gallery && data.gallery.length > 0) {
                galleryEl.innerHTML = data.gallery.map(src =>
                    `<div class="modal-gallery-item"><img src="${src}" alt="${data.title}" loading="lazy"></div>`
                ).join('');
                gallerySection.style.display = 'flex';
                gallerySection.style.flexDirection = 'column';
            } else {
                gallerySection.style.display = 'none';
            }
        }

        // Section Détails Techniques (affiché seulement si renseigné)
        const detailsSection = document.getElementById('modal-details-section');
        const detailsEl = document.getElementById('modal-details');
        if (data.details && data.details.length > 0) {
            detailsEl.innerHTML = data.details.map(d => `
                <div class="detail-category">
                    <div class="detail-cat-title">${d.category}</div>
                    <ul class="modal-risks">
                        ${d.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
            detailsSection.style.display = 'flex';
        } else {
            detailsSection.style.display = 'none';
        }

        // Bloc IA Boost (affiché seulement si renseigné)
        const iaBoostEl = document.getElementById('modal-ia-boost');
        if (data.ia_boost) {
            document.getElementById('modal-ia-text').textContent = data.ia_boost;
            iaBoostEl.style.display = 'flex';
        } else {
            iaBoostEl.style.display = 'none';
        }

        // Ouvre le modal
        modalOverlay.classList.add('open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Ouvrir au clic sur "Voir le dossier →"
    document.querySelectorAll('.mission-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(btn.dataset.mission);
        });
    });

    // Fermer via bouton ✕
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Fermer en cliquant sur l'overlay (en dehors du panneau)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- 11. FILTRE DES MISSIONS PAR CATÉGORIE ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const missionWrappers = document.querySelectorAll('.mission-card-wrapper');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour du bouton actif
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            missionWrappers.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('filter-hidden');
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        });
    });

    // --- 12. CARD GALLERIES — mini slideshow auto-rotatif ---
    document.querySelectorAll('.card-gallery').forEach(gallery => {
        const galleryId = gallery.id;
        const dots = document.querySelectorAll(`[data-gallery="${galleryId}"]`);
        const imgs = gallery.querySelectorAll('.gallery-img');
        if (imgs.length < 2) return;

        let current = 0;
        let timer;

        function goTo(index) {
            imgs[current].classList.remove('active');
            dots[current]?.classList.remove('active');
            current = (index + imgs.length) % imgs.length;
            imgs[current].classList.add('active');
            dots[current]?.classList.add('active');
        }

        function startTimer() {
            timer = setInterval(() => goTo(current + 1), 3200);
        }

        startTimer();

        // Pause au survol de la carte
        const missionImg = gallery.closest('.mission-img');
        if (missionImg) {
            missionImg.addEventListener('mouseenter', () => clearInterval(timer));
            missionImg.addEventListener('mouseleave', () => { clearInterval(timer); startTimer(); });
        }

        // Navigation manuelle via les points
        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                clearInterval(timer);
                goTo(i);
                startTimer();
            });
        });
    });

    // --- 13. FORMULAIRE DE CONTACT — Formspree ---
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqedrdrw';

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = document.getElementById('contact-submit');
            const status = document.getElementById('form-status');

            // État : envoi en cours
            btn.textContent = '[ TRANSMISSION EN COURS... ]';
            btn.disabled = true;
            status.className = 'form-status';

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    status.textContent = '✓ Signal envoyé — Message bien reçu. Réponse en route.';
                    status.className = 'form-status success';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data?.errors?.[0]?.message || 'Erreur serveur');
                }
            } catch {
                status.textContent = '⚠ Transmission échouée — Réessaie ou contacte directement par email.';
                status.className = 'form-status error';
            }

            // Reset bouton
            btn.textContent = 'Envoyer le signal';
            btn.disabled = false;
        });
    }

});
document.addEventListener('mousemove', (e) => {
    const overlay = document.querySelector('.hud-overlay');
    // On calcule le mouvement (très léger pour ne pas donner le mal de mer)
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    overlay.style.transform = `translate(-${x * 20}px, -${y * 20}px)`;
});
