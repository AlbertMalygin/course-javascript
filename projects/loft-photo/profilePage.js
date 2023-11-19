import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {
    const userPhoto = document.querySelector('.component-user-info-photo');
    const userName = document.querySelector('.component-user-info-name');
    const userPhotosList = document.querySelector('.component-user-mode-photos');
    const userFriendsList = document.querySelector('.component-user-mode-friends');
    

    this.user = user;

    userPhoto.style.backgroundImage = `url('${user.photo_100}')`;
    userName.textContent = `${user.first_name ?? ''} ${user.last_name ?? ''}`;
    
    const activePanel = localStorage.getItem('user-profile-active-panel') ?? '1';

    if (activePanel === '1') {
      userPhotosList.click();
    } else {
      userFriendsList.click();
    }    
  },

  async showPhotos() {
    const userPhotos = document.querySelector('.component-user-photos');
    const photos = await model.getPhotos(this.user.id);

    userPhotos.innerHTML = '';

    for (const photo of photos.items) {
      const imgSize = model.findSize(photo);
      const element = document.createElement('div');

      element.classList.add('component-user-photo');
      element.dataset.id = photo.id;
      element.style.backgroundImage = `url(${imgSize.url})`;
      userPhotos.append(element);
    }
  },

  async showFriends() {
    const userFriends = document.querySelector('.component-user-friends');
    const friends = await model.getFriends(this.user.id);

    userFriends.innerHTML = '';

    for (const friend of friends.items) {
      const element = document.createElement('div');
      const friendPhoto = document.createElement('div');
      const friendName = document.createElement('div');

      element.classList.add('component-user-friend');
      element.dataset.id = friend.id;
      friendPhoto.classList.add('component-user-friend-photo');
      friendPhoto.style.backgroundImage = `url(${friend.photo_100})`;
      friendPhoto.dataset.id = friend.id;
      friendName.classList.add('component-user-friend-name');
      friendName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
      friendName.dataset.id = friend.id;
      element.append(friendPhoto, friendName);
      userFriends.append(element);
    }
  },

  handleEvents() {    
    const prevPage = document.querySelector('.page-profile-back');
    const logout = document.querySelector('.page-profile-exit');
    const userPhotos = document.querySelector('.component-user-photos');
    const userFriends = document.querySelector('.component-user-friends');
    const userPhotosBtn = document.querySelector('.component-user-mode-photos');
    const userFriendsBtn = document.querySelector('.component-user-mode-friends');

    userPhotosBtn.addEventListener('click', () => {
      if (!userFriends.classList.contains('hidden')) {
        userFriends.classList.add('hidden');
      }

      this.showPhotos();
      localStorage.setItem('user-profile-active-panel', '1');
      userPhotos.classList.remove('hidden');

    });

    userFriendsBtn.addEventListener('click', () => {
      if (!userPhotos.classList.contains('hidden')) {
        userPhotos.classList.add('hidden');
      }

      this.showFriends();
      localStorage.setItem('user-profile-active-panel', '2');
      userFriends.classList.remove('hidden');
      
    });

    userFriends.addEventListener('click', async (e) => {
      const friendID = e.target.dataset.id;

      if (friendID) {
        const [friend] = await model.getUsers([friendID]);
        const friendPhotos = await model.getPhotos(friendID);
        const photo = model.getRandomElement(friendPhotos.items);
        const size = model.findSize(photo);
        const stats = await model.photoStats(photo.id);
        
        mainPage.setFriendAndPhoto(friend, photo.id, size.url, stats);
        pages.openPage('main');
      }
    });

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
        const friendPhotos = await model.getPhotos(this.user.id);
        const photo = friendPhotos.items.find(photo => photo.id == photoID);
        const size = model.findSize(photo);
        const stats = await model.photoStats(parseInt(photoID));
        
        mainPage.setFriendAndPhoto(this.user, parseInt(photoID), size.url, stats);
        pages.openPage('main');
      }
    });

  },
};