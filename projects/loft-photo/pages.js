const pagesMap = {
  login: '.page-login',
  main: '.page-main',
  profile: '.page-profile',
};

let currentPage = null;

export default {
  openPage(name) {
    const element = document.querySelector(pagesMap[name]);

    currentPage?.classList.add('hidden');
    currentPage = element;
    currentPage.classList.remove('hidden');
  },
};
