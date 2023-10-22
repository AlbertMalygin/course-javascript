import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {
    const userPhoto = document.querySelector('.component-user-info-photo');
    const userName = document.querySelector('.component-user-info-name');
    const userPhotos = document.querySelector('.component-user-photos');
    const photos = await model.getPhotos(user.id);

    this.user = user;

    userPhoto.style.backgroundImage = `url('${user.photo_100}')`;
    userName.textContent = `${user.first_name ?? ''} ${user.last_name ?? ''}`;
    userPhotos.innerHTML = '';

    for (const photo of photos.items) {
      const imgSize = model.findSize(photo);
      const element = document.createElement('div');

      element.classList.add('component-user-photo');
      element.dataset.id = photo.id;
      element.dataset.url = imgSize.url;
      element.style.backgroundImage = `url(${imgSize.url})`;
      
      userPhotos.append(element);
    }
  },

  handleEvents() {    
    const prevPage = document.querySelector('.page-profile-back');
    const logout = document.querySelector('.page-profile-exit');
    const userPhotos = document.querySelector('.component-user-photos');

    prevPage.addEventListener('click', async () => {
      pages.openPage('main');
    });

    logout.addEventListener('click', async () => {
      await model.logout();
      pages.openPage('login');
    });

    userPhotos.addEventListener('click', async (e) => {
      if (e.target.classList.contains('component-user-photo')) {
        const photoID = e.target.dataset.id;
        const photoURL = e.target.dataset.url;
        
        mainPage.setFriendAndPhoto(this.user, photoID, photoURL);
        pages.openPage('main');
      }
    });

  },
};