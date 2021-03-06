let czyStart = 1;	// Informuje że dopiero rozpoczynamy grę.
let gwarantowane = '0 zł';
let $rewardLine = $('.rewardLine');
let $point = $('.point'); // Kropki przy bieżcym etapie (domyślnie opacity: 0)
let $answer = $('.answer'); // 4 pola z odpowiedziami
let $circle = $('.circle');
let pytania = zaladujPytania();
let obecnePytanie = 1;
zacznijGre();
let poprawnaOdpowiedz = zadajPytanie(obecnePytanie);

/** Wykonuje wszystkie operacje niezbędne do rozpoczęcia gry*/
function zacznijGre() {
	zaladujKola(0);
	$('.endGame').click(wycofajSie);
	$circle.eq(0).click(polNaPol);
	$circle.eq(1).click(pytanieDoPublicznosci);
	$circle.eq(2).click(telefonDoPrzyjaciela);
}

/** Przetwarza pytania w formacie JSON i zwraca utworzona tablicę */
function zaladujPytania() {
	return JSON.parse(`
	[
		{
			"pytanie": "Skąd pochodzi Conan Barbarzyńca?",
			"odpowiedzA": "z Rivii",
			"odpowiedzB": "z Oz",
			"odpowiedzC": "z Mordoru",
			"odpowiedzD": "z Cimmerii",
			"poprawna": "D"
		},
		{
			"pytanie": "Odrażający drab z Kabaretu Starszych Panów dubeltówkę weźmie, wyjdzie i...",
			"odpowiedzA": "rach-ciach!",
			"odpowiedzB": "buch, buch!",
			"odpowiedzC": "z rur dwóch",
			"odpowiedzD": "bum w brzuch",
			"poprawna": "B"
		},
		{
			"pytanie": "Komiksowym 'dzieckiem' rysownika Boba Kane'a jest",
			"odpowiedzA": "Superman",
			"odpowiedzB": "Batman",
			"odpowiedzC": "Spider-Man",
			"odpowiedzD": "Captain America",
			"poprawna": "B"
		},
		{
			"pytanie": "Rybą nie jest",
			"odpowiedzA": "świnka",
			"odpowiedzB": "rozpiór",
			"odpowiedzC": "krasnopiórka",
			"odpowiedzD": "kraska",
			"poprawna": "D"
		},
		{
			"pytanie": "Kto jest mistrzem tego samego oręża, w jakim specjalizowała się mitologiczna Artemida?",
			"odpowiedzA": "Zorro",
			"odpowiedzB": "Legolas",
			"odpowiedzC": "Don Kichot",
			"odpowiedzD": "Longinus Podbipięta",
			"poprawna": "B"
		},
		{
			"pytanie": "Który aktor urodził się w roku opatentowania kinematografu braci Lumière?",
			"odpowiedzA": "Rudolph Valentino",
			"odpowiedzB": "Humphrey Bogart",
			"odpowiedzC": "Charlie Chaplin",
			"odpowiedzD": "Fred Astaire",
			"poprawna": "A"
		},
		{
			"pytanie": "Mowa w obronie poety Archiasza przeszła do historii jako jeden z najświetniejszych popisów retorycznych",
			"odpowiedzA": "Izokratesa",
			"odpowiedzB": "Cycerona",
			"odpowiedzC": "Demostenesa",
			"odpowiedzD": "Kwintyliana",
			"poprawna": "B"
		},
		{
			"pytanie": "Kto był nadwornym malarzem króla Filipa IV Habsburga?",
			"odpowiedzA": "Marcello Bacciarelli",
			"odpowiedzB": "Jan van Eyck",
			"odpowiedzC": "Diego Velázquez",
			"odpowiedzD": "Jacques-Louis David",
			"poprawna": "C"
		},
		{
			"pytanie": "Likier maraskino produkuje się z maraski, czyli odmiany",
			"odpowiedzA": "wiśni",
			"odpowiedzB": "jabłoni",
			"odpowiedzC": "figi",
			"odpowiedzD": "gruszy",
			"poprawna": "A"
		},
		{
			"pytanie": "Z gry na jakim instrumencie słynie Czesław Mozil?",
			"odpowiedzA": "na kornecie",
			"odpowiedzB": "na akordeonie",
			"odpowiedzC": "a djembe",
			"odpowiedzD": "na ksylofonie",
			"poprawna": "B"
		},
		{
			"pytanie": "Który utwór Juliusza Słowackiego napisany jest prozą?",
			"odpowiedzA": "'Godzina myśli'",
			"odpowiedzB": "'W Szwajcarii'",
			"odpowiedzC": "'Anhelli'",
			"odpowiedzD": "'Arab'",
			"poprawna": "C"
		},
		{
			"pytanie": "Płetwą grzbietową nie pruje wody",
			"odpowiedzA": "długoszpar",
			"odpowiedzB": "kosogon",
			"odpowiedzC": "orka",
			"odpowiedzD": "wal grenlandzki",
			"poprawna": "D"
		}
	]
	`);
}

