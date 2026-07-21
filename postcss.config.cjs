// Empty on purpose: without a local config, postcss-load-config searches
// parent directories and can pick up an unrelated postcss/tailwind setup
// (e.g. when this branch is checked out as a worktree inside another repo).
// @astrojs/tailwind adds the tailwindcss and autoprefixer plugins itself.
module.exports = {};
