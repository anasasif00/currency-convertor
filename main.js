import inquirer from 'inquirer';
import chalk from 'chalk';
const fakeExchangeRates = [
    { currency: 'USD', rate: 1.0 },
    { currency: 'EUR', rate: 0.85 },
    { currency: 'GBP', rate: 0.73 },
    { currency: 'PKR', rate: 284.75 },
    { currency: 'INR', rate: 74.23 },
];
async function fetchExchangeRates() {
    try {
        return fakeExchangeRates;
    }
    catch (error) {
        throw new Error('Failed to fetch exchange rates.');
    }
}
async function convertCurrency() {
    const exchangeRates = await fetchExchangeRates();
    const repeatTask = async () => {
        const questions = [
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgGrey.bold('Enter the amount to convert:'),
                validate: (value) => {
                    // Check if the input contains only digits
                    if (/^\d+(\.\d+)?$/.test(value)) {
                        return true;
                    }
                    return 'Please enter a valid numeric amount.';
                },
            },
            {
                type: 'list',
                name: 'fromCurrency',
                message: chalk.redBright.bold('Select the source currency:'),
                choices: exchangeRates.map(rate => rate.currency),
            },
            {
                type: 'list',
                name: 'toCurrency',
                message: chalk.bgGray.bold('Select the target currency:'),
                choices: exchangeRates.map(rate => rate.currency),
            },
        ];
        const answers = await inquirer.prompt(questions);
        const { amount, fromCurrency, toCurrency } = answers;
        const fromRate = exchangeRates.find(rate => rate.currency === fromCurrency)?.rate || 1;
        const toRate = exchangeRates.find(rate => rate.currency === toCurrency)?.rate || 1;
        const convertedAmount = (parseFloat(amount) / fromRate) * toRate;
        console.log(chalk.greenBright(`${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}`));
        setTimeout(async () => {
            const { repeat } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'repeat',
                    message: chalk.bgGray.bold('Do you want to perform another conversion?'),
                },
            ]);
            if (repeat) {
                await repeatTask();
            }
            else {
                console.log('Exiting the app.');
            }
        }, 2000);
    };
    await repeatTask();
}
convertCurrency();
