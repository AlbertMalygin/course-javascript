// eslint-disable-next-line no-unused-vars
import photosDB from './photos.json';
// eslint-disable-next-line no-unused-vars
import friendsDB from './friends.json';

export default {
  getRandomElement(array) {
    if (!array || !array.length) {
      return null;
    }

    const randomIndex = parseInt(Math.random() * array.length);

    return array[randomIndex];
  },

  getNextPhoto() {
    const friend = this.getRandomElement(friendsDB);
    const photos = photosDB[friend.id];
    const randomPhoto = this.getRandomElement(photos);

    return { friend, url: randomPhoto.url };
  },
};