/** Zadaje pytanie o podanym numerze i zwraca odpowiedź na nie */
function zadajPytanie(nr_pytania) {

	if(czyStart === 0) {
		wylaczAudio();
		wlaczMuzykeWTle();
	}
	else {
		czyStart = 0;
		setTimeout(wlaczMuzykeWTle, 3000);
	}


	$rewardLine.eq( 12 - nr_pytania ).addClass('rewardActualLine');
	$point.eq( 12 - nr_pytania ).css('opacity', '1');
	$answer.find('span').css('opacity', 1);

	let pytanie = pytania[nr_pytania-1];
	$('#question').text(pytanie.pytanie);
	$('#A span:last-child').text(pytanie.odpowiedzA);
	$('#B span:last-child').text(pytanie.odpowiedzB);
	$('#C span:last-child').text(pytanie.odpowiedzC);
	$('#D span:last-child').text(pytanie.odpowiedzD);

	$answer.bind('click', zaznaczOdpowiedz);

	return pytanie.poprawna;
}

/** Zaznacza wybrana odpowiedź i wywołuje funkcje sprawdzajaca */
function zaznaczOdpowiedz() {
	wylaczAudio();
	if ($(this).hasClass('answerChecked')) { // Potwierdzenie wyboru
		$('#wybor_start').get(0).pause();
		$('#wybor_loop').get(0).pause();

		$answer.unbind('click');
		sprawdzOdpowiedz($(this).attr('id'));


	} else {	// Wybór po raz pierwszy
		$answer.attr('class', 'answer')
		$(this).addClass('answerChecked');

		$('#wybor_start').get(0).play();
		window.setTimeout(function(){
			if($('#dobra_odpowiedz').get(0).paused && $('#bledna_odpowiedz').get(0).paused){
				$('#wybor_loop').get(0).loop = true;
				$('#wybor_loop').get(0).play();
			}
		}, 2500);
	}
}

/** Sprawdza czy przekazana odpowiedź jest prawidłowa i podejmuje kolejne kroki */
function sprawdzOdpowiedz(odpowiedz) {
	wylaczAudio();
	$(`#${poprawnaOdpowiedz}`).removeClass('answerChecked').addClass('answerCorrect');
		if (odpowiedz === poprawnaOdpowiedz) {
			if (obecnePytanie !== 12) {
				$('#dobra_odpowiedz').get(0).play();
				window.setTimeout(grajDalej, 9000);
			} else {
				$('#milion').get(0).play();
				koniecGry(1);
			}
		} else {
			$('#bledna_odpowiedz').get(0).play();
			koniecGry(-1);
		}
}

/** Usuwa klasy aktywności pól, wywołuje kolejne pytanie i ewentualnie zmienia kwotę gwarantowaną */
function grajDalej() {

	if (obecnePytanie === 2) gwarantowane = '1000 zł';
	if (obecnePytanie === 7) gwarantowane = '40 000 zł';

	obecnePytanie++;
	$answer.attr('class', 'answer');
	$rewardLine.removeClass('rewardActualLine');
	poprawnaOdpowiedz = zadajPytanie(obecnePytanie);

}

/** Wywołuje koniecGry(0) */
function wycofajSie() {
	wylaczAudio();
	$('#wycofanie').get(0).play();
	koniecGry(0);
}

/** Usuwa obserwatory i kończy grę w zależności od wartości number. przegrana = -1, wycofanie = 0, wygrana = 1 */
function koniecGry(number) {
	$answer.unbind('click');
	$('.endGame').unbind('click');
	$circle.unbind('click');

	if (number === -1) {
		$('.gameArea').css('background', 'url("img/hubert/h (go).jpeg") no-repeat top center');
		$('#question').html(`Niestety nie masz racji. Jednak wspaniale się z Tobą grało. Wygrywasz ${gwarantowane}`);
	} else if (number === 0) {
		$(`#${poprawnaOdpowiedz}`).removeClass('answerChecked').addClass('answerCorrect');

		let wygrana = $rewardLine.eq(13 - obecnePytanie).find('.reward').text() || '0 zł';

		$('.gameArea').css('background', 'url("img/hubert/h (q).jpg") no-repeat center center');
		$('#question').html(`Skoro taka jest Twoja decyzja nie pozostaje mi nic innego, jak podziękowac Tobie za grę. Brawo! Wygrywasz ${wygrana}`);
	} else if (number === 1) {
		$('.gameArea').css('background', 'url("img/hubert/h (w).jpg") no-repeat center center');
		$('#question').html(`Udało Ci się! Moje gratulacje, wygrywasz 1 000 000 zł !`);
	}

	$(document).click(function(){
		$('body').click(function(){
			location.reload();
		});
		setTimeout(function(){
			$('body').unbind('click');
		}, 500);
	});
}

