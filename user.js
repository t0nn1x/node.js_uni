// user.js

const fs = require('fs');

// Зчитуємо дані користувача з user.json
function readUserData() {
    const data = fs.readFileSync('user.json');
    return JSON.parse(data);
}

// Записуємо оновлені дані користувача назад до user.json
function writeUserData(userData) {
    fs.writeFileSync('user.json', JSON.stringify(userData, null, 4));
}

// Додавання нової мови до мовного масиву користувача
function addLanguage(argv) {
    // Валідація 
    if (!argv.title || !argv.level) {
        console.error('Error: Please provide both the language title and level.');
        return;
    }

    const userData = readUserData();
    const newLanguage = {
        title: argv.title,
        level: argv.level
    };
    userData.languages.push(newLanguage);
    writeUserData(userData);
    console.log(`Added ${newLanguage.title} (${newLanguage.level}) to languages list.`);
}

// Видалення мови з масиву 
function removeLanguage(argv) {
    // Валідація 
    if (!argv.title) {
        console.error('Error: Please provide the title of the language to be removed.');
        return;
    }

    const userData = readUserData();
    const languageIndex = userData.languages.findIndex(lang => lang.title === argv.title);
    if (languageIndex === -1) {
        console.error(`Error: Language ${argv.title} not found in languages list.`);
        return;
    }
    const removedLanguage = userData.languages.splice(languageIndex, 1)[0];
    writeUserData(userData);
    console.log(`Removed ${removedLanguage.title} (${removedLanguage.level}) from languages list.`);
}

// Відображення списку мов
function viewLanguages() {
    const userData = readUserData();
    console.log('List of user languages:');
    userData.languages.forEach(lang => console.log(`${lang.title} (${lang.level})`));
}

// Відображення деталей мови 
function getLanguage(argv) {
    // Валідація 
    if (!argv.title) {
        console.error('Error: Please provide the title of the language to be retrieved.');
        return;
    }

    const userData = readUserData();
    const language = userData.languages.find(lang => lang.title === argv.title);
    if (!language) {
        console.error(`Error: Language ${argv.title} not found in languages list.`);
        return;
    }
    console.log(`Language: ${language.title}`);
    console.log(`Level: ${language.level}`);
}

module.exports = {
    addLanguage,
    removeLanguage,
    viewLanguages,
    getLanguage
};

