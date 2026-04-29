export default (arr: Array<any>) => {
  const index = arr.findIndex((item: any) => item.data.top === true);
  if (index !== -1) {
    const [item] = arr.splice(index, 1);
    arr.unshift(item);
  }
  return arr;
}