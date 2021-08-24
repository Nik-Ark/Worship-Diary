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

function processPrayers(myArr) {
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
	const leftSection = document.createElement('section');
	leftSection.className = 'left';
	const rightSection = document.createElement('section');
	rightSection.className = 'right';
	let leftPage = 0;
	let rightPage = 0;
	for (user of myArr) {
		const card = document.createElement('div');
		card.className = 'card';

		const h2 = document.createElement('h2');
		h2.innerHTML = `${user.id}. ${user.name}`;
		card.appendChild(h2);

		if (user.img1) {
			const img1 = document.createElement('img');
			img1.className = 'image1';
			img1.src = `./images/${user.img1}`;
			card.appendChild(img1);
		}

		const phone1 = document.createElement('div');
		phone1.className = 'phone1';
		for (let i = 0; i < 4; i++) {
			const span = document.createElement('span');
			span.innerHTML = '____________________________________';
			phone1.appendChild(span);
		}
		if (user.phone1) {
			const p = document.createElement('p');
			p.innerHTML = `${user.phone1.substr(0, 1)} ${user.phone1.substr(
				1,
				3
			)} ${user.phone1.substr(4, 3)} ${user.phone1.substr(
				7,
				2
			)} ${user.phone1.substr(9, 2)}`;
			phone1.appendChild(p);
		}
		card.appendChild(phone1);

		if (user.pair && (user.img2 || user.phone2)) {
			if (user.img2) {
				const img2 = document.createElement('img');
				img2.className = 'image2';
				img2.src = `./images/${user.img2}`;
				card.appendChild(img2);
			}

			const phone2 = document.createElement('div');
			phone2.className = 'phone2';
			for (let i = 0; i < 4; i++) {
				const span = document.createElement('span');
				span.innerHTML = '____________________________________';
				phone2.appendChild(span);
			}
			if (user.phone2) {
				const p = document.createElement('p');
				p.innerHTML = `${user.phone2.substr(0, 1)} ${user.phone2.substr(
					1,
					3
				)} ${user.phone2.substr(4, 3)} ${user.phone2.substr(
					7,
					2
				)} ${user.phone2.substr(9, 2)}`;
				phone2.appendChild(p);
			}
			card.appendChild(phone2);
		}

		const id = user.id; // try instead this = user; writeTable(this.id);
		const table = user.table;
		card.addEventListener('click', () => writeTable(id, table));

		if (id % 2) {
			leftSection.appendChild(card);
		} else {
			rightSection.appendChild(card);
		}

		if (user.id % 2) {
			leftPage += user.img1 || user.phone1 ? 54 : 45;
			leftPage += user.pair && (user.img2 || user.phone2) ? 40 : 0;
		} else {
			rightPage += user.img1 || user.phone1 ? 54 : 45;
			rightPage += user.pair && (user.img2 || user.phone2) ? 40 : 0;
		}

		if (leftPage >= 136) {
			console.log('leftPage: ', leftPage);
			for (
				let i = 0, l = leftPage === 144 ? 2 : leftPage === 162 ? 1 : 3;
				i < l;
				i++
			) {
				let br = document.createElement('br');
				leftSection.appendChild(br);
			}
			leftPage = 0;
		}

		if (rightPage >= 136) {
			console.log('rightPage: ', rightPage);
			for (
				let i = 0, l = rightPage === 144 ? 2 : rightPage === 162 ? 1 : 3;
				i < l;
				i++
			) {
				let br = document.createElement('br');
				rightSection.appendChild(br);
			}
			rightPage = 0;
		}
	}
	container.appendChild(leftSection);
	container.appendChild(rightSection);
	document.body.appendChild(container);
}

function writeTable(id, table) {
	alert(`user id: ${id}${'\n'}${table}`);
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
		myArr = processPrayers(myArr);
		renderHtml(myArr);
	};

	reader.onerror = function () {
		console.log(reader.error);
	};
});
