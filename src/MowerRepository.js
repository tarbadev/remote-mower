const { getSetting, setSetting } = window.api

export const getMowerId = () => getSetting('mower.id')
export const storeMowerId = id => {
  return setSetting('mower.id', id)
}