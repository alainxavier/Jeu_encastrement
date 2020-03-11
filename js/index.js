$(function () {
    //Tableau de lettre alphabétique
    var alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    //Quelques variables
    var compteur = 0;
    var score = 0;
    var etatJeu = false;
    var toucheAppuyee = false;
    var lettreLancer ='';
    var music = document.getElementById('music');
    var bruits =document.getElementById('bruit');
    var tempsDebut, tempsFin, repeter;

    //Les principales fonctions
    function demarrer () {
        $('#debut').hide(300);
        $('#titre').show();        
        $('#rebours').attr('src', 'images/rebours.gif');       
        var cRebours = setTimeout(function () {
            $('#rebours').attr('src', '');
            etatJeu = true;
            deplacerLettre ();
        }, 3000);
        musique(128, 248, true);//Lancement de la musique action
        $('#clavier').focus(); // Lancement du clavier
    }

    function arreter() {
        $('#lettre').stop().stop();
        etatJeu = false;
        musique(0, 125, true);//Lancement de la musique d'intro
    }

    function deplacerLettre () {
        if(compteur < 26) { //Gestion du tableau lettre
            var srcT = 'images/tableau_' + alphabets[compteur] + '.png';
            $('#tableau').attr('src', srcT);
            $('#lettre').animate({left: '785px', top: '112px'}, 3000, function () {
                if (alphabets[compteur] === lettreLancer) {//resultat juste
                    compteur ++;
                    score = score + compteur + 10;
                    $('.score').html(score);
                    document.getElementById('lettre').style.zIndex = 60;
                    deplacerLettreApres ();
                } else {//en cas de faute
                    $('#lettre').css({left: '660px', top: '120px'}).attr('src', 'images/triste.png');
                    musique(121, 124, false);//Lancement de la musique d'echec
                    $('#echec').show(100);
                    setTimeout(arreter, 3000);
                }            
            });
        }
        else {
            bruit(7, 6000);//musique selection
            $('#lettre').css({left: '660px', top: '120px'}).attr('src', 'images/heureux.png');
            arreter();
            $('#fin').show(100);
        }        
    }

    function deplacerLettreApres () {//2e partie de la cours des lettres
        bruit(2, 1000);//Lancement musique réussite
        $('#lettre').animate({left: '+=350px', top: '0px'}, 1000, function () {
            $('#lettre').attr('src', 'images/cube.gif').css({left: '-200px', top: '400px'});
            document.getElementById('lettre').style.zIndex = 90;
            toucheAppuyee = false;
            deplacerLettre();
        });
    }

    function reinitialiser() {
        compteur = 0;
        score = 0;
        etatJeu = false;
        toucheAppuyee = false;
        lettreLancer ='';
        $('#echec').hide();
        $('#fin').hide();
        $('#tableau').attr('src', 'images/tableau.png');
        $('#lettre').attr('src', 'images/cube.gif').css({left: '40px', top: '320px'});
        $('.score').html(score);
        demarrer();        
    }

    function musique (debut, fin, rejouer) {
        music.currentTime = debut;
        music.play();
        tempsDebut = debut;
        tempsFin = fin;
        repeter = rejouer;
        /*0-125 intro jeu
        128-280  son action
        121-124 son échec */
    }

    function bruit (debut, duree) {
        bruits.currentTime = debut;
        bruits.play();
        setTimeout(function (duree) {
            bruits.pause()
        }, duree);
        /*2-3 Passage lettre (1s)
        3-4  clic (1s)
        0-1  selection lettre (1s)
        5-11 applaudissement (6s)*/
    }

    // Lancement du jeu
    //musique(0, 125, true);Lancement de la musique d'intro (Pas necessaire)
    $('#demarrer').click(function () {//après un clic
        bruit(4.5, 1500);//musique selection
        demarrer();
    });
    /*$('#arreter').click(function () {//Clic sur arrêterf
        bruit(3, 2000);//musique selection
        arreter();
    });*/
    //Affichage des lettres appuyer
    $(document).keydown(function (touche) {
        if (etatJeu && !toucheAppuyee) {
            toucheAppuyee = (touche.key).toLowerCase();
            if ($.inArray(toucheAppuyee, alphabets) !== -1) {                
                var srcL = 'images/let_' + toucheAppuyee + '.png';
                $('#lettre').attr('src', srcL);
                lettreLancer = toucheAppuyee;
                toucheAppuyee = true;
                bruit(0, 1000);//musique selection lettre
            } else {}
        }
        else {}
    });
    $('.rejouer').click(function () {
        bruit(4.8, 1000);//musique selection
        reinitialiser();
    });

    music.addEventListener('timeupdate', function () {
        if (this.currentTime > tempsFin) {
            if (repeter) {
                musique(tempsDebut, tempsFin, repeter);
            } else {
                this.pause(); 
            }            
        }
    });
});
