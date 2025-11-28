export function objx(data: any, depth: number = 0): any {
  if (depth > 10) return data;
  
  if (typeof data === 'object' && data !== null) {
    const processed: any = Array.isArray(data) ? [] : {};
    
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        processed[key] = objx(data[key], depth + 1);
      }
    }
    
    return processed;
  }
  
  return data;
}
