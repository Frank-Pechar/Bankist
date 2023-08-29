'use strict';

// mock account data
const account1 = {
  owner: 'Jonas Schmedtmann',
  pin: 1111,
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  interestRate: 1.2,
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Frank Pechar',
  pin: 2222,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  interestRate: 1.5,
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const TIMEOUTSECONDS = 300; // logout after 5 minutes of no activity

// format date for locale and for recency
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// format currency value for locale and currency type
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// display transaction data
const displayMovements = function (acc, sort = false) {
  // clear DOM movements render area
  containerMovements.innerHTML = '';

  let movs = [];
  let movsDates = [];

  if (sort) {
    // if sort then combine amounts and dates arrays together, sort by amount, then seperate them again
    const combinedArrays = [];
    for (let i = 0; i < acc.movements.length; i++) {
      combinedArrays.push({
        amount: acc.movements[i],
        date: acc.movementsDates[i],
      });
    }
    combinedArrays.sort((a, b) => a.amount - b.amount);
    for (let i = 0; i < combinedArrays.length; i++) {
      movs[i] = combinedArrays[i].amount;
      movsDates[i] = combinedArrays[i].date;
    }
  } else {
    movs = acc.movements;
    movsDates = acc.movementsDates;
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // retrieve corresponding date for movement and formate it
    const date = new Date(movsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // format currency
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // render movement
    // dynamically assigns deposit or withdraw descriptor to css class name for color code formatting
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// loop through movements array and calc and display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Calc and Display Summary Data
const calcDisplaySummary = function (acc) {
  // calculate total deposits
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // calculate total withdrawals
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // calculate total interest (interest on each deposit must be at least $1 to be included)
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Create Username with Name Initials
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
// Create User Names on Initial Load of Page
createUsernames(accounts);

// Update and Display All Account Data
const updateUI = function (acc) {
  // display transaction detail
  displayMovements(acc);

  // calc and display current balance
  calcDisplayBalance(acc);

  // calc and display summary total - deposits, withdrawals, interest
  calcDisplaySummary(acc);
};

// Logout Timer Function
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = TIMEOUTSECONDS;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Login
let currentAccount, timer;

const processAccountHandler = function (e) {
  if (e.type === 'load') {
    // initial page load - render mock data
    inputLoginUsername.value = 'fp';
    inputLoginPin.value = '2222';
  } else {
    // e.type === 'click'
    e.preventDefault();
  }

  // load currentAccount with matching entry from accounts array
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // if there is a currentAccount and entered pin is correct
  if (currentAccount?.pin === +inputLoginPin.value) {
    // welcome message with first name
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // create now object with current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // display formatted now date object
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear username and pin input values
    inputLoginUsername.value = inputLoginPin.value = '';
    // remove focus from pin input field
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
};

btnLogin.addEventListener('click', processAccountHandler);

window.addEventListener('load', processAccountHandler);

// Transfer to Another Account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  // find account to transfer to
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  // validate transfer data
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // update movements arrays for current account and receiver account
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // refresh ui with new data
    updateUI(currentAccount);

    // reset logout timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Loan Request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // must have a deposit amount >= 10% of requested loan amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // if so - add loan amount to movements array and date to movementsDates array
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // refresh account data on page
      updateUI(currentAccount);

      // restart timer
      clearInterval(timer);
      timer = startLogOutTimer();
      // provide a simulated loan approval process time
    }, 1000);
  }
  inputLoanAmount.value = '';
});

// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // if matching account found remove it from the accounts array and reset login screen
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort Transactions by Amount or  Date (Default)
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
