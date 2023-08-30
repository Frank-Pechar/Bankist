# Banking App 
## JavaScript Project
## Description of App Functionality, Features, and Methods

Javascript coding project I completed from Udemy - The Complete Javascript Course 2023: From Zero to Expert by Jonas Schmedtmann. After coding this project through the course I then added numerous other enhancements and refinements including a fix to a bug in the original project (project did not include sorting date array along with amounts array). Added comments to code for educational purposes. I also added responsive layout CSS code for mobile devices (original course project only provided for a desktop display). 

App can be run from: https://frank-pechar-js-bankist.netlify.app/

## App Description

This App tracks and summarizes deposits and withdrawals using built in deposit and withdrawal transaction test data. Transferring funds and receiving loans will automatically update: Deposit and withdrawal transaction detail data, account balance, total deposits, total withdrawals and total interest. Transferring funds will cause a withdrawal from account and a deposit to the receiving account. Application also features the ability to close the account, sorting transaction data by deposit amounts, and a logout timer.

## App Functionality

Display Account Information
- Page loads with a default account
- Default account is user=fp, PIN=2222
- Can display another account for user=js, PIN=1111
- NOTE: MUST USE LOWERCASE LETTERS FOR USERID

Transfer Funds to Another Account
- Enter userid for transfer to account, and the amount

Request a Loan
- Enter amount requested (must have a deposit for at least 10% of the loan amount)

Close Account
- Enter userid and PIN

Sort deposits by amount
- Click the &lt;SORT&gt; Button

## Javascript Features and Methods Used

- Extensive use of a wide variety of Array methods
- Extensive use of method chaining 
- Sort and unsort functionality 

List of some methods and properties used: 
- Array methods used: forEach(), map(), find(), findIndex(), filter(), reduce(), some(), sort(), splice(), slice(), split(), join(), push()
- Date() constructor and Date().toISOString() method
- Intl.DateTimeFormat(locale).format() to format for locale and also date calculations
- Intl.NumberFormat().format() for currency formatting for locale and type
- Math.round(), Math.abs(), Math.trunc(), Math.floor()
- Timer methods used: setInterval(), setTimeout(), clearInterval()
- Also used: String(), padStart(), toLowerCase(), blur() methods
