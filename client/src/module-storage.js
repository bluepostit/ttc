// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
function storageAvailable (type) {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0)
  }
}

export const ModuleStore = {
  store: (moduleData) => {
    if (!storageAvailable('localStorage')) {
      return
    }
    localStorage.setItem('modules', JSON.stringify(moduleData))
  },

  retrieve: () => {
    if (!storageAvailable('localStorage')) {
      return
    }
    const data = localStorage.getItem('modules')
    if (data) {
      return JSON.parse(data)
    }
  }
}
