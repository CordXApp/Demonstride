module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'chore', 'style', 'refactor', 'patch', 'revert', 'update', 'build']
        ],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'scope-empty': [2, 'never']
    }
}
