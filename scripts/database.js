import { exec } from 'child_process';
import inquirer from 'inquirer';

const commands = {
    init: 'prisma init --schema=./src/prisma/schema.prisma',
    generate: 'prisma generate --schema=./src/prisma/schema.prisma',
    push: 'prisma db push --schema=./src/prisma/schema.prisma',
    pull: 'prisma db pull --schema=./src/prisma/schema.prisma',
    studio: 'prisma studio --schema=./src/prisma/schema.prisma'
};

const questions = [
    {
        type: 'list',
        name: 'command',
        message: 'Which command would you like to execute?',
        choices: [
            {
                name: 'Initialize Prisma',
                value: 'init'
            },
            {
                name: 'Generate Prisma Client',
                value: 'generate'
            },
            {
                name: 'Push to Database',
                value: 'push'
            },
            {
                name: 'Pull Database Schema',
                value: 'pull'
            },
            {
                name: 'Run Prisma Studio',
                value: 'studio'
            }
        ]
    }
];

inquirer.prompt(questions).then(({ command }) => {
    const selectedCommand = commands[command];
    console.log(`Executing prisma command...`);

    exec(selectedCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }

        console.log(`Success: ${stdout}`);
    });
});