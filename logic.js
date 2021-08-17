class People {
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

function processPeople(myArr) {
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

		return new People(id, pair, name, img1, img2, phone1, phone2, table);
	});

	console.log(myArr);
}

/* FILE READING */

const button = document.querySelector('#readFileButton');
const input = document.querySelector('#inputFile');

button.addEventListener('click', function () {
	let file = input.files[0];
	let reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function () {
		const myArr = reader.result.trim().split('\n');
		myArr.sort();
		processPeople(myArr);
	};

	reader.onerror = function () {
		console.log(reader.error);
	};
});
