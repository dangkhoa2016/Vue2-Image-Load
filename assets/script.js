
(async function () {

  // variables

  var app = { html: '' };

  const { loadModule } = window['vue2-sfc-loader'];

  const options = {
    moduleCache: {
      vue: Vue,
    },
    async getFile(url) {
      const res = await fetch(url);
      if (!res.ok)
        throw Object.assign(new Error(url + ' ' + res.statusText), { res });
      return await res.text();
    },
    addStyle(textContent) {
      const style = Object.assign(document.createElement('style'), { textContent });
      const ref = document.head.getElementsByTagName('style')[0] || null;
      document.head.insertBefore(style, ref);
    },
    log(type, ...args) {
      console[type](...args);
    },
  };

  // variables


  // functions

  const loadHtml = function (file) {
    return new Promise((resolve, reject) => {
      fetch(file)
        .then(res => res.text())
        .then(html => {
          app.html = html;
          resolve();
        }).catch(ex => console.log(ex));
    });
  };

  const loadJs = function (file) {
    return new Promise((resolve, reject) => {
      // console.log(`loading file: ${file}`);
      fetch(file)
        .then(res => res.text())
        .then(js => {
          eval(js);
          resolve();
        }).catch(ex => console.log(ex));
    });
  };

  const loadStore = function (file) {
    return loadJs(`/stores/${file}.js`);
  };

  async function init() {

    Vue.prototype.$formatSize = function (bytes, si = false, dp = 1) {
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      };

      const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
      const r = 10 ** dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

      return bytes.toFixed(dp) + ' ' + units[u];
    };

    await loadStore('appStore');

    await loadHtml('/assets/app.html');

    await Promise.all(['image-info', 'error-load'].map(async (name) => {
      Vue.component(name, await loadModule(`/components/${name}.vue`, options));
    }));

  };
  // functions



  // main

  await init();

  const store = new Vuex.Store({
    modules: {
      appStore: window['store'].appStore,
    }
  });

  window.app = new Vue({
    el: '#app',
    store,
    data: {
      loading: false,
      width: 0,
      height: 0,
      size: 0,
      src: '',
      anotherSrc: '',
      error: '',
      error404Url: 'https://cdn-icons-png.flaticon.com/512/2748/2748614.png',
    },
    template: app.html,
    computed: {
      ...Vuex.mapGetters({
        imageUrl: 'appStore/getImageUrl',
      }),
      urlFunc() {
        return window.URL || window.webkitURL;
      }
    },
    mounted() {
      this.mainProcess('https://cdn-icons-png.flaticon.com/512/7172/7172168.png');
    },
    methods: {
      ...Vuex.mapActions({
        setImageUrl: 'appStore/setImageUrl',
      }),
      imageLoaded(ev) {
        if (!ev.path || !Array.isArray(ev.path) || ev.path.length === 0)
          return;

        var img = ev.path[0];
        // console.log(img, this.$refs.img);
        console.log(`image naturalWidth: ${img.naturalWidth}`);
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        this.loading = false;
      },
      loadError(ex) {
        console.log('loadError', ex);
        this.loading = false;
      },
      resetData() {
        this.error = '';
        this.width = 0;
        this.height = 0;
        this.size = 0;
      },
      loadAnother() {
        if (this.anotherSrc)
          this.mainProcess(this.anotherSrc);
      },
      setNotfound() {
        this.size = 0;
        this.error = 'Image url your enter does not exists or can not access.';
        this.mainProcess(this.error404Url);
      },
      mainProcess(url) {
        this.setImageUrl(url);
        this.loadImage();
      },
      loadImage() {
        if (this.imageUrl !== this.error404Url)
          this.resetData();
        this.loading = true;
        fetch(this.imageUrl).then(res => res.blob()).then(blob => {
          this.loading = false;
          if (blob.type.indexOf('text/html') === 0)
            this.setNotfound();
          else {
            this.size = blob.size;
            this.src = this.urlFunc.createObjectURL(blob);
          }
        }).catch(err => {
          this.loading = false;
          console.log('Error load image', err);
          if (!this.error)
            this.setNotfound();
        });
      },
    },
  });

  // main

})();
