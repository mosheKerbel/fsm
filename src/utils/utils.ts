/* Why did I create these functions instead of using libraries like lodash?
I had issues with Jest configuration to run these kind of libraries and I didn't want to spend more time on it.
/*/
export const generateUniqueId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }
  
    return uniqueId;
  }

type DeepCloneable = Record<string, any> | Array<any>;

export const cloneDeep = (obj: DeepCloneable): DeepCloneable => {
  if (obj === null || typeof obj !== 'object') {
    // If the object is null or not an object, return it as is
    return obj;
  }

  if (Array.isArray(obj)) {
    // If it's an array, clone each element recursively
    return obj.map((item) => cloneDeep(item));
  }

  // If it's an object, clone each property recursively
  const clonedObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = cloneDeep(obj[key]);
    }
  }

  return clonedObj;
}
