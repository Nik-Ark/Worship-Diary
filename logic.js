/* THIS OBJECTS ARRAY WILL BE COMING FROM INPUT INTERFACE */
const users = [
	{ name: 'Тихий Тарас Эрастович', phone: 89046162982 },
	{ name: 'Ярмолов Исаак Аврамович', phone: 89116992392830 },
	{ name: 'Бананов Ярослав Бананович', phone: 89500490867 },
	{ name: 'Баранов Иван Васильевич', phone: 89992223345 },
	{ name: 'Бананов Алексей Борисович', phone: 79313698147 },
	{ name: 'Акимовы Акакий и Лариса', phone: 89096665533 },
	{ name: 'Щербакова Кристина Олеговна', phone: 87776662233 },
];

/* WHEN ARRAY OF USER OBJECTS WITH NAMES AND INFO RECEIVED */

/* SORTING BY NAMES */
users.sort(function (a, b) {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
});

/* ID'S ASSIGNING */
users.map((el, ind) => (el.id = ind + 1));

/* TABLE FOR ALL PRAYERS FOR ALL USERS CREATING */
let prayerTable = new Array(users.length);
for (let i = 0, length = users.length; i < length; i++) {
	prayerTable[i] = new Array(users.length - 1);
	for (let j = 0, k = i + 2, end = users.length - 1; j < end; j++, k++) {
		const forModulo = end + 1;
		if (k === forModulo) {
			prayerTable[i][j] = k;
		} else {
			prayerTable[i][j] = k % forModulo;
		}
	}
}

console.log(users);
console.log(prayerTable);
