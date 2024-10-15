export const getTypeInFloorConfig = (config, type) => {
  return config.find((item) => item.type === type)
}
