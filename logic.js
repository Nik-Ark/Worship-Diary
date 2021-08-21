class Prayer {
	constructor(id, pair, name, img1, img2, phone1, phone2, table) {
		this.id = id;
		this.pair = pair;
		this.name = name;
		this.img1 = img1;
		this.img2 = img2;
		this.phone1 = phone1;
		this.phone2 = phone2;
		this.table = table;
	}
}

function processPrayer(myArr) {
	let prayerTable = new Array(myArr.length);
	for (let i = 0, length = myArr.length; i < length; i++) {
		prayerTable[i] = new Array(myArr.length - 1);
		for (let j = 0, k = i + 2, end = myArr.length - 1; j < end; j++, k++) {
			const forModulo = end + 1;
			if (k === forModulo) {
				prayerTable[i][j] = k;
			} else {
				prayerTable[i][j] = k % forModulo;
			}
		}
	}

	myArr = myArr.map(function (el, ind) {
		let id = ind + 1;
		let pair = el.includes(' и ') ? true : false;
		let splitted = el.split(/\s/).filter(el => el);
		let name = (pair ? splitted.splice(0, 4) : splitted.splice(0, 3)).join(' ');
		let phones = splitted.filter(el => /\d/.test(el) && !el.includes('.'));
		let phone1 = phones.length > 0 ? splitted.splice(0, 1).toString() : null;
		let phone2 = phones.length > 1 ? splitted.splice(0, 1).toString() : null;
		let img1 = splitted.length > 0 ? splitted.splice(0, 1).toString() : null;
		let img2 = splitted.length > 0 ? splitted.splice(0, 1).toString() : null;
		if (pair && phone2 === null && phone1 !== null) {
			if (phone1.includes('SHE')) {
				phone2 = phone1.replace('SHE', '');
				phone1 = null;
			}
		}
		if (pair && img2 === null && img1 !== null) {
			if (img1.includes('SHE')) {
				img2 = img1.replace('SHE', '');
				img1 = null;
			}
		}
		let table = prayerTable[ind];

		return new Prayer(id, pair, name, img1, img2, phone1, phone2, table);
	});

	return myArr;
}

function renderHtml(myArr) {
	const inputDiv = document.querySelector('.inputDiv');
	inputDiv.style.display = 'none';

	const container = document.createElement('div');
	container.className = 'container';
	for (user of myArr) {
		const card = document.createElement('div');
		card.className = 'card';

		/* 		logic starts		*/

		const h3 = document.createElement('h3');
		h3.innerHTML = user.name;
		card.appendChild(h3);

		if (user.img1) {
			const img1 = document.createElement('img');
			img1.src = './images/he.png'; // `${./images/}user.img1`;
			card.appendChild(img1);
		}
		if (user.phone1) {
			const phone1 = document.createElement('p');
			phone1.innerHTML = user.phone1;
			card.appendChild(phone1);
		}
		if (user.img2) {
			const img2 = document.createElement('img');
			img2.src = './images/she.png'; // `${./images/}user.img2`;
			card.appendChild(img2);
		}
		if (user.phone2) {
			const phone2 = document.createElement('p');
			phone2.innerHTML = user.phone2;
			card.appendChild(phone2);
		}

		/*		 logic ends			*/

		// ADD EVENT LISTENER ON EACH CARD FOR RENDERING TABLE PURPOSE
		const id = user.id; // try instead this = user; writeTable(this.id);

		card.addEventListener('click', () => writeTable(id));

		container.appendChild(card);
	}
	document.body.appendChild(container);
}

function writeTable(id) {
	console.log(id);
}

/* FILE READING */

const button = document.querySelector('#readFileButton');
const input = document.querySelector('#inputFile');

button.addEventListener('click', function () {
	let file = input.files[0];
	let reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function () {
		let myArr = reader.result.trim().split('\n');
		myArr.sort();
		myArr = processPrayer(myArr);
		renderHtml(myArr);
	};

	reader.onerror = function () {
		console.log(reader.error);
	};
});
