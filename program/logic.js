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
	/* 			DEMONSTRATION OF PRAYER'S TABLE MATRIX				*/
	console.log(prayerTable);

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
			if (user.phone1.includes('-')) {
				p.innerHTML = `${user.phone1.substr(0, 3)} ${user.phone1.substr(
					3,
					1
				)} ${user.phone1.substr(4, 2)} ${user.phone1.substr(
					6,
					1
				)} ${user.phone1.substr(7, 2)}`;
			} else {
				p.innerHTML = `${user.phone1.substr(0, 1)} ${user.phone1.substr(
					1,
					3
				)} ${user.phone1.substr(4, 3)} ${user.phone1.substr(
					7,
					2
				)} ${user.phone1.substr(9, 2)}`;
			}
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
				if (user.phone2.includes('-')) {
					p.innerHTML = `${user.phone2.substr(0, 3)} ${user.phone2.substr(
						3,
						1
					)} ${user.phone2.substr(4, 2)} ${user.phone2.substr(
						6,
						1
					)} ${user.phone2.substr(7, 2)}`;
				} else {
					p.innerHTML = `${user.phone2.substr(0, 1)} ${user.phone2.substr(
						1,
						3
					)} ${user.phone2.substr(4, 3)} ${user.phone2.substr(
						7,
						2
					)} ${user.phone2.substr(9, 2)}`;
				}
				phone2.appendChild(p);
			}
			card.appendChild(phone2);
		}

		const table = user.table;
		const name = user.name;
		const id = user.id;
		card.addEventListener('click', () => writeTable(id, name, table));

		if (user.id % 2) {
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

		/*
			Подсчитать общую вместимость страницы в соответствии с форматом печати:
			(const pageSize = ?)
			значение, сумма card's после которого возможен выход за current Page:
			(const safeMaxSum = ?)
			после заполнение оставшейся страницы буффером (<br>)
			Сохранять прошлую сумму card's в переменную с которой сравнивать ???
			(let prevPage) ??? (currPage)
			текущий размер card's и в соответствии с этим делать вывод
			какое количество <br> добавлять.

			Если бы с помощью <br> я мог сдвинуть следующие card's ровно на начало
			следующей страницы, не нужно было бы считать значение (prevPage)

			* HINT:
			Заполнить всю страницу А4 <br>'ами и посчитать сколько их помещается на А4
			162 / maxValueOf<br>onPage результатом будет <br> в mm от card's.
			теперь можно динамически вычеслять необходимое кол-во <br>'ов.
		*/

		/*							PAGE'S ALIGN ALGORITHM							*/
		/*
		if (leftPage >= 135) {
			console.log('leftPage: ', leftPage);
			for (
				let i = 0,
					l =
						leftPage === 162
							? 1
							: leftPage === 153
							? 1
							: leftPage === 148
							? 4
							: leftPage === 144
							? 3
							: leftPage === 139
							? 6
							: 6;
				i < l;
				i++
			) {
				let br = document.createElement('br');
				leftSection.appendChild(br);
			}
			leftPage = 0;
		}

		if (rightPage >= 135) {
			console.log('rightPage: ', rightPage);
			for (
				let i = 0,
					l =
						rightPage === 162
							? 1
							: rightPage === 153
							? 1
							: rightPage === 148
							? 4
							: rightPage === 144
							? 3
							: rightPage === 139
							? 5
							: 6;
				i < l;
				i++
			) {
				let br = document.createElement('br');
				rightSection.appendChild(br);
			}
			rightPage = 0;
		}
		*/
	}
	container.appendChild(leftSection);
	container.appendChild(rightSection);
	document.body.appendChild(container);
}

function writeTable(id, name, table) {
	const container = document.querySelector('.container');
	const calendar = document.querySelector('.calendar');
	const prayFor = document.querySelectorAll('tr.prayFor > td');
	const button = document.querySelector('#goBack');
	const header = document.querySelector('#calendarHeader');
	let days = Array.from(prayFor);

	const length = table.length;

	days = days.map((el, ind) => {
		el.innerHTML = table[(currInd = ind % length)];
	});

	header.innerHTML = `${id}. ${name}:`;

	container.style.display = 'none';
	calendar.style.display = 'inline';
	calendar.scrollIntoView({
		behavior: 'smooth',
		block: 'start', // start, center, end, nearest
	});

	button.addEventListener('click', function () {
		calendar.style.display = 'none';
		container.style.display = 'flex';
	});
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
