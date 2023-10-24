const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;
const APP_ID = 51765543;

export default {
  photoCache: {},

  login() {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: APP_ID,
      });

      VK.Auth.login((response) => {
        if (response.session) {
          this.token = response.session.sid;
          resolve(response);
        } else {
          console.error(response);
          reject(response);
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },

  logout() {
    return new Promise((resolve) => VK.Auth.revokeGrants(resolve));
  },
   
  async init() {
    this.friends = await this.getFriends();
    [this.me] = await this.getUsers();
  },

  callAPI(method, params) {
    params.v = 5.154;

    return new Promise((resolve, reject) => {
      VK.api(method, params, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.response);
        }
      });
    });
  },

  getUsers(ids) {
    const params = {
      fields: ['photo_50', 'photo_100']
    };

    if (ids) {
      params[user_ids] = ids;
    }

    return this.callAPI('users.get', params);
  },

  getFriends() {
    return this.callAPI('friends.get', { fields: 'photo_50, photo_100' });
  },

  getPhotos(owner) {
    return this.callAPI('photos.getAll', { owner_id: owner });
  },

  findSize(photo) {
    return photo.sizes.find((size) => size.width >= 360);
  },

  async getFriendPhotos(id) {
    let photos = this.photoCache[id];

    if (photos) {
      return photos;
    }

    photos = await this.getPhotos(id);

    this.photoCache[id] = photos;

    return photos;
  },

  getRandomElement(array) {
    if (!array || !array.length) {
      return null;
    }

    const randomIndex = parseInt(Math.random() * array.length);

    return array[randomIndex];
  },

  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = this.getRandomElement(photos.items);
    const size = this.findSize(photo);
    
    return { friend, id: photo.id, url: size.url };
  },

  async callServer(method, queryParams, body) {
    queryParams = {
      method,
      ...queryParams
    };

    const query = Object.entries(queryParams).reduce((all, [name, value]) => {
      all.push(`${name}=${encodeURIComponent(value)}`);
      return all;
    }, []).join('&');

    const params = {
      header: {
        vk_token: this.token
      }
    };

    if (body) {
      params.method = 'POST';
      params.body = JSON.stringify(body);
    }
    
    const response = await fetch(`/loft-photo/?${query}`, params);

    return response.json();
  },

  async like(photo) {
    return this.callServer('like', { photo });
  },

  async photoStats(photo) {
    return this.callServer('photoStats', { photo });
  },

  async getComments(photo) {
    return this.callServer('getComments', { photo });
  },

  async postComment(photo, text) {
    return this.callServer('like', { photo }, { text });
  },
};
