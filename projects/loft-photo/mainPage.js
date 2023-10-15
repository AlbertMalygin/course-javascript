import model from './model';
import pages from './pages';
import profilePage from './profilePage';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {
    const friendPhoto = document.querySelector('.component-photo');
    const friendAvatar = document.querySelector('.component-header-photo');
    const friendName = document.querySelector('.component-header-name');
    const userPhoto = document.querySelector('.component-footer-photo');

    this.friend = friend;

    friendPhoto.style.backgroundImage = `url(${url})`;
    friendAvatar.style.backgroundImage = `url(${friend.photo_50})`;
    friendName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    userPhoto.style.backgroundImage = `url(${model.me.photo_50})`;
  },

  handleEvents() {
    const photo = document.querySelector('.component-photo');
    const friendProfileLinkBtn = document.querySelector('.component-header-profile-link');
    const userProfileLinkBtn = document.querySelector('.component-footer-container-profile-link');
    let startFrom;

    photo.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startFrom = e.pageY;
    });

    photo.addEventListener('mouseup', async (e) => {
      if (e.pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });

    photo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startFrom = e.changedTouches[0].pageY;
    });

    photo.addEventListener('touchend', async (e) => {
      if (e.changedTouches[0].pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });

    friendProfileLinkBtn.addEventListener('click', async () => {
      await profilePage.setUser(this.friend);
      pages.openPage('profile');
    });

    userProfileLinkBtn.addEventListener('click', async () => {
      await profilePage.setUser(model.me);
      pages.openPage('profile');
    });
  },
};
