export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // новая функциональность
        'fix', // исправление бага
        'docs', // документация
        'style', // форматирование (код не меняется)
        'refactor', // рефакторинг
        'perf', // улучшение производительности
        'test', // тесты
        'chore', // вспомогательные задачи
        'ci', // CI/CD настройки
        'build', // сборка проекта
        'revert', // откат изменений
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