/** Aktywacja koła ratunkowego pół na pół */
function polNaPol() {
	$(this).unbind('click');
	$(this).attr('src', 'img/circles/circle1-not.png');
	$('.circle:nth-child(1):hover').css({'width': '25%', 'cursor': 'default'});
	$('#50_50').get(0).play();

	let numbers = [0, 1, 2];
	shuffle(numbers);

	$answer.not(`#${poprawnaOdpowiedz}`).each(function(index){
		if(numbers[index] !== 0) {
			$(this).find('span').css('opacity', '0');
		}
	});
}

/** Aktywacja koła ratunkowego pytanie do publiczności */
function pytanieDoPublicznosci() {
	$(this).unbind('click');
	$(this).attr('src', 'img/circles/circle2-not.png');
	$('.circle:nth-child(2):hover').css({'width': '25%', 'cursor': 'default'});

	$('#publicznosc1').get(0).play();
	setTimeout(function(){
		$('#publicznosc2').get(0).play();
		setTimeout(function(){
			$('#publicznosc3').get(0).play();
			setTimeout(function(){
				let answersTable = [0,0,0,0];

				for (let i = 0; i < 100; i++) {
					let number = Math.random();
					let number2 = Math.random();
					if (number2 > 0.5) { // Publicznośc z grubsza pewna
						if (number >= 0.5) {answersTable[0]++}
						else if (number >= 0.2 && number < 0.5) {answersTable[1]++}
						else if (number >= 0.1 && number < 0.2 ) {answersTable[2]++}
						else {answersTable[3]++}
					} else if (number2 < 0.3) { // Publicznosc w sumie to nie wie
						if (number >= 0.73) {answersTable[0]++}
						else if (number >= 0.5 && number < 0.73) {answersTable[1]++}
						else if (number >= 0.25 && number < 0.5 ) {answersTable[2]++}
						else {answersTable[3]++}
					} else {	// Wahanie miedzy 2 odpowiedzimi z dominacja poprawnej
						if (number >= 0.5) {answersTable[0]++}
						else if (number >= 0.06 && number < 0.5) {answersTable[1]++}
						else if (number >= 0.03 && number < 0.06 ) {answersTable[2]++}
						else {answersTable[3]++}
					}
				}

				let numbers = [1, 2, 3];
				shuffle(numbers);

				$answer.not(`#${poprawnaOdpowiedz}`).each(function(index){
						$(this).find('span:last-child').append(` ${answersTable[numbers[index]]}%`);
				});

				$answer.filter(`#${poprawnaOdpowiedz}`).find(' span:last-child').append(` ${answersTable[0]}%`);
			}, 300);
		}, 2000);
	}, 1000);
}

/** Aktywacja koła ratunkowego telefon do przyjaciela */
function telefonDoPrzyjaciela() {
	$(this).unbind('click');
	$(this).attr('src', 'img/circles/circle3-not.png');
	$('.circle:nth-child(3):hover').css({'width': '25%', 'cursor': 'default'});

	$('#telefon1').get(0).play();
	setTimeout(function(){
		$('#telefon2').get(0).loop = true;
		$('#telefon2').get(0).play();
		$('body').click(function(){
			$('#telefon2').get(0).pause();
			if(!!document.getElementById('telefon3')){
				$('#telefon3').get(0).play();
				setTimeout(function(){$('#telefon3').remove();}, 1000);
			};
		});
	}, 1000);
}

/** Wczytuje po kolei koła ratunkowe */
function zaladujKola(nr_kola) {
	$(`#zaladuj_kolo${(nr_kola+1)}`).get(0).play();
	$circle.eq(nr_kola).fadeIn(300);
	nr_kola++;
	if (nr_kola < 3) {
		window.setTimeout(function(){
			zaladujKola(nr_kola);
		}, 1000);
	}
}

/** Wyłącza wszystkie odgrywane dźwięki */
function wylaczAudio() {
	$('audio[id!=telefon3]').each(function(index){
		$(this).get(0).pause();
		$(this).get(0).currentTime = 0;
	});
}

/** Uruchamia muzyke w tle */
function wlaczMuzykeWTle() {

	if($('.tlo').get(0).loop == false) {
		$('.tlo').each(function(index){
			$(this).get(0).loop = true;
		});
	}

	let withBackground = Math.random();
	if (withBackground > 0.66) {$('.tlo').get(0).play();}
	else if (withBackground < 0.33) {$('.tlo').get(1).play();}
	else {$('.tlo').get(2).play();}
}

/** Zmienia kolejność elementów w tablicy na losową */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
