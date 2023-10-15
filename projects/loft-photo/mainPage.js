import model from './model';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {
    const componentPhoto = document.querySelector('.component-photo');
    const componentHeaderPhoto = document.querySelector('.component-header-photo');
    const componentHeaderName = document.querySelector('.component-header-name');

    componentPhoto.style.backgroundImage = `url(${url})`;
    componentHeaderPhoto.style.backgroundImage = `url(${friend.photo_50})`;
    componentHeaderName.textContent = `${friend.first_name} ${friend.last_name}`;
  },

  handleEvents() {
    const componentPhoto = document.querySelector('.component-photo');
    let startFrom;

    componentPhoto.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startFrom = e.pageY;
    });

    componentPhoto.addEventListener('mouseup', async (e) => {
      if (e.pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });

    componentPhoto.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startFrom = e.changedTouches[0].pageY;
    });

    componentPhoto.addEventListener('touchend', async (e) => {
      if (e.changedTouches[0].pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });
  },
};
